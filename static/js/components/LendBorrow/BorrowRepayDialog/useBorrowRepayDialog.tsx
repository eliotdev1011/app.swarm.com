import { isSameEthereumAddress } from '@swarm/core/web3'
import { Market } from '@swarm/types/lend-borrow'
import { useCallback, useMemo } from 'react'
import { StringParam, useQueryParam } from 'use-query-params'

interface ReturnValue {
  market: Market | undefined
  activeType: 'borrow' | 'repay'
  isOpen: boolean
  openBorrow: (marketAddress: string) => void
  openRepay: (marketAddress: string) => void
  close: () => void
}

const BORROW_MARKET_ADDRESS_QUERY_PARAM = 'lend_borrow'
const REPAY_MARKET_ADDRESS_QUERY_PARAM = 'lend_repay'

export function useBorrowRepayDialog(
  allMarkets: Market[] | undefined,
): ReturnValue {
  const [borrowMarketAddress, setBorrowMarketAddress] = useQueryParam(
    BORROW_MARKET_ADDRESS_QUERY_PARAM,
    StringParam,
  )
  const [repayMarketAddress, setRepayMarketAddress] = useQueryParam(
    REPAY_MARKET_ADDRESS_QUERY_PARAM,
    StringParam,
  )

  const isBorrowActive = typeof borrowMarketAddress === 'string'
  const isRepayActive = typeof repayMarketAddress === 'string'

  const activeType = isBorrowActive ? 'borrow' : 'repay'
  const isOpen = isBorrowActive || isRepayActive

  const openBorrow = useCallback<(marketAddress: string) => void>(
    (marketAddress) => {
      setRepayMarketAddress(undefined)
      setBorrowMarketAddress(marketAddress, 'replaceIn')
    },
    [setBorrowMarketAddress, setRepayMarketAddress],
  )

  const openRepay = useCallback<(marketAddress: string) => void>(
    (marketAddress) => {
      setBorrowMarketAddress(undefined)
      setRepayMarketAddress(marketAddress, 'replaceIn')
    },
    [setBorrowMarketAddress, setRepayMarketAddress],
  )

  const close = useCallback<() => void>(() => {
    setBorrowMarketAddress(undefined)
    setRepayMarketAddress(undefined, 'replaceIn')
  }, [setBorrowMarketAddress, setRepayMarketAddress])

  const borrowMarket =
    allMarkets === undefined ||
    borrowMarketAddress === undefined ||
    borrowMarketAddress === null
      ? undefined
      : allMarkets.find((market) => {
          return isSameEthereumAddress(market.address, borrowMarketAddress)
        })

  const repayMarket =
    allMarkets === undefined ||
    repayMarketAddress === undefined ||
    repayMarketAddress === null
      ? undefined
      : allMarkets.find((market) => {
          return isSameEthereumAddress(market.address, repayMarketAddress)
        })

  const market = borrowMarket !== undefined ? borrowMarket : repayMarket

  const value = useMemo<ReturnValue>(() => {
    return {
      market,
      activeType,
      isOpen,
      openBorrow,
      openRepay,
      close,
    }
  }, [market, activeType, isOpen, openBorrow, openRepay, close])

  return value
}
