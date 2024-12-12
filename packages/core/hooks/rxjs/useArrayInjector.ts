import { Obj } from '@swarm/types'
import Observed from '@swarm/types/observables/observed'
import { useCallback, useMemo } from 'react'
import { asyncScheduler, combineLatest, Observable, of } from 'rxjs'
import { defaultIfEmpty, shareReplay, throttleTime } from 'rxjs/operators'

import useMemoCollection from '../memo/useMemoCollection'

import useObservable from './useObservable'

const parseValue = <R, T>(
  value: ((item: T) => Observable<R>) | Observable<R> | R,
  item: T,
): Observable<R> => {
  if (value instanceof Function) {
    return value(item)
  }

  if (value instanceof Observable) {
    return value
  }

  return of(value)
}

export type InjectionCreatorMap<T = unknown> = Record<
  string,
  (item: T) => Observable<unknown>
>

export type AdditionalProps<
  T = unknown,
  M extends InjectionCreatorMap<T> = InjectionCreatorMap<T>
> = {
  [k in keyof M]: Observed<ReturnType<M[k]>>
}

export type Injected<T, M extends InjectionCreatorMap<T>> = T &
  AdditionalProps<M>

const useArrayInjector = <
  T extends Obj = Obj,
  M extends InjectionCreatorMap<T> = InjectionCreatorMap<T>
>(
  map?: M,
  source: T[] = [],
  throttleInterval = 1000,
): (T & AdditionalProps<T, M>)[] => {
  const keys = map ? Object.keys(map) : []

  const destination = useObservable<AdditionalProps<T, M>[]>(
    useCallback(() => {
      if (map && source && keys.length) {
        return combineLatest(
          source.map((item) =>
            combineLatest(
              Object.keys(map).reduce(
                (prev, key) => ({
                  ...prev,
                  [key]: parseValue(map[key], item).pipe(defaultIfEmpty(null)),
                }),
                {},
              ),
            ),
          ),
        ).pipe(
          throttleTime(throttleInterval, asyncScheduler, { trailing: true }),
          shareReplay(1),
        )
      }

      return of([])
    }, [keys.length, map, source, throttleInterval]),
  )

  return useMemoCollection(
    useMemo(
      () =>
        source.map(
          (item, idx) =>
            ({
              ...item,
              ...destination?.[idx],
            } as T & AdditionalProps<T, M>),
        ),
      [destination, source],
    ),
  )
}

export default useArrayInjector
