import { NetworkId } from '@swarm/types/config'
import pick from 'lodash/pick'

import api from '@core/services/api'
import { LocalStorageService } from '@core/services/window-storage/local-storage'
import { SupportedNetworkId } from '@core/shared/enums/supported-network-id'
import {
  polygonExchangeRatesLocalStorage,
  primaryExchangeRatesLocalStorage,
} from '@core/shared/localStorage'
import { isPolygon } from '@core/shared/utils/config'
import { getLastUsedNetworkId, unifyAddressToId } from '@core/web3'

import {
  exchangeRatesMap,
  HARDCODED_EXCHANGE_RATES,
  testnetToMainnetTokensMap,
} from './consts'
import { exchangeRates$ } from './observables'
import { ExchangeRateMap } from './types'

export enum ExchangeRateKey {
  primary = 'exchange-rates',
  polygon = 'exchange-rates-polygon',
}

const getHardcodedPrice = (
  tokenAddress: string,
  networkId: NetworkId,
): number | undefined =>
  HARDCODED_EXCHANGE_RATES[networkId][tokenAddress.toLowerCase()]

export const getStoredExchangeRates = (
  networkId: NetworkId,
): ExchangeRateMap => {
  let exchangeRatesLocalStorage: LocalStorageService<ExchangeRateMap | null>

  if (isPolygon(networkId)) {
    exchangeRatesLocalStorage = polygonExchangeRatesLocalStorage
  } else {
    exchangeRatesLocalStorage = primaryExchangeRatesLocalStorage
  }

  const exchangeRateMap = exchangeRatesLocalStorage.get()

  if (exchangeRateMap === null) {
    return {}
  }

  return exchangeRateMap
}

export const storeExchangeRates = (exchangeRates: ExchangeRateMap) => {
  const currentNetworkId = getLastUsedNetworkId()

  let exchangeRatesLocalStorage: LocalStorageService<ExchangeRateMap | null>

  if (isPolygon(currentNetworkId)) {
    exchangeRatesLocalStorage = polygonExchangeRatesLocalStorage
  } else {
    exchangeRatesLocalStorage = primaryExchangeRatesLocalStorage
  }

  exchangeRatesLocalStorage.set(exchangeRates)
}

const getTokenMainnetAddress = (address: string, networkId: NetworkId) =>
  testnetToMainnetTokensMap?.[networkId]?.[address?.toLowerCase()] ||
  exchangeRatesMap[networkId][unifyAddressToId(address)] ||
  address.toLowerCase()

export const getExchangeRates = async (tokens: string[]) => {
  try {
    const currentNetworkId = getLastUsedNetworkId()

    const pricesResponse = await api.getPricesV2(
      tokens.map((address) =>
        getTokenMainnetAddress(address, currentNetworkId),
      ),
      ['usd'],
      isPolygon(currentNetworkId)
        ? SupportedNetworkId.Polygon
        : SupportedNetworkId.Ethereum,
    )
    const { prices } = pricesResponse?.attributes || {}
    const timestamp = Date.now()

    return tokens.reduce((m: ExchangeRateMap, tokenAddress: string) => {
      const exchangeRate =
        prices?.[getTokenMainnetAddress(tokenAddress, currentNetworkId)]?.usd ??
        getHardcodedPrice(tokenAddress, currentNetworkId as NetworkId)

      return {
        ...m,
        [tokenAddress]: {
          exchangeRate,
          timestamp,
        },
      }
    }, {}) as ExchangeRateMap
  } catch {
    return {}
  }
}

export const getCachedExchangeRates = (tokenIds: string[]): ExchangeRateMap =>
  pick(
    exchangeRates$.getValue(),
    tokenIds.map((tokenId) => tokenId.toLowerCase()),
  ) as ExchangeRateMap
