import useObservable from '@core/hooks/rxjs/useObservable'
import { onEveryBlock$ } from '@core/web3/on-every-block'

export function useCurrentBlockNumber(): number | undefined {
  return useObservable(onEveryBlock$)
}
