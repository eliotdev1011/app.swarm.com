import { ZERO } from '@swarm/core/shared/utils/helpers/big-helpers'
import { Market } from '@swarm/types/lend-borrow'
import Big from 'big.js'

import { getBorrowedMarketDollarsDebt } from './getBorrowedMarketDollarsDebt'

export function getBorrowedMarketsDollarsDebt(borrowedMarkets: Market[]): Big {
  return borrowedMarkets.reduce((currentBorrowedMarketDollarsDebt, market) => {
    const borrowedMarketDollarsDebt = getBorrowedMarketDollarsDebt(market)
    return currentBorrowedMarketDollarsDebt.add(borrowedMarketDollarsDebt)
  }, ZERO)
}
