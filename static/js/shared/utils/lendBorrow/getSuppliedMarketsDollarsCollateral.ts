import { ZERO } from '@swarm/core/shared/utils/helpers/big-helpers'
import { Market } from '@swarm/types/lend-borrow'
import Big from 'big.js'

import { getSuppliedMarketDollarsCollateral } from './getSuppliedMarketDollarsCollateral'

export function getSuppliedMarketsDollarsCollateral(
  suppliedMarkets: Market[],
): Big {
  return suppliedMarkets.reduce(
    (currentSuppliedMarketsDollarsCollateral, market) => {
      const suppliedMarketDollarsCollateral =
        getSuppliedMarketDollarsCollateral(market)
      return currentSuppliedMarketsDollarsCollateral.add(
        suppliedMarketDollarsCollateral,
      )
    },
    ZERO,
  )
}
