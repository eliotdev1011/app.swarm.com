import {
  LocalStorageService,
  numberDecoder,
  numberEncoder,
} from '@core/services/window-storage/local-storage'

export const lastUsedNetworkIdLocalStorage = new LocalStorageService<
  number | null
>('LAST_USED_NETWORK_ID', numberEncoder(), numberDecoder(null))
