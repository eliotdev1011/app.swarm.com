import { Market } from '@swarm/types/lend-borrow'

export function matchIsSuppliedMarket(market: Market): boolean {
  return market.balance.gt(0)
}
