import type { Market } from '@swarm/types/lend-borrow'
import Big from 'big.js'

import { getUnderlyingBalanceDollarsAmount } from './getUnderlyingBalanceDollarsAmount'

export function getBorrowedMarketDollarsDebt(borrowedMarket: Market): Big {
  return getUnderlyingBalanceDollarsAmount(
    borrowedMarket.borrowedUnderlyingBalance,
    borrowedMarket,
  )
}
