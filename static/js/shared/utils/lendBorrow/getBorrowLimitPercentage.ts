import { ZERO } from '@swarm/core/shared/utils/helpers/big-helpers'
import Big from 'big.js'

export function getBorrowLimitPercentage(
  borrowLimitDollarsCollateral: Big,
  borrowedMarketsDollarsDebt: Big,
): Big {
  if (borrowLimitDollarsCollateral.eq(0)) {
    return ZERO
  }

  return borrowedMarketsDollarsDebt.mul(100).div(borrowLimitDollarsCollateral)
}
