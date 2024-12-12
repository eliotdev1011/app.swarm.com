import { BigNumber, PopulatedTransaction, Signer } from 'ethers'

import { DEFAULT_ADDED_GAS_LIMIT_PERCENTAGE } from './consts'
import { TransactionGasEstimationOptions } from './types'

export const getEstimatedGasLimit = async (
  transaction: PopulatedTransaction,
  signer?: Signer,
  options: TransactionGasEstimationOptions = {},
) => {
  if (signer === undefined) {
    return undefined
  }

  const {
    addedGasLimitPercentage = DEFAULT_ADDED_GAS_LIMIT_PERCENTAGE,
  } = options

  let estimatedGasLimit: BigNumber

  try {
    estimatedGasLimit = await signer.estimateGas(transaction)
  } catch {
    return undefined
  }

  const gasLimit = estimatedGasLimit.mul(100 + addedGasLimitPercentage).div(100)

  return gasLimit.toNumber()
}
