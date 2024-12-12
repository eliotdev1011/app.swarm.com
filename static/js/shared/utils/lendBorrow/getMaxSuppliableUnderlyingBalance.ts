import type { Market } from '@swarm/types/lend-borrow'
import Big from 'big.js'

export function getMaxSuppliableUnderlyingBalance(market: Market): Big {
  return market.underlyingBalance
}
