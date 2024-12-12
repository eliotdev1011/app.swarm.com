import isEqual from 'lodash/isEqual'
import { useLayoutEffect, useState } from 'react'

import { exchangeRates$, tokenPortal$ } from './observables'
import { ExchangeRateMap } from './types'

export const useExchangeRates = (
  tokensAddresses?: string[],
): ExchangeRateMap => {
  const [exchangeRates, setExchangeRates] = useState(exchangeRates$.value)

  useLayoutEffect(() => {
    const subscription = exchangeRates$.subscribe((newRates) => {
      setExchangeRates((currRates) => {
        if (isEqual(currRates, newRates)) return currRates
        return newRates
      })
    })

    tokensAddresses?.map((address) => tokenPortal$.next(address))

    return () => {
      subscription.unsubscribe()
    }
  }, [tokensAddresses])

  return exchangeRates
}
