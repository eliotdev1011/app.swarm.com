import { ZERO } from '@swarm/core/shared/utils/helpers/big-helpers'
import { Market } from '@swarm/types/lend-borrow'
import Big from 'big.js'

import { getSuppliedMarketDollars } from './getSuppliedMarketDollars'

export function getSuppliedMarketsDollarsTotal(suppliedMarkets: Market[]): Big {
  return suppliedMarkets.reduce((currentSuppliedMarketDollars, market) => {
    const suppliedMarketDollarsCollateral = getSuppliedMarketDollars(market)
    return currentSuppliedMarketDollars.add(suppliedMarketDollarsCollateral)
  }, ZERO)
}
