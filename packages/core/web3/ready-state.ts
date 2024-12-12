import { BehaviorSubject } from 'rxjs'

import useObservable from '@core/hooks/rxjs/useObservable'

export const readyState$ = new BehaviorSubject<boolean | null>(false)

export const useReadyState = () => useObservable(readyState$) ?? false

export const setReady = () => readyState$.next(true)

export const getReadyState = () => readyState$.getValue()
