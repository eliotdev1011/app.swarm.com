import type { Market } from '@swarm/types/lend-borrow'
import Big from 'big.js'

export function getMaxRepayableUnderlyingBalance(market: Market): Big {
  if (market.borrowedUnderlyingBalance.lt(market.underlyingBalance)) {
    return market.borrowedUnderlyingBalance
  }

  return market.underlyingBalance
}
