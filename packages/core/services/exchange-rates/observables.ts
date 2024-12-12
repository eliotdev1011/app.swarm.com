import { BehaviorSubject, from, interval, merge, Subject } from 'rxjs'
import {
  debounceTime,
  distinct,
  filter,
  map,
  sample,
  scan,
  switchMap,
  withLatestFrom,
} from 'rxjs/operators'

import { getLastUsedNetworkId } from '@core/web3/utils'

import { ExchangeRateLifetime } from './config'
import {
  getExchangeRates,
  getStoredExchangeRates,
  storeExchangeRates,
} from './utils'

const networkId = getLastUsedNetworkId()

export const initialTokens = Object.keys(
  getStoredExchangeRates(networkId),
).filter(Boolean)

export const tokenPortal$ = new Subject<string>()

export const tokens$ = merge(from(initialTokens), tokenPortal$).pipe(
  distinct(),
  scan((acc, curr) => [...acc, curr], [] as string[]),
)

export const exchangeRates$ = new BehaviorSubject(
  getStoredExchangeRates(networkId),
)

export const refresher$ = tokens$.pipe(sample(interval(ExchangeRateLifetime)))

export const calls$ = merge(tokens$, refresher$).pipe(
  withLatestFrom(exchangeRates$),
  filter(([tokens, lastExchangeRates]) =>
    tokens.some(
      (token) =>
        !lastExchangeRates[token] ||
        lastExchangeRates[token].timestamp < Date.now() - 10000,
    ),
  ),
  map(([tokens]) => tokens),
  debounceTime(500),
  switchMap(getExchangeRates),
)

calls$.subscribe((exchangeRates) => {
  storeExchangeRates(exchangeRates)
  exchangeRates$.next(exchangeRates)
})
