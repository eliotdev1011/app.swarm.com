import AbstractContract from '@swarm/core/contracts/AbstractContract'
import { getCpk } from '@swarm/core/contracts/cpk'
import { getCurrentConfig } from '@swarm/core/observables/configForNetwork'
import { SPT_DECIMALS } from '@swarm/core/shared/consts'
import { verify } from '@swarm/core/shared/utils/crypto'
import { big, denormalize } from '@swarm/core/shared/utils/helpers/big-helpers'
import { account$ } from '@swarm/core/web3'
import { SmartPoolRights } from '@swarm/types'
import { ExtendedPoolToken } from '@swarm/types/tokens'
import { BigSource } from 'big.js'
import { utils } from 'ethers'
import map from 'lodash/map'

import abi from './abi'

const { actionManagerAddress } = getCurrentConfig()

const ActionManagerInterface = new utils.Interface(abi.ActionManager)

const POOL_TOKEN_WEIGHT_DECIMALS = 18
const POOL_SWAP_FEE_DECIMALS = 18

class ActionManager extends AbstractContract {
  constructor() {
    super(actionManagerAddress, abi.ActionManager)
  }

  static getInstance = async (): Promise<ActionManager> => {
    if (!ActionManager.instances[actionManagerAddress]) {
      ActionManager.instances[actionManagerAddress] = new ActionManager()
    }
    return ActionManager.instances[actionManagerAddress]
  }

  static async createCorePool(
    tokens: ExtendedPoolToken[],
    amounts: BigSource[],
    weights: BigSource[],
    swapFee: BigSource,
    poolTokenName: string,
  ) {
    const account = account$.getValue()
    const cpk = await getCpk()

    verify(account !== undefined, 'Could not obtain account')
    verify(cpk !== null && cpk !== undefined, 'Could not obtain CPK')

    if (!account || !cpk) {
      return undefined
    }

    const poolTokenIds = map(tokens, 'id')

    const denormalizedAmounts = amounts.map((amount, idx) => {
      return denormalize(amount, tokens[idx].decimals).toFixed(0)
    })

    const denormalizedWeights = weights.map((weight) => {
      return denormalize(weight, POOL_TOKEN_WEIGHT_DECIMALS).toFixed(0)
    })

    const denormalizedSwapFee = denormalize(
      swapFee,
      POOL_SWAP_FEE_DECIMALS,
    ).toFixed(0)

    // Send tokens to CPK
    tokens.forEach((token, idx) => {
      if (token.cpkBalance?.lt(amounts[idx])) {
        cpk.transferTokenFrom(
          account,
          token.address,
          denormalize(
            big(amounts[idx]).minus(token.cpkBalance),
            token.decimals,
          ),
        )
      }
    })

    // Approve CPK to spend tokens on ActionManager
    tokens.forEach((token, idx) => {
      cpk.approveCpkTokenFor(
        token.address,
        'xToken',
        actionManagerAddress,
        denormalize(amounts[idx], token.decimals),
      )
    })

    const params = [
      poolTokenIds,
      denormalizedAmounts,
      denormalizedSwapFee,
      denormalizedWeights,
      poolTokenName,
    ]

    cpk.patchTxs({
      to: actionManagerAddress,
      data: ActionManagerInterface.encodeFunctionData(
        'standardPoolCreation',
        params,
      ),
    })

    return cpk.execStoredTxs()
  }

  static async createSmartPool(
    tokens: ExtendedPoolToken[],
    amounts: BigSource[],
    weights: BigSource[],
    swapFee: BigSource,
    poolTokenName: string,
    poolTokenSymbol: string,
    poolTokenInitialSupply: BigSource,
    poolRights: SmartPoolRights,
    poolMinimumGradualUpdateDuration: number,
    poolAddTokenTimeLockDuration: number,
  ) {
    const account = account$.getValue()
    const cpk = await getCpk()

    verify(account !== undefined, 'Could not obtain account')
    verify(cpk !== null && cpk !== undefined, 'Could not obtain CPK')

    if (!account || !cpk) {
      return undefined
    }

    const poolTokenIds = map(tokens, 'id')

    const denormalizedAmounts = amounts.map((amount, idx) => {
      return denormalize(amount, tokens[idx].decimals).toFixed(0)
    })

    const denormalizedWeights = weights.map((weight) => {
      return denormalize(weight, POOL_TOKEN_WEIGHT_DECIMALS).toFixed(0)
    })

    const denormalizedSwapFee = denormalize(
      swapFee,
      POOL_SWAP_FEE_DECIMALS,
    ).toFixed(0)

    const denormalizedInitialSupply = denormalize(
      poolTokenInitialSupply,
      SPT_DECIMALS,
    ).toFixed(0)

    // Send tokens to CPK
    tokens.forEach((token, idx) => {
      if (token.cpkBalance?.lt(amounts[idx])) {
        cpk.transferTokenFrom(
          account,
          token.address,
          denormalize(
            big(amounts[idx]).minus(token.cpkBalance),
            token.decimals,
          ),
        )
      }
    })

    // Approve CPK to spend tokens on ActionManager
    tokens.forEach((token, idx) => {
      cpk.approveCpkTokenFor(
        token.address,
        'xToken',
        actionManagerAddress,
        denormalize(amounts[idx], token.decimals),
      )
    })

    const poolParameters = {
      poolTokenName,
      poolTokenSymbol,
      constituentTokens: poolTokenIds,
      tokenBalances: denormalizedAmounts,
      tokenWeights: denormalizedWeights,
      swapFee: denormalizedSwapFee,
    }

    cpk.patchTxs({
      to: actionManagerAddress,
      data: ActionManagerInterface.encodeFunctionData('smartPoolCreation', [
        poolParameters,
        poolRights,
        denormalizedInitialSupply,
        poolMinimumGradualUpdateDuration,
        poolAddTokenTimeLockDuration,
      ]),
    })

    return cpk.execStoredTxs()
  }
}

export default ActionManager
