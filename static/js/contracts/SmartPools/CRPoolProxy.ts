import AbstractContract, {
  ContractInstances,
} from '@swarm/core/contracts/AbstractContract'
import { Erc20 } from '@swarm/core/contracts/ERC20'
import { XTokenWrapper } from '@swarm/core/contracts/XTokenWrapper'
import { getCpk } from '@swarm/core/contracts/cpk'
import { getCurrentConfig } from '@swarm/core/observables/configForNetwork'
import { big, ZERO } from '@swarm/core/shared/utils/helpers/big-helpers'
import Big from 'big.js'
import { Transaction, TransactionResult } from 'contract-proxy-kit'
import { ethers, Signer } from 'ethers'

import abi from './abi'
import type { CRPoolProxy as CRPoolProxyContract } from './typechain'

const { crpoolProxyAddress } = getCurrentConfig()

const CRPoolProxyInterface = new ethers.utils.Interface(abi.CRPoolProxy)

export class CRPoolProxy extends AbstractContract {
  static instances: ContractInstances<CRPoolProxy> = {}

  contract: CRPoolProxyContract | undefined

  constructor(address: string, signer?: Signer) {
    super(address, abi.CRPoolProxy, signer)
  }

  static async getInstance(): Promise<CRPoolProxy> {
    if (!crpoolProxyAddress) {
      throw new Error(`CRPoolProxy doesn't exist on this network`)
    }

    if (CRPoolProxy.instances[crpoolProxyAddress] === undefined) {
      CRPoolProxy.instances[crpoolProxyAddress] = new CRPoolProxy(
        crpoolProxyAddress,
      )
      await CRPoolProxy.instances[crpoolProxyAddress].init()
    }
    return CRPoolProxy.instances[crpoolProxyAddress]
  }

  public async getUpdateWeightCost(
    crpoolAddress: string,
    xTokenAddress: string,
    newWeight: ethers.BigNumber,
  ): Promise<Big | undefined> {
    this.init()

    if (this.contract === undefined) {
      return undefined
    }

    const updateWeightCost = await this.contract.getUpdateWeightCost(
      crpoolAddress,
      xTokenAddress,
      newWeight,
    )

    return big(updateWeightCost.toString())
  }

  public async getUpdateWeightEarnings(
    crpoolAddress: string,
    xTokenAddress: string,
    newWeight: ethers.BigNumber,
  ): Promise<Big | undefined> {
    this.init()

    if (this.contract === undefined) {
      return undefined
    }

    const updateWeightEarnings = await this.contract.getUpdateWeightEarnings(
      crpoolAddress,
      xTokenAddress,
      newWeight,
    )

    return big(updateWeightEarnings.toString())
  }

  public async getRemoveTokenCost(
    crpoolAddress: string,
    xTokenAddress: string,
  ): Promise<Big | undefined> {
    this.init()

    if (this.contract === undefined) {
      return undefined
    }

    const removeTokenCost = await this.contract.getRemoveTokenCost(
      crpoolAddress,
      xTokenAddress,
    )

    return big(removeTokenCost.toString())
  }

  public async getRemoveTokenEarnings(
    crpoolAddress: string,
    xTokenAddress: string,
  ): Promise<Big | undefined> {
    this.init()

    if (this.contract === undefined) {
      return undefined
    }

    const removeTokenEarnings = await this.contract.getRemoveTokenEarnings(
      crpoolAddress,
      xTokenAddress,
    )

    return big(removeTokenEarnings.toString())
  }

  public async getJoinPoolAmountsIn(
    crpoolAddress: string,
    lptAmountOut: ethers.BigNumber,
    maxAmountsIn: ethers.BigNumber[],
  ): Promise<Big[] | undefined> {
    this.init()

    if (this.contract === undefined) {
      return undefined
    }

    const amountsIn = await this.contract.getJoinPoolAmountsIn(
      crpoolAddress,
      lptAmountOut,
      maxAmountsIn,
    )

    return amountsIn.map((amountIn) => {
      return big(amountIn.toString())
    })
  }

  public async getJoinswapExternAmountInPoolAmountOut(
    crpoolAddress: string,
    xTokenInAddress: string,
    xTokenInAmount: string,
    minimumLptAmountOut: ethers.BigNumber,
  ): Promise<Big | undefined> {
    this.init()

    if (this.contract === undefined) {
      return undefined
    }

    const amountOut =
      await this.contract.getJoinswapExternAmountInPoolAmountOut(
        crpoolAddress,
        xTokenInAddress,
        xTokenInAmount,
        minimumLptAmountOut,
      )

    return big(amountOut.toString())
  }

  public async getExitPoolAmountsOut(
    crpoolAddress: string,
    lptAmountIn: ethers.BigNumber,
    minAmountsOut: ethers.BigNumber[],
  ): Promise<Big[] | undefined> {
    this.init()

    if (this.contract === undefined) {
      return undefined
    }

    const amountsOut = await this.contract.getExitPoolAmountsOut(
      crpoolAddress,
      lptAmountIn,
      minAmountsOut,
    )

    return amountsOut.map((amountOut) => {
      return big(amountOut.toString())
    })
  }

  public async getExitswapPoolAmountInTokenOutAmount(
    crpoolAddress: string,
    xTokenOutAddress: string,
    lptAmountIn: ethers.BigNumber,
    minAmountOut: ethers.BigNumber,
  ): Promise<Big | undefined> {
    this.init()

    if (this.contract === undefined) {
      return undefined
    }

    const amountOut = await this.contract.getExitswapPoolAmountInTokenOutAmount(
      crpoolAddress,
      xTokenOutAddress,
      lptAmountIn,
      minAmountOut,
    )

    return big(amountOut.toString())
  }

  public async applyToken(
    account: string,
    crpoolAddress: string,
    tokenAddress: string,
    initialBalance: string,
  ): Promise<TransactionResult | undefined> {
    this.init()

    if (this.contract === undefined) {
      return undefined
    }

    this.updateSigner()

    const cpk = await getCpk()
    if (cpk === null || cpk === undefined) {
      return undefined
    }

    await cpk.setXTokenWrapperAddress()

    const bigInitialToken = big(initialBalance)

    // 1. The CPK transfers from the user to itself the new token amount
    cpk.transferTokenFrom(account, tokenAddress, bigInitialToken)

    // 2. The CPK wraps the tokens with the xTokenWrapper
    cpk.approveCpkTokenFor(
      tokenAddress,
      'erc20',
      cpk.xTokenWrapperAddress,
      bigInitialToken,
    )
    cpk.wrapToken(tokenAddress, bigInitialToken)

    // 3. The CPK approves the CRPoolProxy contract to use all its xToken balance
    const xTokenAddress = await XTokenWrapper.tokenToXToken(tokenAddress)
    cpk.approveCpkTokenFor(
      xTokenAddress,
      'xToken',
      this.address,
      bigInitialToken,
    )

    // 4. The CPK calls applyAddToken on the CRPoolProxy contract
    const applyAddTokenTransaction =
      await this.contract.populateTransaction.applyAddToken(crpoolAddress)
    cpk.patchTxs(applyAddTokenTransaction as Transaction)

    return cpk.execStoredTxs()
  }

  public async removeToken(
    account: string,
    crpoolAddress: string,
    tokenAddress: string,
  ): Promise<TransactionResult | undefined> {
    this.init()

    if (this.contract === undefined) {
      return undefined
    }

    this.updateSigner()

    const cpk = await getCpk()
    if (cpk === null || cpk === undefined) {
      return undefined
    }

    const xTokenAddress = await XTokenWrapper.tokenToXToken(tokenAddress)

    const xLPTCost = await this.getRemoveTokenCost(crpoolAddress, xTokenAddress)
    if (xLPTCost === undefined) {
      return undefined
    }

    const tokenEarnings = await this.getRemoveTokenEarnings(
      crpoolAddress,
      xTokenAddress,
    )
    if (tokenEarnings === undefined) {
      return undefined
    }

    // 1. The CPK approves the CRPoolProxy contract to use the token removal xLPT cost
    const xLPTAddress = await XTokenWrapper.tokenToXToken(crpoolAddress)
    cpk.approveCpkTokenFor(xLPTAddress, 'xToken', this.address, xLPTCost)

    // 2. The CPK calls `removeToken` on the CRPoolProxy contract
    const removeTokenTransaction =
      await this.contract.populateTransaction.removeToken(
        crpoolAddress,
        xTokenAddress,
      )
    cpk.patchTxs(removeTokenTransaction as Transaction)

    // 3. The CPK unwraps the obtained xToken with the xTokenWrapper
    cpk.approveCpkTokenFor(
      xTokenAddress,
      'xToken',
      cpk.xTokenWrapperAddress,
      tokenEarnings,
    )
    cpk.unwrapXToken(xTokenAddress, tokenEarnings)

    // 4. The CPK sends those tokens to the user
    cpk.transferToken(account, tokenAddress, tokenEarnings)

    return cpk.execStoredTxs()
  }

  public async updateWeightInstantly(
    account: string,
    crpoolAddress: string,
    tokenAddress: string,
    currentTokenWeight: ethers.BigNumber,
    newTokenWeight: ethers.BigNumber,
  ): Promise<TransactionResult | undefined> {
    this.init()

    if (this.contract === undefined) {
      return undefined
    }

    this.updateSigner()

    const cpk = await getCpk()
    if (cpk === null || cpk === undefined) {
      return undefined
    }

    await cpk.setXTokenWrapperAddress()

    const isIncreasing = newTokenWeight.gt(currentTokenWeight)

    const xTokenAddress = await XTokenWrapper.tokenToXToken(tokenAddress)

    const cost = await this.getUpdateWeightCost(
      crpoolAddress,
      xTokenAddress,
      newTokenWeight,
    )
    if (cost === undefined) {
      return undefined
    }

    const earnings = await this.getUpdateWeightEarnings(
      crpoolAddress,
      xTokenAddress,
      newTokenWeight,
    )
    if (earnings === undefined) {
      return undefined
    }

    if (isIncreasing) {
      // 1. The CPK transfers the token weight update token cost from the user to itself
      cpk.transferTokenFrom(account, tokenAddress, cost)

      // 2. The CPK wraps those tokens via the xTokenWrapper
      cpk.approveCpkTokenFor(
        tokenAddress,
        'erc20',
        cpk.xTokenWrapperAddress,
        cost,
      )
      cpk.wrapToken(tokenAddress, cost)

      // 3. The CPK approves the CRPoolProxy contract to use all its xToken balance
      cpk.approveCpkTokenFor(xTokenAddress, 'xToken', this.address, cost)

      // 4. The CPK calls `updateWeight` on the CRPoolProxy contract
      const updateWeightTransaction =
        await this.contract.populateTransaction.updateWeight(
          crpoolAddress,
          xTokenAddress,
          newTokenWeight,
        )
      cpk.patchTxs(updateWeightTransaction as Transaction)

      // some xLPT will be received, but we keep them in the CPK as the user never holds LPT

      return cpk.execStoredTxs()
    }

    // 1. The CPK approves the CRPoolProxy contract to use the update token weight xLPT cost
    const xLPTAddress = await XTokenWrapper.tokenToXToken(crpoolAddress)
    cpk.approveCpkTokenFor(xLPTAddress, 'xToken', this.address, cost)

    // 2. The CPK calls `updateWeight` on the CRPoolProxy contract
    const updateWeightTransaction =
      await this.contract.populateTransaction.updateWeight(
        crpoolAddress,
        xTokenAddress,
        newTokenWeight,
      )
    cpk.patchTxs(updateWeightTransaction as Transaction)

    // 3. The CPK unwraps the obtained xToken with the xTokenWrapper
    cpk.approveCpkTokenFor(
      xTokenAddress,
      'xToken',
      cpk.xTokenWrapperAddress,
      earnings,
    )
    cpk.unwrapXToken(xTokenAddress, earnings)

    // 4. The CPK sends those tokens to the user
    cpk.transferToken(account, tokenAddress, earnings)

    return cpk.execStoredTxs()
  }

  public async joinswapExternAmountIn(
    account: string,
    crpoolAddress: string,
    tokenAddress: string,
    tokenInAmount: ethers.BigNumber,
    minimumLptAmountOut: ethers.BigNumber,
  ): Promise<TransactionResult | undefined> {
    this.init()
    this.updateSigner()

    const cpk = getCpk()
    await cpk.setXTokenWrapperAddress()

    const xTokenAddress = await XTokenWrapper.tokenToXToken(tokenAddress)

    const xTokenContract = await Erc20.getInstance(xTokenAddress)
    const xTokenCpkBalance = await xTokenContract.balanceOf(cpk.address)

    const missingXTokenAmount = big(tokenInAmount.toString()).minus(
      xTokenCpkBalance,
    )

    // Check if the CPK has enough balance of tokenIn
    // if not add a transferFrom transaction to the batch of the necessary amount from the user to the CPK
    if (missingXTokenAmount.gt(0)) {
      cpk.transferTokenFrom(account, tokenAddress, missingXTokenAmount)
      cpk.approveCpkTokenFor(
        tokenAddress,
        'erc20',
        cpk.xTokenWrapperAddress,
        missingXTokenAmount,
      )
      cpk.wrapToken(tokenAddress, missingXTokenAmount)
    }

    // Approve CRPoolProxy to use the CPK's xTokens
    cpk.approveCpkTokenFor(
      xTokenAddress,
      'xToken',
      this.address,
      big(tokenInAmount.toString()),
    )

    // Do the actual call
    cpk.patchTxs({
      to: this.address,
      data: CRPoolProxyInterface.encodeFunctionData('joinswapExternAmountIn', [
        crpoolAddress,
        xTokenAddress,
        tokenInAmount,
        minimumLptAmountOut,
      ]),
    })

    return cpk.execStoredTxs()
  }

  public async joinPool(
    account: string,
    crpoolAddress: string,
    xTokensAddresses: string[],
    tokensInMaxAmounts: ethers.BigNumber[],
    lptAmountOut: ethers.BigNumber,
  ): Promise<TransactionResult> {
    this.init()
    this.updateSigner()

    const cpk = getCpk()
    await cpk.setXTokenWrapperAddress()

    const tokensAddresses = await Promise.all(
      xTokensAddresses.map(XTokenWrapper.xTokenToToken),
    )

    const xTokensCpkBalances = await Promise.all(
      xTokensAddresses.map(async (xTokenAddress) => {
        const xTokenContract = await Erc20.getInstance(xTokenAddress)
        return xTokenContract.balanceOf(cpk.address)
      }),
    )

    const missingXTokensAmounts = tokensInMaxAmounts.map(
      (tokenInMaxAmount, index) => {
        if (tokenInMaxAmount === undefined) {
          return ethers.constants.Zero
        }
        return tokenInMaxAmount.sub(xTokensCpkBalances[index].toFixed(0))
      },
    )

    // Check if the CPK has enough balance of tokenIn
    // if not add a transferFrom transaction to the batch of the necessary amount from the user to the CPK
    missingXTokensAmounts.forEach((_missingXTokenAmount, index) => {
      if (_missingXTokenAmount.isZero()) {
        return
      }

      const tokenAddress = tokensAddresses[index]
      const missingXTokenAmount = big(_missingXTokenAmount.toString())

      cpk.transferTokenFrom(account, tokenAddress, missingXTokenAmount)
      cpk.approveCpkTokenFor(
        tokenAddress,
        'erc20',
        cpk.xTokenWrapperAddress,
        missingXTokenAmount,
      )
      cpk.wrapToken(tokenAddress, missingXTokenAmount)
    })

    tokensInMaxAmounts.forEach((tokenInMaxAmount, index) => {
      if (tokenInMaxAmount === undefined) {
        return
      }
      cpk.approveCpkTokenFor(
        xTokensAddresses[index],
        'xToken',
        this.address,
        big(tokenInMaxAmount.toString()),
      )
    })

    cpk.patchTxs({
      to: this.address,
      data: CRPoolProxyInterface.encodeFunctionData('joinPool', [
        crpoolAddress,
        lptAmountOut,
        tokensInMaxAmounts,
      ]),
    })

    return cpk.execStoredTxs()
  }

  public async exitswapPoolAmountIn(
    account: string,
    crpoolAddress: string,
    tokenAddress: string,
    lptAmountIn: ethers.BigNumber,
    tokenOutMinAmount: ethers.BigNumber,
  ): Promise<TransactionResult> {
    this.init()
    this.updateSigner()

    const cpk = getCpk()
    await cpk.setXTokenWrapperAddress()

    const xTokenAddress = await XTokenWrapper.tokenToXToken(tokenAddress)

    // Approve CPK to use all the user's xLPT
    const xLPTAddress = await XTokenWrapper.tokenToXToken(crpoolAddress)
    cpk.approveCpkTokenFor(
      xLPTAddress,
      'xToken',
      this.address,
      big(lptAmountIn.toString()),
    )

    // Do the actual call
    cpk.patchTxs({
      to: this.address,
      data: CRPoolProxyInterface.encodeFunctionData('exitswapPoolAmountIn', [
        crpoolAddress,
        xTokenAddress,
        lptAmountIn,
        tokenOutMinAmount,
      ]),
    })

    // Send obtained xToken to the user
    // (we are adding the current xToken CPK balance instead of using getExitswapPoolAmountInTokenOutAmount to return leftovers)
    const xTokenContract = await Erc20.getInstance(xTokenAddress)
    const xTokenCpkBalance = await xTokenContract.balanceOf(cpk.address)

    const obtainedXTokenAmount = xTokenCpkBalance.add(
      tokenOutMinAmount.toString(),
    )

    cpk.approveCpkTokenFor(
      xTokenAddress,
      'xToken',
      cpk.xTokenWrapperAddress,
      obtainedXTokenAmount,
    )
    cpk.unwrapXToken(xTokenAddress, obtainedXTokenAmount)
    cpk.transferToken(account, tokenAddress, obtainedXTokenAmount)

    return cpk.execStoredTxs()
  }

  public async exitPool(
    account: string,
    crpoolAddress: string,
    xTokensAddresses: string[],
    lptAmountIn: ethers.BigNumber,
    tokensOutMinAmounts: ethers.BigNumber[],
  ): Promise<TransactionResult> {
    this.init()
    this.updateSigner()

    const cpk = getCpk()
    await cpk.setXTokenWrapperAddress()

    // Approve CPK to use all the user's xLPT
    const xLPTAddress = await XTokenWrapper.tokenToXToken(crpoolAddress)
    cpk.approveCpkTokenFor(
      xLPTAddress,
      'xToken',
      this.address,
      big(lptAmountIn.toString()),
    )

    // Do the actual call
    cpk.patchTxs({
      to: this.address,
      data: CRPoolProxyInterface.encodeFunctionData('exitPool', [
        crpoolAddress,
        lptAmountIn,
        tokensOutMinAmounts,
      ]),
    })

    // Send obtained xToken to the user
    // (we are adding the current xToken CPK balance instead of using getExitPoolAmountsOut to return leftovers)
    const xTokensCpkBalances = await Promise.all(
      xTokensAddresses.map(async (xTokenAddress) => {
        const xTokenContract = await Erc20.getInstance(xTokenAddress)
        return xTokenContract.balanceOf(cpk.address)
      }),
    )
    const obtainedXTokensAmounts = xTokensCpkBalances.map(
      (xTokenCpkBalance, index) => {
        const tokenOutMinAmount = tokensOutMinAmounts[index]
        if (tokenOutMinAmount === undefined) {
          return ZERO
        }
        return xTokenCpkBalance.add(tokenOutMinAmount.toString())
      },
    )

    const tokenAddresses = await Promise.all(
      xTokensAddresses.map(XTokenWrapper.xTokenToToken),
    )

    obtainedXTokensAmounts.forEach((obtainedXTokenAmount, index) => {
      if (obtainedXTokenAmount.eq(ZERO)) {
        return
      }

      const xTokenAddress = xTokensAddresses[index]
      const tokenAddress = tokenAddresses[index]

      cpk.approveCpkTokenFor(
        xTokenAddress,
        'xToken',
        cpk.xTokenWrapperAddress,
        obtainedXTokenAmount,
      )
      cpk.unwrapXToken(xTokenAddress, obtainedXTokenAmount)
      cpk.transferToken(account, tokenAddress, obtainedXTokenAmount)
    })

    return cpk.execStoredTxs()
  }
}
