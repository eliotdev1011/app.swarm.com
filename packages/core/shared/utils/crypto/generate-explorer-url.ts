import { ExplorerUrlOptions } from '@swarm/types'

import { NetworkMap } from '@core/shared/consts/common-evm-networks'
import { getLastUsedNetworkId, isNetworkSupported } from '@core/web3'

export const generateExplorerUrl = ({
  type,
  hash,
  chainId,
}: ExplorerUrlOptions) => {
  if (!hash) return ''

  const networkId =
    chainId && isNetworkSupported(chainId) ? chainId : getLastUsedNetworkId()

  const explorerLinkPrefix = NetworkMap.get(networkId)?.blockExplorerUrls[0]

  return `${explorerLinkPrefix}/${type}/${hash}`
}
