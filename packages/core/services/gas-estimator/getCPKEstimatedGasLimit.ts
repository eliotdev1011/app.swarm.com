import Big from 'big.js'
import CPK, { Transaction as CPKTransaction } from 'contract-proxy-kit'

import { big } from '@core/shared/utils/helpers'

import {
  DEFAULT_ADDED_GAS_LIMIT_PERCENTAGE,
  SWAP_OWNER_GAS_AMOUNT,
} from './consts'
import { CPKTransactionGasEstimationOptions } from './types'

export const getCPKEstimatedGasLimit = async (
  cpkInstance: CPK,
  transactions: CPKTransaction[],
  options: CPKTransactionGasEstimationOptions = {},
) => {
  const {
    addedGasLimitPercentage = DEFAULT_ADDED_GAS_LIMIT_PERCENTAGE,
  } = options

  const { gasLimit } = await cpkInstance.getExecTransactionsGasLimit(
    transactions,
  )

  const isDeployed = await cpkInstance.isProxyDeployed()

  if (isDeployed) {
    return gasLimit
  }

  return big(gasLimit + SWAP_OWNER_GAS_AMOUNT)
    .mul(100 + addedGasLimitPercentage)
    .div(100)
    .round(0, Big.roundDown)
    .toNumber()
}
