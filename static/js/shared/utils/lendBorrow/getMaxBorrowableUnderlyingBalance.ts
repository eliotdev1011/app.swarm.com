import type { Market } from '@swarm/types/lend-borrow'
import Big from 'big.js'

import { getDollarsAmountUnderlyingBalance } from './getDollarsAmountUnderlyingBalance'

export function getMaxBorrowableUnderlyingBalance(
  market: Market,
  availableDollarsCollateral: Big,
): Big {
  const availableDollarsCollacteralUnderlyingBalance =
    getDollarsAmountUnderlyingBalance(availableDollarsCollateral, market)

  if (
    availableDollarsCollacteralUnderlyingBalance.lt(
      market.protocolUnderlyingBalance,
    )
  ) {
    return availableDollarsCollacteralUnderlyingBalance
  }

  return market.protocolUnderlyingBalance
}
