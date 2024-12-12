import { ContractInstances } from '@swarm/core/contracts/AbstractContract'
import { BPoolAddresses } from '@swarm/core/contracts/BPoolAddresses'
import abi from '@swarm/core/contracts/abi'
import { getCpk } from '@swarm/core/contracts/cpk'
import { getCurrentConfig } from '@swarm/core/observables/configForNetwork'
import { trackTransaction } from '@swarm/core/services/transactions-tracker'
import { SPT_DECIMALS } from '@swarm/core/shared/consts'
import {
  calcMultipleOutByPoolAmountIn,
  calcSingleOutByPoolAmountIn,
  calcSingleTokenAmountInByPoolAmountOut,
  calcTokenAmountInByPoolAmountOut,
} from '@swarm/core/shared/utils/calculations'
import { propEquals } from '@swarm/core/shared/utils/collection'
import { verify } from '@swarm/core/shared/utils/crypto'
import {
  big,
  denormalize,
  normalize,
  ZERO,
} from '@swarm/core/shared/utils/helpers'
import { isEnabled } from '@swarm/core/shared/utils/tokens'
import { PoolExpanded } from '@swarm/types/pool'
import { ExtendedNativeToken, ExtendedPoolToken } from '@swarm/types/tokens'
import { SwapSequence } from '@swarmmarkets/smart-order-router'
import { BigSource } from 'big.js'
import { BigNumber, utils } from 'ethers'

const { bPoolProxyAddress } = getCurrentConfig()

const BPoolProxyInterface = new utils.Interface(abi.BPoolProxy)

interface SwapModel {
  pool: string
  tokenIn: string
  tokenOut: string
  swapAmount: BigNumber
  limitReturnAmount: BigNumber
  maxPrice: BigNumber
}

interface ViewSplitOutput {
  swaps: SwapModel[]
  totalReturn: BigSource
}

export class BPoolProxy extends BPoolAddresses {
  static instances: ContractInstances<BPoolProxy> = {}

  static xTokenWrapperAddress: string

  static registryAddress: string

  static protocolFeeAddress: string

  static smtPriceFeedAddress: string

  static utilityToken: string

  static getInstance = async (): Promise<BPoolProxy> => {
    if (!BPoolProxy.instances[bPoolProxyAddress]) {
      BPoolProxy.instances[bPoolProxyAddress] = new BPoolProxy()
      await BPoolProxy.instances[bPoolProxyAddress].init()
    }
    return BPoolProxy.instances[bPoolProxyAddress]
  }

  public static async joinswapPoolAmountOut(
    account: string,
    pool: PoolExpanded,
    tokenIn: ExtendedPoolToken,
    poolAmountOut: BigSource,
  ) {
    // Verify bPoolProxy address is assigned
    verify(!!bPoolProxyAddress, 'BPoolProxy address is missing')

    // Verify the CPK is defined
    const cpk = await getCpk()
    verify(!!cpk, 'Could not obtain CPK')
    await cpk?.setXTokenWrapperAddress()

    const maxAmountIn = calcSingleTokenAmountInByPoolAmountOut(
      pool,
      poolAmountOut,
      tokenIn,
    )

    // Verify token approved
    verify(isEnabled(tokenIn, maxAmountIn), 'Not enough allowance')

    // Check if the CPK has enough balance of tokenIn
    // if not add a transferFrom transaction to the batch of the necessary amount from the user to the CPK
    if (tokenIn.cpkBalance?.lt(maxAmountIn)) {
      cpk?.transferTokenFrom(
        account,
        tokenIn.id,
        maxAmountIn.minus(tokenIn.cpkBalance || 0),
      )
    }

    // Approve tokenIn in the CPK to be spent by the XTokenWrapper
    cpk?.approveCpkTokenFor(
      tokenIn.id,
      'erc20',
      cpk?.xTokenWrapperAddress,
      maxAmountIn,
    )

    // Wrap tokenIn using the XTokenWrapper
    cpk?.wrapToken(tokenIn.id, maxAmountIn)

    // Approve BPoolProxy to use the CPK's ERC20 tokens
    cpk?.approveCpkTokenFor(
      tokenIn.xToken?.id || '',
      'xToken',
      bPoolProxyAddress,
      maxAmountIn,
    )

    // Prepare params of joinPool (poolAddress, poolAmountOut, MaxAmountsIn)
    const params = [
      pool.id,
      tokenIn.xToken?.id,
      denormalize(poolAmountOut, SPT_DECIMALS).toFixed(0),
      maxAmountIn.toFixed(0),
    ]

    cpk?.patchTxs({
      to: bPoolProxyAddress || '',
      data: BPoolProxyInterface.encodeFunctionData(
        'joinswapPoolAmountOut',
        params,
      ),
    })

    const resp = await cpk?.execStoredTxs().then(
      (transactionResult) => {
        trackTransaction(
          [tokenIn],
          [
            {
              id: pool.id,
              symbol: pool.liquidityPoolToken.symbol,
              name: pool.liquidityPoolToken.name,
              xToken: {
                id: pool.xPoolTokenAddress ?? '',
              },
            },
          ],
          [normalize(maxAmountIn, tokenIn.decimals).toFixed(tokenIn.decimals)],
          [big(poolAmountOut).toFixed(SPT_DECIMALS)],
          transactionResult,
          'joinPoolSingleIn',
        )

        return transactionResult
      },
      (error) => {
        throw error
      },
    )

    return resp
  }

  public static async joinswapExternAmountIn(
    account: string,
    pool: PoolExpanded,
    tokenIn: ExtendedPoolToken,
    minPoolAmountOut: BigSource,
  ) {
    // Verify bPoolProxy address is assigned
    verify(!!bPoolProxyAddress, 'BPoolProxy address is missing')

    // Verify the CPK is defined
    const cpk = await getCpk()
    verify(!!cpk, 'Could not obtain CPK')
    await cpk?.setXTokenWrapperAddress()

    const amount = calcSingleTokenAmountInByPoolAmountOut(
      pool,
      minPoolAmountOut,
      tokenIn,
    )

    const denormalizedXtokenInCpkBalance = denormalize(
      tokenIn.xToken?.cpkBalance ?? 0,
      tokenIn.decimals ?? 0,
    )

    const transferAmountIn = denormalizedXtokenInCpkBalance.lt(amount)
      ? amount.minus(denormalizedXtokenInCpkBalance)
      : ZERO

    const normalizedTransferAmountIn = normalize(
      transferAmountIn,
      tokenIn.decimals,
    )

    // Verify token approved
    verify(
      isEnabled(tokenIn, normalizedTransferAmountIn),
      'Not enough allowance',
    )

    // Check if the CPK has enough balance of tokenIn
    // if not add a transferFrom transaction to the batch of the necessary amount from the user to the CPK
    if (transferAmountIn.gt(0)) {
      cpk?.transferTokenFrom(account, tokenIn.id, transferAmountIn)
      // Approve tokenIn in the CPK to be spent by the XTokenWrapper
      cpk?.approveCpkTokenFor(
        tokenIn.id,
        'erc20',
        cpk?.xTokenWrapperAddress,
        transferAmountIn,
      )
      // Wrap tokenIn using the XTokenWrapper
      cpk?.wrapToken(tokenIn.id, transferAmountIn)
    }

    // Approve BPoolProxy to use the CPK's ERC20 tokens
    cpk?.approveCpkTokenFor(
      tokenIn.xToken?.id || '',
      'xToken',
      bPoolProxyAddress,
      amount,
    )

    // Prepare params of joinPool (poolAddress, tokenIn, tokenAmountIn, minPoolAmountOut)
    const params = [
      pool.id,
      tokenIn.xToken?.id,
      denormalize(amount, tokenIn.xToken?.decimals).toFixed(0),
      denormalize(minPoolAmountOut, SPT_DECIMALS).toFixed(0),
    ]

    cpk?.patchTxs({
      to: bPoolProxyAddress || '',
      data: BPoolProxyInterface.encodeFunctionData(
        'joinswapExternAmountIn',
        params,
      ),
    })

    const resp = await cpk?.execStoredTxs().then(
      (transactionResult) => {
        trackTransaction(
          [tokenIn],
          [
            {
              id: pool.id,
              symbol: pool.liquidityPoolToken.symbol,
              name: pool.liquidityPoolToken.name,
              xToken: {
                id: pool.xPoolTokenAddress ?? '',
              },
            },
          ],
          [normalize(amount, tokenIn.decimals).toFixed(tokenIn.decimals)],
          [big(minPoolAmountOut).toFixed(SPT_DECIMALS)],
          transactionResult,
          'joinPoolSingleIn',
        )

        return transactionResult
      },
      (error) => {
        throw error
      },
    )

    return resp
  }

  public static async joinPoolMultiple(
    account: string,
    pool: PoolExpanded,
    tokens: ExtendedPoolToken[],
    poolAmountOut: BigSource,
  ) {
    // Verify bPoolProxy address is assigned
    verify(!!bPoolProxyAddress, 'BPoolProxy address is missing')

    // Verify the CPK is defined
    const cpk = await getCpk()
    verify(!!cpk, 'Could not obtain CPK')
    await cpk?.setXTokenWrapperAddress()

    const amounts = tokens.map((token) =>
      calcTokenAmountInByPoolAmountOut(pool, poolAmountOut, token),
    )

    const transferAmounts = tokens.map(({ xToken, decimals }, idx) => {
      const denormalizedCpkBalance = denormalize(
        xToken?.cpkBalance ?? 0,
        decimals ?? 0,
      )

      return denormalizedCpkBalance.lt(amounts[idx])
        ? amounts[idx].minus(denormalizedCpkBalance)
        : ZERO
    })

    // Verify tokens approved
    verify(
      tokens.some((token, idx) =>
        isEnabled(token, normalize(transferAmounts[idx], token.decimals)),
      ),
      'Not enough allowance',
    )

    // For each ERC20 token, check if the CPK has enough balance
    // if not add a transferFrom transaction to the batch of the necessary amount from the user to the CPK
    tokens
      .filter((_, idx) => transferAmounts[idx].gt(0))
      .forEach(({ address }, idx) => {
        cpk?.transferTokenFrom(account, address, transferAmounts[idx])

        // Approve ERC20 tokens in the CPK to be spent by the XTokenWrapper
        cpk?.approveCpkTokenFor(
          address,
          'erc20',
          cpk?.xTokenWrapperAddress,
          transferAmounts[idx],
        )

        // Wrap ERC20 tokens using the XTokenWrapper
        cpk?.wrapToken(address, transferAmounts[idx])
      })

    // Approve BPoolProxy to use the CPK's ERC20 tokens
    tokens.forEach(({ xToken }, idx) =>
      cpk?.approveCpkTokenFor(
        xToken?.id || '',
        'xToken',
        bPoolProxyAddress,
        amounts[idx],
      ),
    )

    // Prepare params of joinPool (poolAddress, poolAmountOut, MaxAmountsIn)
    const params = [
      pool.id,
      denormalize(poolAmountOut, SPT_DECIMALS).toFixed(0),
      pool.tokensList.map((address) =>
        amounts[tokens.findIndex(propEquals('xToken.id', address))].toFixed(0),
      ),
    ]

    cpk?.patchTxs({
      to: bPoolProxyAddress || '',
      data: BPoolProxyInterface.encodeFunctionData('joinPool', params),
    })

    const resp = await cpk?.execStoredTxs().then(
      (transactionResult) => {
        trackTransaction(
          tokens,
          [
            {
              id: pool.id,
              symbol: pool.liquidityPoolToken.symbol,
              name: pool.liquidityPoolToken.name,
              xToken: {
                id: pool.xPoolTokenAddress ?? '',
              },
            },
          ],
          amounts.map((amount, i) =>
            normalize(amount.toFixed(0), tokens[i].decimals).toString(),
          ),
          [big(poolAmountOut).toFixed(SPT_DECIMALS).toString()],
          transactionResult,
          'joinPool',
        )

        return transactionResult
      },
      (error) => {
        throw error
      },
    )

    return resp
  }

  public static async joinPool(
    account: string,
    pool: PoolExpanded,
    tokens: ExtendedPoolToken | ExtendedPoolToken[],
    poolAmountOut: BigSource,
  ) {
    return Array.isArray(tokens)
      ? this.joinPoolMultiple(account, pool, tokens, poolAmountOut)
      : this.joinswapExternAmountIn(account, pool, tokens, poolAmountOut)
  }

  public static async exitPoolMultiple(
    account: string,
    pool: PoolExpanded,
    tokens: ExtendedPoolToken[],
    poolAmountIn: BigSource,
  ) {
    // Verify bPoolProxy address is assigned
    verify(!!bPoolProxyAddress, 'BPoolProxy address is missing')

    // Verify the CPK is defined
    const cpk = await getCpk()
    verify(!!cpk, 'Could not obtain CPK')
    await cpk?.setXTokenWrapperAddress()

    const denormalizedPoolAmountIn = denormalize(poolAmountIn, SPT_DECIMALS)

    const amounts = tokens.map((token) =>
      calcMultipleOutByPoolAmountIn(pool, poolAmountIn, token),
    )

    cpk?.approveCpkTokenFor(
      pool?.xPoolTokenAddress || '',
      'xToken',
      bPoolProxyAddress,
      denormalizedPoolAmountIn,
    )

    // Prepare params of exitPool (poolAddress, poolAmountOut, MaxAmountsIn)
    const params = [
      pool.id,
      denormalizedPoolAmountIn.toFixed(0),
      pool.tokensList.map((address) =>
        amounts[tokens.findIndex(propEquals('xToken.id', address))].toFixed(0),
      ),
    ]

    cpk?.patchTxs({
      to: bPoolProxyAddress || '',
      data: BPoolProxyInterface.encodeFunctionData('exitPool', params),
    })

    const tokenOutAmounts = tokens.map(({ xToken, decimals }, idx) =>
      amounts[idx].add(denormalize(xToken?.cpkBalance ?? 0, decimals ?? 0)),
    )

    tokens.forEach(({ xToken }, idx) =>
      cpk?.approveCpkTokenFor(
        xToken?.id || '',
        'xToken',
        cpk?.xTokenWrapperAddress,
        tokenOutAmounts[idx],
      ),
    )

    tokens.forEach(({ xToken }, idx) =>
      cpk?.unwrapXToken(xToken?.id || '', tokenOutAmounts[idx]),
    )

    tokens.forEach(({ address }, idx) =>
      cpk?.transferToken(account, address, tokenOutAmounts[idx]),
    )

    const resp = await cpk?.execStoredTxs().then(
      (transactionResult) => {
        trackTransaction(
          [
            {
              id: pool.id,
              symbol: pool.liquidityPoolToken.symbol,
              name: pool.liquidityPoolToken.name,
              xToken: {
                id: pool.xPoolTokenAddress ?? '',
              },
            },
          ],
          tokens,
          [
            normalize(
              denormalizedPoolAmountIn.toFixed(0),
              SPT_DECIMALS,
            ).toString(),
          ],
          amounts.map((amount, i) =>
            normalize(amount.toFixed(0), tokens[i].decimals).toString(),
          ),
          transactionResult,
          'exitPool',
        )

        return transactionResult
      },
      (error) => {
        throw error
      },
    )

    return resp
  }

  public static async exitPoolSingle(
    account: string,
    pool: PoolExpanded,
    tokenOut: ExtendedPoolToken,
    poolAmountIn: BigSource,
  ) {
    // Verify bPoolProxy address is assigned
    verify(!!bPoolProxyAddress, 'BPoolProxy address is missing')

    // Verify the CPK is defined
    const cpk = await getCpk()
    verify(!!cpk, 'Could not obtain CPK')
    await cpk?.setXTokenWrapperAddress()

    const denormalizedPoolAmountIn = denormalize(poolAmountIn, SPT_DECIMALS)

    const amount = calcSingleOutByPoolAmountIn(pool, poolAmountIn, tokenOut)

    cpk?.approveCpkTokenFor(
      pool?.xPoolTokenAddress || '',
      'xToken',
      bPoolProxyAddress,
      denormalizedPoolAmountIn,
    )

    // Prepare params of joinPool (poolAddress, poolAmountOut, MaxAmountsIn)
    const params = [
      pool.id,
      tokenOut.xToken?.id,
      denormalizedPoolAmountIn.toFixed(0),
      amount.toFixed(0),
    ]

    cpk?.patchTxs({
      to: bPoolProxyAddress || '',
      data: BPoolProxyInterface.encodeFunctionData(
        'exitswapPoolAmountIn',
        params,
      ),
    })

    const tokenOutAmount = amount.add(
      denormalize(tokenOut.xToken?.cpkBalance ?? 0, tokenOut.decimals ?? 0),
    )

    cpk?.approveCpkTokenFor(
      tokenOut?.xToken?.id || '',
      'xToken',
      cpk?.xTokenWrapperAddress,
      tokenOutAmount,
    )

    cpk?.unwrapXToken(tokenOut?.xToken?.id || '', tokenOutAmount)

    cpk?.transferToken(account, tokenOut.address, tokenOutAmount)

    const resp = await cpk?.execStoredTxs().then(
      (transactionResult) => {
        trackTransaction(
          [
            {
              id: pool.id,
              symbol: pool.liquidityPoolToken.symbol,
              name: pool.liquidityPoolToken.name,
              xToken: {
                id: pool.xPoolTokenAddress ?? '',
              },
            },
          ],
          [tokenOut],
          [
            normalize(
              denormalizedPoolAmountIn.toFixed(0),
              SPT_DECIMALS,
            ).toString(),
          ],
          [normalize(amount.toFixed(0), tokenOut.decimals).toString()],
          transactionResult,
          'exitPoolSingleOut',
        )

        return transactionResult
      },
      (error) => {
        throw error
      },
    )

    return resp
  }

  public static async exitPool(
    account: string,
    pool: PoolExpanded,
    tokens: ExtendedPoolToken | ExtendedPoolToken[],
    poolAmountIn: BigSource,
  ) {
    return Array.isArray(tokens)
      ? this.exitPoolMultiple(account, pool, tokens, poolAmountIn)
      : this.exitPoolSingle(account, pool, tokens, poolAmountIn)
  }

  public viewSplitExactIn = async (
    xTokenInAddress: string,
    xTokenOutAddress: string,
    swapDenormAmount: string,
    nPools: number,
  ): Promise<ViewSplitOutput> => {
    try {
      await this.init()
      const response: {
        swaps?: SwapModel[]
        totalOutput?: BigNumber
      } = await this.contract?.viewSplitExactIn(
        xTokenInAddress,
        xTokenOutAddress,
        swapDenormAmount,
        nPools,
      )

      return {
        swaps: response?.swaps || [],
        totalReturn: response?.totalOutput?.toString() || '0',
      }
    } catch {
      return { swaps: [], totalReturn: '0' }
    }
  }

  public viewSplitExactOut = async (
    xTokenInAddress: string,
    xTokenOutAddress: string,
    swapDenormAmount: string,
    nPools: number,
  ): Promise<ViewSplitOutput> => {
    try {
      await this.init()
      const response: {
        swaps?: SwapModel[]
        totalInput?: BigNumber
      } = await this.contract?.viewSplitExactOut(
        xTokenInAddress,
        xTokenOutAddress,
        swapDenormAmount,
        nPools,
      )

      return {
        swaps: response?.swaps || [],
        totalReturn: response?.totalInput?.toString() || '0',
      }
    } catch {
      return { swaps: [], totalReturn: '0' }
    }
  }

  public static async multihopBatchSwapExactInStatic(
    account: string,
    swaps: SwapSequence[],
    tokenIn: ExtendedNativeToken,
    tokenOut: ExtendedNativeToken,
    minAmountOut: BigSource,
    denormProtocolFee: BigSource,
    utilityToken?: ExtendedNativeToken,
  ) {
    // Verify bPoolProxy address is assigned
    verify(!!bPoolProxyAddress, 'BPoolProxy address is missing')

    // Verify the CPK is defined
    const cpk = getCpk()

    verify(!!cpk, 'Could not obtain CPK')
    await cpk?.setXTokenWrapperAddress()

    const useUtilityToken = typeof utilityToken !== 'undefined'
    const denormSMTFee = useUtilityToken ? big(denormProtocolFee) : ZERO

    // the exact amount to swap
    const swapExactInAmount = swaps.reduce(
      (total, [{ swapAmount }]) => total.plus(swapAmount),
      ZERO,
    )

    const minOut = denormalize(minAmountOut, tokenOut.decimals)

    const xTokenInCpkBalance = denormalize(
      tokenIn.xToken?.cpkBalance ?? 0,
      tokenIn.decimals ?? 0,
    )

    // The amount that BPoolProxy will transferFrom during the swap
    // including protocolFee if it is payed in tokenIn
    const transferIn = swapExactInAmount.add(
      useUtilityToken ? 0 : denormProtocolFee,
    )

    const transferAmountToCPK = xTokenInCpkBalance.lt(transferIn)
      ? transferIn.minus(xTokenInCpkBalance)
      : ZERO

    // For ERC20 token, check if the CPK has enough balance
    // if not add a transferFrom transaction to the batch of the necessary amount from the user to the CPK
    if (transferAmountToCPK.gt(0)) {
      // Verify token approved
      const normAmountToCpk = normalize(transferAmountToCPK, tokenIn.decimals)
      verify(isEnabled(tokenIn, normAmountToCpk), 'Not enough allowance')

      cpk?.transferTokenFrom(account, tokenIn.id, transferAmountToCPK)

      // Approve ERC20 token in the CPK to be spent by the XTokenWrapper
      cpk?.approveCpkTokenFor(
        tokenIn.id,
        'erc20',
        cpk?.xTokenWrapperAddress,
        transferAmountToCPK,
      )

      // Wrap ERC20 token using the XTokenWrapper
      cpk?.wrapToken(tokenIn.id, transferAmountToCPK)
    }

    if (useUtilityToken && utilityToken) {
      const utilityTokenCpkBalance = denormalize(
        utilityToken?.cpkBalance ?? 0,
        utilityToken?.decimals ?? 0,
      )

      const utilityTokenTransferAmount = utilityTokenCpkBalance.lt(denormSMTFee)
        ? denormSMTFee.minus(utilityTokenCpkBalance)
        : ZERO

      const normAmountToCpk = normalize(
        utilityTokenTransferAmount,
        utilityToken.decimals,
      )
      verify(
        isEnabled(utilityToken, normAmountToCpk),
        'Not enough allowance (SMT)',
      )

      if (utilityTokenTransferAmount.gt(0)) {
        // Verify utilityToken approved

        cpk?.transferTokenFrom(
          account,
          utilityToken.id,
          utilityTokenTransferAmount,
        )
      }

      cpk?.approveCpkTokenFor(
        utilityToken?.id || '',
        'erc20',
        bPoolProxyAddress,
        denormSMTFee,
      )
    }

    // Approve BPoolProxy to use the CPK's xToken
    cpk?.approveCpkTokenFor(
      tokenIn.xToken?.id || '',
      'xToken',
      bPoolProxyAddress,
      transferIn,
    )

    const params = [
      swaps,
      tokenIn.xToken?.id,
      tokenOut.xToken?.id,
      swapExactInAmount.toFixed(0),
      minOut.toFixed(0),
      useUtilityToken,
    ]

    cpk?.patchTxs({
      to: bPoolProxyAddress || '',
      data: BPoolProxyInterface.encodeFunctionData(
        'multihopBatchSwapExactIn',
        params,
      ),
    })

    const xTokenOutCpkBalance = denormalize(
      tokenOut.xToken?.cpkBalance ?? 0,
      tokenOut.decimals ?? 0,
    )

    const tokenOutAmount = minOut.add(xTokenOutCpkBalance)

    cpk?.approveCpkTokenFor(
      tokenOut.xToken?.id || '',
      'xToken',
      cpk?.xTokenWrapperAddress,
      tokenOutAmount,
    )

    cpk?.unwrapXToken(tokenOut.xToken?.id || '', tokenOutAmount)

    cpk?.transferToken(account, tokenOut.id, tokenOutAmount)

    return { cpk, storedTxs: cpk.storedTxs, minOut, swapExactInAmount }
  }

  public static async multihopBatchSwapExactIn(
    account: string,
    swaps: SwapSequence[],
    tokenIn: ExtendedNativeToken,
    tokenOut: ExtendedNativeToken,
    minAmountOut: BigSource,
    denormProtocolFee: BigSource,
    utilityToken?: ExtendedNativeToken,
  ) {
    const { cpk, swapExactInAmount, minOut } =
      await this.multihopBatchSwapExactInStatic(
        account,
        swaps,
        tokenIn,
        tokenOut,
        minAmountOut,
        denormProtocolFee,
        utilityToken,
      )

    return cpk?.execStoredTxs().then(
      (transactionResult) => {
        trackTransaction(
          [tokenIn],
          [tokenOut],
          [
            normalize(
              swapExactInAmount.toFixed(0),
              tokenIn.decimals,
            ).toString(),
          ],
          [normalize(minOut.toFixed(0), tokenOut.decimals).toString()],
          transactionResult,
          'swap',
        )

        return transactionResult
      },
      (error) => {
        throw error
      },
    )
  }

  public static async multihopBatchSwapExactOutStatic(
    account: string,
    swaps: SwapSequence[],
    tokenIn: ExtendedNativeToken,
    tokenOut: ExtendedNativeToken,
    maxTotalAmountIn: BigSource,
    denormProtocolFee: BigSource,
    utilityToken?: ExtendedNativeToken,
  ) {
    // Verify bPoolProxy address is assigned
    verify(!!bPoolProxyAddress, 'BPoolProxy address is missing')

    // Verify the CPK is defined
    const cpk = getCpk()

    verify(!!cpk, 'Could not obtain CPK')
    await cpk?.setXTokenWrapperAddress()

    const useUtilityToken = typeof utilityToken !== 'undefined'
    const denormSMTFee = useUtilityToken ? big(denormProtocolFee) : ZERO

    const maxSwapAmountIn = denormalize(maxTotalAmountIn, tokenIn.decimals)

    const exactOut = swaps.reduce(
      (acc, sequence) => acc.add(sequence[sequence.length - 1].swapAmount),
      ZERO,
    )

    const xTokenInCpkBalance = denormalize(
      tokenIn.xToken?.cpkBalance ?? 0,
      tokenIn.decimals ?? 0,
    )

    // The amount that BPoolProxy will transferFrom during the swap
    // including protocolFee if it is payed in tokenIn
    const transferIn = maxSwapAmountIn.add(
      useUtilityToken ? 0 : denormProtocolFee,
    )

    const transferAmountToCPK = xTokenInCpkBalance.lt(transferIn)
      ? transferIn.minus(xTokenInCpkBalance)
      : ZERO

    // For ERC20 token, check if the CPK has enough balance
    // if not add a transferFrom transaction to the batch of the necessary amount from the user to the CPK
    if (transferAmountToCPK.gt(0)) {
      // Verify token approved
      verify(isEnabled(tokenIn, transferAmountToCPK), 'Not enough allowance')

      cpk?.transferTokenFrom(account, tokenIn.id, transferAmountToCPK)

      // Approve ERC20 token in the CPK to be spent by the XTokenWrapper
      cpk?.approveCpkTokenFor(
        tokenIn.id,
        'erc20',
        cpk?.xTokenWrapperAddress,
        transferAmountToCPK,
      )

      // Wrap ERC20 token using the XTokenWrapper
      cpk?.wrapToken(tokenIn.id, transferAmountToCPK)
    }

    if (useUtilityToken && utilityToken) {
      // Verify utilityToken approved
      const utilityTokenCpkBalance = denormalize(
        utilityToken?.cpkBalance ?? 0,
        utilityToken?.decimals ?? 0,
      )

      const utilityTokenTransferAmount = utilityTokenCpkBalance.lt(denormSMTFee)
        ? denormSMTFee.minus(utilityTokenCpkBalance)
        : ZERO

      if (utilityTokenTransferAmount.gt(0)) {
        verify(
          isEnabled(utilityToken, utilityTokenTransferAmount),
          'Not enough allowance (SMT)',
        )

        cpk?.transferTokenFrom(
          account,
          utilityToken.id,
          utilityTokenTransferAmount,
        )
      }

      cpk?.approveCpkTokenFor(
        utilityToken.id,
        'erc20',
        bPoolProxyAddress,
        denormSMTFee,
      )
    }

    // Approve BPoolProxy to use the CPK's xToken
    cpk?.approveCpkTokenFor(
      tokenIn.xToken?.id || '',
      'xToken',
      bPoolProxyAddress,
      transferIn,
    )

    const params = [
      swaps,
      tokenIn.xToken?.id,
      tokenOut.xToken?.id,
      maxSwapAmountIn.toFixed(0),
      useUtilityToken,
    ]

    cpk?.patchTxs({
      to: bPoolProxyAddress || '',
      data: BPoolProxyInterface.encodeFunctionData(
        'multihopBatchSwapExactOut',
        params,
      ),
    })

    const xTokenOutCpkBalance = denormalize(
      tokenOut.xToken?.cpkBalance ?? 0,
      tokenOut.decimals ?? 0,
    )

    const tokenOutAmount = exactOut.add(xTokenOutCpkBalance)

    cpk?.unwrapXToken(tokenOut.xToken?.id || '', tokenOutAmount)

    cpk?.transferToken(account, tokenOut.id, tokenOutAmount)

    return { cpk, storedTxs: cpk?.storedTxs, maxSwapAmountIn, tokenOutAmount }
  }

  public static async multihopBatchSwapExactOut(
    account: string,
    swaps: SwapSequence[],
    tokenIn: ExtendedNativeToken,
    tokenOut: ExtendedNativeToken,
    maxTotalAmountIn: BigSource,
    denormProtocolFee: BigSource,
    utilityToken?: ExtendedNativeToken,
  ) {
    const { cpk, maxSwapAmountIn, tokenOutAmount } =
      await this.multihopBatchSwapExactOutStatic(
        account,
        swaps,
        tokenIn,
        tokenOut,
        maxTotalAmountIn,
        denormProtocolFee,
        utilityToken,
      )

    return cpk?.execStoredTxs().then(
      (transactionResult) => {
        trackTransaction(
          [tokenIn],
          [tokenOut],
          [normalize(maxSwapAmountIn.toFixed(0), tokenIn.decimals).toString()],
          [normalize(tokenOutAmount, tokenOut.decimals).toString()],
          transactionResult,
          'swap',
        )

        return transactionResult
      },
      (error) => {
        throw error
      },
    )
  }
}
