import { AccountLendBorrowStats, Market } from '@swarm/types/lend-borrow'

import { getAvailableDollarsCollateral } from './getAvailableDollarsCollateral'
import { getBorrowLimitDollarsCollateral } from './getBorrowLimitDollarsCollateral'
import { getBorrowLimitPercentage } from './getBorrowLimitPercentage'
import { getBorrowedMarketsDollarsDebt } from './getBorrowedMarketsDollarsDebt'
import { getNetAPY } from './getNetAPY'
import { getSuppliedMarketsDollarsCollateral } from './getSuppliedMarketsDollarsCollateral'
import { getSuppliedMarketsDollarsTotal } from './getSuppliedMarketsDollarsTotal'
import { matchIsBorrowedMarket } from './matchIsBorrowedMarket'
import { matchIsSuppliedMarket } from './matchIsSuppliedMarket'

export function getAccountLendBorrowStats(
  allMarkets: Market[],
): AccountLendBorrowStats {
  const suppliedMarkets = allMarkets.filter(matchIsSuppliedMarket)
  const borrowedMarkets = allMarkets.filter(matchIsBorrowedMarket)

  const suppliedMarketsDollarsTotal =
    getSuppliedMarketsDollarsTotal(suppliedMarkets)

  const suppliedMarketsDollarsCollateral =
    getSuppliedMarketsDollarsCollateral(suppliedMarkets)

  const borrowedMarketsDollarsDebt =
    getBorrowedMarketsDollarsDebt(borrowedMarkets)

  const availableDollarsCollateral = getAvailableDollarsCollateral(
    suppliedMarketsDollarsCollateral,
    borrowedMarketsDollarsDebt,
  )

  const borrowLimitDollarsCollateral = getBorrowLimitDollarsCollateral(
    suppliedMarketsDollarsCollateral,
  )

  const borrowLimitPercentage = getBorrowLimitPercentage(
    borrowLimitDollarsCollateral,
    borrowedMarketsDollarsDebt,
  )

  const netAPY = getNetAPY(suppliedMarkets, borrowedMarkets)

  return {
    suppliedMarketsDollarsTotal,
    suppliedMarketsDollarsCollateral,
    borrowedMarketsDollarsDebt,
    availableDollarsCollateral,
    borrowLimitDollarsCollateral,
    borrowLimitPercentage,
    netAPY,
  }
}
