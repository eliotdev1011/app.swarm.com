import { Sx1155AssetType } from '@swarm/types/x-subgraph/graphql'
import { useQuery } from '@tanstack/react-query'

import { XGoldBundleContract } from '@core/contracts/XGoldBundle'
import { getCurrentConfig } from '@core/observables/configForNetwork'
import useTokenMetadata from '@core/services/alchemy/useTokenMetadata'
import NetworkFeature, {
  NetworkFeatureName,
} from '@core/services/networkFeatures'

const { xGoldBundleAddress } = getCurrentConfig()

const useXGold = () => {
  const xGoldSupported = NetworkFeature.checkSupported(
    NetworkFeatureName.xGoldToken,
  )
  const { token, loading: tokenLoading } = useTokenMetadata(
    xGoldBundleAddress,
    { enabled: xGoldSupported },
  )
  const { data: kya, isLoading: kyaLoading } = useQuery({
    queryFn: async () => {
      if (!xGoldSupported) return
      const instance = await XGoldBundleContract.getInstance()

      return instance.contract?.tokenKya()
    },
    queryKey: ['xGoldKya', xGoldBundleAddress],
    enabled: xGoldSupported,
  })

  const loading = tokenLoading || kyaLoading

  return {
    token:
      token && xGoldSupported
        ? { ...token, kya, rwaType: Sx1155AssetType.Gold }
        : null,
    loading,
  }
}

export default useXGold
