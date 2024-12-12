import { useQuery } from '@tanstack/react-query'

import { XGoldBundleStorageContract } from '@core/contracts/XGoldBundleStorage'
import { getCurrentConfig } from '@core/observables/configForNetwork'
import NetworkFeature, {
  NetworkFeatureName,
} from '@core/services/networkFeatures'

const { xGoldBundleAddress } = getCurrentConfig()

const useXGoldInfo = () => {
  const {
    data: xGoldInfo,
    isLoading,
    error,
  } = useQuery({
    queryFn: () => {
      return XGoldBundleStorageContract.getGoldBundleInfo()
    },
    queryKey: ['xGoldInfo', xGoldBundleAddress],
    enabled: NetworkFeature.checkSupported(NetworkFeatureName.xGoldToken),
  })

  return { ...xGoldInfo, loading: isLoading, error }
}

export default useXGoldInfo
