import { ZERO } from '@swarm/core/shared/utils/helpers/big-helpers'
import Big from 'big.js'

export function getAvailableDollarsCollateral(
  suppliedMarketsDollarsCollateral: Big,
  borrowedMarketsDollarsDebt: Big,
): Big {
  const result = suppliedMarketsDollarsCollateral.sub(
    borrowedMarketsDollarsDebt,
  )

  if (result.lt(0)) {
    return ZERO
  }

  return result
}
