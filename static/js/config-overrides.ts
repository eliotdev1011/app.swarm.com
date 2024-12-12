import { getAppConfig, overrideConfig } from '@swarm/core/config'
import { SupportedNetworkId } from '@swarm/core/shared/enums'
import { isMainnet } from '@swarm/core/shared/utils'

const { defaultChainId } = getAppConfig()

const supportedChainIds = isMainnet(defaultChainId)
  ? [SupportedNetworkId.Polygon, SupportedNetworkId.Ethereum]
  : [SupportedNetworkId.ArbitrumSepolia]

overrideConfig({
  supportedChainIds,
})
