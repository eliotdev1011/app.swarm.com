import { ZERO } from '@swarm/core/shared/utils/helpers/big-helpers'
import { Market } from '@swarm/types/lend-borrow'
import Big from 'big.js'

import { getBorrowedMarketDollarsDebt } from './getBorrowedMarketDollarsDebt'
import { getBorrowedMarketsDollarsDebt } from './getBorrowedMarketsDollarsDebt'
import { getSuppliedMarketDollarsCollateral } from './getSuppliedMarketDollarsCollateral'
import { getSuppliedMarketsDollarsCollateral } from './getSuppliedMarketsDollarsCollateral'

export function getNetAPY(
  suppliedMarkets: Market[],
  borrowedMarkets: Market[],
): Big {
  const suppliedMarketsDollarsCollateral =
    getSuppliedMarketsDollarsCollateral(suppliedMarkets)

  const borrowedMarketsDollarsDebt =
    getBorrowedMarketsDollarsDebt(borrowedMarkets)

  const aggregatedSuppliesAPYs = suppliedMarkets.reduce(
    (currentAggregatedSuppliesAPYs, market) => {
      const suppliedMarketDollarsCollateral =
        getSuppliedMarketDollarsCollateral(market)

      const weigthedSupplyAPY = suppliedMarketDollarsCollateral.mul(
        market.supplyAPY.div(100),
      )

      return currentAggregatedSuppliesAPYs.add(weigthedSupplyAPY)
    },
    ZERO,
  )

  const aggregatedBorrowsAPYs = borrowedMarkets.reduce(
    (currentAggregatedBorrowsAPYs, market) => {
      const borrowedMarketDollarsDebt = getBorrowedMarketDollarsDebt(market)

      const weightedBorrowAPY = borrowedMarketDollarsDebt.mul(
        market.borrowAPY.div(100),
      )

      return currentAggregatedBorrowsAPYs.add(weightedBorrowAPY)
    },
    ZERO,
  )

  const aggregatedAPYs = aggregatedSuppliesAPYs.sub(aggregatedBorrowsAPYs)

  if (aggregatedAPYs.eq(0)) {
    return ZERO
  }

  if (aggregatedAPYs.gt(0)) {
    return aggregatedAPYs.div(suppliedMarketsDollarsCollateral).mul(100)
  }

  return aggregatedAPYs.div(borrowedMarketsDollarsDebt).mul(100)
}
