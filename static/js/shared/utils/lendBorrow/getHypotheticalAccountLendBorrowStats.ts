import { big } from '@swarm/core/shared/utils/helpers/big-helpers'
import { isSameEthereumAddress } from '@swarm/core/web3'
import { Market } from '@swarm/types/lend-borrow'

import { getAccountLendBorrowStats } from './getAccountLendBorrowStats'
import { getUnderlyingBalanceBalance } from './getUnderlyingBalanceBalance'

interface MarketChange {
  type: 'supply' | 'redeem' | 'borrow' | 'repay'
  address: string
  underlyingAmount: string
}

type AccountLendBorrowStats = ReturnType<typeof getAccountLendBorrowStats>

export function getHypotheticalAccountLendBorrowStats(
  allMarkets: Market[],
  marketsChanges: MarketChange[],
): {
  previous: AccountLendBorrowStats
  hypothetical: AccountLendBorrowStats
} {
  // Deep copy of allMarkets to create new object references
  const hypotheticalMarkets = allMarkets.map((market) => {
    return { ...market }
  })

  marketsChanges.forEach((marketChange) => {
    const market = hypotheticalMarkets.find((someMarket) => {
      return isSameEthereumAddress(someMarket.address, marketChange.address)
    })

    if (market === undefined) {
      throw new Error('Trying to change a market that does not exist')
    }

    if (marketChange.type === 'supply') {
      const underlyingAmountBalance = getUnderlyingBalanceBalance(
        big(marketChange.underlyingAmount),
        market.exchangeRate,
      )
      market.balance = market.balance.add(underlyingAmountBalance)
    }

    if (marketChange.type === 'redeem') {
      const underlyingAmountBalance = getUnderlyingBalanceBalance(
        big(marketChange.underlyingAmount),
        market.exchangeRate,
      )
      market.balance = market.balance.sub(underlyingAmountBalance)
    }

    if (marketChange.type === 'borrow') {
      market.borrowedUnderlyingBalance = market.borrowedUnderlyingBalance.add(
        marketChange.underlyingAmount,
      )
    }

    if (marketChange.type === 'repay') {
      market.borrowedUnderlyingBalance = market.borrowedUnderlyingBalance.sub(
        marketChange.underlyingAmount,
      )
    }
  })

  return {
    previous: getAccountLendBorrowStats(allMarkets),
    hypothetical: getAccountLendBorrowStats(hypotheticalMarkets),
  }
}
