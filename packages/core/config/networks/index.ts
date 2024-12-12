import { SupportedNetworkId } from '@core/shared/enums/supported-network-id'

import { arbitrumSepolia } from './arbitrum-sepolia'
import { base } from './base-mainnet'
import { ethereum } from './eth-mainnet'
import { polygon } from './poly-mainnet'

const networks = {
  [SupportedNetworkId.Ethereum]: ethereum,
  [SupportedNetworkId.Base]: base,
  [SupportedNetworkId.Polygon]: polygon,
  [SupportedNetworkId.ArbitrumSepolia]: arbitrumSepolia,
}

export default networks
