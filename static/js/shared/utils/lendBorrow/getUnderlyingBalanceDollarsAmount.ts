import type { Market } from '@swarm/types/lend-borrow'
import Big from 'big.js'

export function getUnderlyingBalanceDollarsAmount(
  underlyingBalance: Big,
  market: Market,
): Big {
  return underlyingBalance.mul(market.underlyingDollarsPrice)
}
