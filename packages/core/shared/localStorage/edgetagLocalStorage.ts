import { useWindowStorage } from '@core/hooks/useWindowStorage'
import {
  booleanDecoder,
  booleanEncoder,
  LocalStorageService,
} from '@core/services/window-storage/local-storage'

export const edgetagLocalStorage = new LocalStorageService<boolean>(
  'edgetagEnabled',
  booleanEncoder(),
  booleanDecoder(false),
)
export const useEdgetagLocalStorage = () =>
  useWindowStorage(edgetagLocalStorage)
