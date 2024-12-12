import type { Market } from '@swarm/types/lend-borrow'
import Big from 'big.js'

export function getDollarsAmountUnderlyingBalance(
  dollarsAmount: Big,
  market: Market,
): Big {
  return dollarsAmount.div(market.underlyingDollarsPrice)
}
