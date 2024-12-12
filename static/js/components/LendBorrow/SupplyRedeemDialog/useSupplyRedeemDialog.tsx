import { isSameEthereumAddress } from '@swarm/core/web3'
import { Market } from '@swarm/types/lend-borrow'
import { useCallback, useMemo } from 'react'
import { StringParam, useQueryParam } from 'use-query-params'

interface ReturnValue {
  market: Market | undefined
  activeType: 'supply' | 'redeem'
  isOpen: boolean
  openSupply: (marketAddress: string) => void
  openRedeem: (marketAddress: string) => void
  close: () => void
}

const SUPPLY_MARKET_ADDRESS_QUERY_PARAM = 'lend_supply'
const REDEEM_MARKET_ADDRESS_QUERY_PARAM = 'lend_redeem'

export function useSupplyRedeemDialog(
  allMarkets: Market[] | undefined,
): ReturnValue {
  const [supplyMarketAddress, setSupplyMarketAddress] = useQueryParam(
    SUPPLY_MARKET_ADDRESS_QUERY_PARAM,
    StringParam,
  )
  const [redeemMarketAddress, setRedeemMarketAddress] = useQueryParam(
    REDEEM_MARKET_ADDRESS_QUERY_PARAM,
    StringParam,
  )

  const isSupplyActive = typeof supplyMarketAddress === 'string'
  const isRedeemActive = typeof redeemMarketAddress === 'string'

  const activeType = isSupplyActive ? 'supply' : 'redeem'
  const isOpen = isSupplyActive || isRedeemActive

  const openSupply = useCallback<(marketAddress: string) => void>(
    (marketAddress) => {
      setRedeemMarketAddress(undefined)
      setSupplyMarketAddress(marketAddress, 'replaceIn')
    },
    [setSupplyMarketAddress, setRedeemMarketAddress],
  )

  const openRedeem = useCallback<(marketAddress: string) => void>(
    (marketAddress) => {
      setSupplyMarketAddress(undefined)
      setRedeemMarketAddress(marketAddress, 'replaceIn')
    },
    [setSupplyMarketAddress, setRedeemMarketAddress],
  )

  const close = useCallback<() => void>(() => {
    setSupplyMarketAddress(undefined)
    setRedeemMarketAddress(undefined, 'replaceIn')
  }, [setSupplyMarketAddress, setRedeemMarketAddress])

  const supplyMarket =
    allMarkets === undefined ||
    supplyMarketAddress === undefined ||
    supplyMarketAddress === null
      ? undefined
      : allMarkets.find((market) => {
          return isSameEthereumAddress(market.address, supplyMarketAddress)
        })

  const redeemMarket =
    allMarkets === undefined ||
    redeemMarketAddress === undefined ||
    redeemMarketAddress === null
      ? undefined
      : allMarkets.find((market) => {
          return isSameEthereumAddress(market.address, redeemMarketAddress)
        })

  const market = supplyMarket !== undefined ? supplyMarket : redeemMarket

  const value = useMemo<ReturnValue>(() => {
    return {
      market,
      activeType,
      isOpen,
      openSupply,
      openRedeem,
      close,
    }
  }, [market, activeType, isOpen, openSupply, openRedeem, close])

  return value
}
