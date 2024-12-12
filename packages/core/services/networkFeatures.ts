import { SupportedNetworkId } from '@core/shared/enums'
import { getLastUsedNetworkId } from '@core/web3'

export enum NetworkFeatureName {
  goldNfts = 'gold-nfts',
  investAssets = 'invest-assets',
  xGoldToken = 'x-gold-token',
}

namespace NetworkFeature {
  const networkFeatures: Record<NetworkFeatureName, SupportedNetworkId[]> = {
    [NetworkFeatureName.goldNfts]: [
      SupportedNetworkId.Polygon,
      SupportedNetworkId.Ethereum,
      SupportedNetworkId.ArbitrumSepolia,
    ],
    [NetworkFeatureName.investAssets]: [
      SupportedNetworkId.Polygon,
      SupportedNetworkId.Ethereum,
    ],
    [NetworkFeatureName.xGoldToken]: [
      SupportedNetworkId.Ethereum,
      SupportedNetworkId.ArbitrumSepolia,
    ],
  }

  export const checkSupported = (feature: NetworkFeatureName) => {
    const networkId = getLastUsedNetworkId()
    const supported = networkFeatures[feature].includes(networkId)
    return supported
  }

  export const ifSupported = <T>(
    featureName: NetworkFeatureName,
    content: T,
    fallback: any = null,
  ) => {
    return checkSupported(featureName) ? content : fallback
  }
}

export default NetworkFeature
