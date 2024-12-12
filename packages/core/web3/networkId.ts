import { useMemo } from 'react'
import { BehaviorSubject } from 'rxjs'
import { filter } from 'rxjs/operators'

import useObservable from '@core/hooks/rxjs/useObservable'
import { EVMNetwork, NetworkMap } from '@core/shared/consts'

import {
  getLastUsedNetworkId,
  isNetworkSupported,
  storeNetworkId,
} from './utils'

export const walletNetworkId$ = new BehaviorSubject<number>(
  getLastUsedNetworkId(),
)

walletNetworkId$.pipe(filter(isNetworkSupported)).subscribe((networkId) => {
  if (networkId !== getLastUsedNetworkId()) {
    storeNetworkId(networkId)
    window.location.reload()
  }
})

export const useStoredNetworkId = () => getLastUsedNetworkId()

export const useWalletNetworkId = (): number =>
  useObservable(walletNetworkId$, walletNetworkId$.getValue())

export const useNetwork = () => {
  const networkId = useStoredNetworkId()

  return useMemo(() => NetworkMap.get(networkId) as EVMNetwork, [networkId])
}
