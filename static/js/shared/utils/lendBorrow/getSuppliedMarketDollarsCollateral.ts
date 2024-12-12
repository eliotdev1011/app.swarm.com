import { Market } from '@swarm/types/lend-borrow'
import Big from 'big.js'

import { getSuppliedMarketDollars } from './getSuppliedMarketDollars'

export function getSuppliedMarketDollarsCollateral(
  suppliedMarket: Market,
): Big {
  const suppliedMarketDollars = getSuppliedMarketDollars(suppliedMarket)

  return suppliedMarketDollars.mul(suppliedMarket.collateralFactor)
}
