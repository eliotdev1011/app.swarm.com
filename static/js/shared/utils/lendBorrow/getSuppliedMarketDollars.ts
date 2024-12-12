import type { Market } from '@swarm/types/lend-borrow'
import Big from 'big.js'

import { getBalanceUnderlyingBalance } from './getBalanceUnderlyingBalance'
import { getUnderlyingBalanceDollarsAmount } from './getUnderlyingBalanceDollarsAmount'

export function getSuppliedMarketDollars(suppliedMarket: Market): Big {
  const underlyingSuppliedBalance = getBalanceUnderlyingBalance(
    suppliedMarket.balance,
    suppliedMarket.exchangeRate,
  )

  return getUnderlyingBalanceDollarsAmount(
    underlyingSuppliedBalance,
    suppliedMarket,
  )
}
