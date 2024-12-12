import { defer, iif, of } from 'rxjs'
import {
  distinctUntilChanged,
  mergeMap,
  shareReplay,
  startWith,
  switchMap,
  takeWhile,
} from 'rxjs/operators'

import { cpk$, getCpk } from '@core/contracts/cpk'
import useObservable from '@core/hooks/rxjs/useObservable'
import { onEveryBlock$ } from '@core/web3/on-every-block'

const proxyDeployed$ = defer(() =>
  cpk$.pipe(
    switchMap((cpk) => cpk?.isProxyDeployed() ?? of(false)),
    distinctUntilChanged(),
    mergeMap((val) =>
      iif(
        () => !val,
        onEveryBlock$.pipe(
          switchMap(() => {
            try {
              const cpk = getCpk()
              return cpk.isProxyDeployed()
            } catch {
              return of(false)
            }
          }),
          distinctUntilChanged(),
          takeWhile((v) => !v),
        ),
        of(val),
      ),
    ),
    startWith(false),
    shareReplay(1),
  ),
)

export const useIsProxyDeployed = () => useObservable(proxyDeployed$, false)

export default proxyDeployed$
