import { IYotiTokenResponse } from '@swarm/types'

import {
  jsonDecoder,
  jsonEncoder,
  LocalStorageService,
} from '@core/services/window-storage/local-storage'

export const vouchersYotiLocalStorage = new LocalStorageService<IYotiTokenResponse | null>(
  'Swarm.Vouchers.Yoti.Token.Response',
  jsonEncoder(),
  jsonDecoder(null),
)
