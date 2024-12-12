import { Market } from '@swarm/types/lend-borrow'
import { useMemo } from 'react'

import {
  matchIsBorrowedMarket,
  matchIsSuppliedMarket,
} from 'src/shared/utils/lendBorrow'

import { useComptrollerContract } from './useComptrollerContract'
import { useComptrollerMarkets } from './useComptrollerMarkets'

interface ReturnValue {
  allMarkets: Market[] | undefined
  suppliedMarkets: Market[] | undefined
  borrowedMarkets: Market[] | undefined
  marketsToSupply: Market[] | undefined
  marketsToBorrow: Market[] | undefined
}

export function useComptroller(address: string): ReturnValue {
  const contract = useComptrollerContract(address)
  const allMarkets = useComptrollerMarkets(contract)

  const value = useMemo<ReturnValue>(() => {
    const suppliedMarkets =
      allMarkets === undefined
        ? undefined
        : allMarkets.filter(matchIsSuppliedMarket)

    const borrowedMarkets =
      allMarkets === undefined
        ? undefined
        : allMarkets.filter(matchIsBorrowedMarket)

    const marketsToSupply = allMarkets

    const marketsToBorrow = allMarkets

    return {
      allMarkets,
      suppliedMarkets,
      borrowedMarkets,
      marketsToSupply,
      marketsToBorrow,
    }
  }, [allMarkets])

  return value
}
