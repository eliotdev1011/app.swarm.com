import { fromEvent, MonoTypeOperatorFunction, Observable } from 'rxjs'
import { share, switchMap } from 'rxjs/operators'

import { readOnlyProvider$ } from '@core/web3'

const fromProviderEvent = <T = unknown>(event: string): Observable<T> => {
  return readOnlyProvider$.pipe(
    switchMap((readOnlyProvider) => fromEvent(readOnlyProvider, event)),
    share() as MonoTypeOperatorFunction<unknown>,
  ) as Observable<T>
}

export default fromProviderEvent
