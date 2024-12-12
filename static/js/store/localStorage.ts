import { useWindowStorage } from '@swarm/core/hooks/useWindowStorage'
import {
  booleanDecoder,
  booleanEncoder,
  LocalStorageService,
} from '@swarm/core/services/window-storage/local-storage'

export const walletHideSmallBalancesLocalStorage =
  new LocalStorageService<boolean>(
    'wallet-hide-low-balances',
    booleanEncoder(),
    booleanDecoder(false),
  )
export const useWalletHideSmallBalancesLocalStorage = () =>
  useWindowStorage<boolean>(walletHideSmallBalancesLocalStorage)
