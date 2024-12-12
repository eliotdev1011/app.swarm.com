import { AbstractToken } from '@swarm/types/tokens'
import { Observable } from 'rxjs'
import { distinctUntilChanged, map, startWith } from 'rxjs/operators'

import useObservable from '@core/hooks/rxjs/useObservable'
import { exchangeRates$, tokenPortal$ } from '@core/services/exchange-rates'

const exchangeRateOf$ =
  (initialValue?: number) =>
  ({
    id,
  }: Pick<AbstractToken, 'id'>): Observable<number | null | undefined> => {
    const key = id.toLowerCase()
    if (!exchangeRates$.value[key]) {
      tokenPortal$.next(key)
    }

    return exchangeRates$.pipe(
      map((rates) => rates[key]?.exchangeRate),
      startWith(initialValue),
      distinctUntilChanged(),
    )
  }

export const useExchangeRateOf = (id: string, initialValue?: number) =>
  useObservable(exchangeRateOf$(initialValue)({ id }))

export default exchangeRateOf$
