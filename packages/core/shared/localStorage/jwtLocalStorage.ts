import { useWindowStorage } from '@core/hooks/useWindowStorage'
import {
  LocalStorageService,
  stringDecoder,
  stringEncoder,
} from '@core/services/window-storage/local-storage'

export const jwtLocalStorage = new LocalStorageService<string | null>(
  'Swarm.jwt',
  stringEncoder(),
  stringDecoder(null),
)
export const useJwtLocalStorage = () => useWindowStorage(jwtLocalStorage)
