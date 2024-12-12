import { SupportedNetworkId } from '@core/shared/enums/supported-network-id'
import { unifyAddressToId } from '@core/web3/utils'

export const excludedDotcTokens: Record<SupportedNetworkId, string[]> = {
  [SupportedNetworkId.Polygon]: [].map(unifyAddressToId),
  [SupportedNetworkId.Ethereum]: [
    '0x78320DcFC452285BAe0289c7c6C919f0C4948B42',
  ].map(unifyAddressToId),
  [SupportedNetworkId.Base]: [],
  [SupportedNetworkId.ArbitrumSepolia]: [],
}
