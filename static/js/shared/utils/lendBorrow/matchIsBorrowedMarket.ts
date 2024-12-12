import { Market } from '@swarm/types/lend-borrow'

export function matchIsBorrowedMarket(market: Market): boolean {
  return market.borrowedUnderlyingBalance.gt(0)
}
