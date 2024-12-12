import { Market } from '@swarm/types/lend-borrow'

export function matchIsSuppliableMarket(market: Market): boolean {
  return market.isEntered && market.isEnabled
}
