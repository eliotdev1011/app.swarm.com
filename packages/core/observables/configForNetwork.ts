import { IContractAddresses, NetworkId } from '@swarm/types/config'
import { BehaviorSubject, distinctUntilChanged } from 'rxjs'

import config from '@core/config'
import { isInFallbackRpcMode$ } from '@core/web3/provider'
import { getLastUsedNetworkId, isNetworkSupported } from '@core/web3/utils'

const {
  rpcUrls,
  fallbackRpcUrls,
  xSubgraphUrls,
  subgraphUrls,
  uniswapSubgraphUrls,
  alchemyApiKeys,
  contracts,
} = config

const checkNetwork = (networkId: number) =>
  isNetworkSupported(networkId)
    ? (networkId as NetworkId)
    : getLastUsedNetworkId()

type GetConfigForNetworkReturn = IContractAddresses & {
  xSubgraphUrl: string
  subgraphUrl: string
  rpcUrl: string
  alchemyApiKey: string
  uniswapSubgraphUrl: string
}

export const getConfigForNetwork = (
  networkId: number,
): GetConfigForNetworkReturn => ({
  ...contracts[checkNetwork(networkId)],
  xSubgraphUrl: xSubgraphUrls[checkNetwork(networkId)],
  subgraphUrl: subgraphUrls[checkNetwork(networkId)],
  rpcUrl: !isInFallbackRpcMode$
    ? fallbackRpcUrls[checkNetwork(networkId)]
    : rpcUrls[checkNetwork(networkId)],
  alchemyApiKey: alchemyApiKeys[checkNetwork(networkId)],
  uniswapSubgraphUrl: uniswapSubgraphUrls[checkNetwork(networkId)],
})

const configForNetwork$ = new BehaviorSubject(
  getConfigForNetwork(getLastUsedNetworkId()),
)

// React to change on fallback RPC mode
isInFallbackRpcMode$.pipe(distinctUntilChanged()).subscribe(() => {
  configForNetwork$.next(getConfigForNetwork(getLastUsedNetworkId()))
})

export const getCurrentConfig = () => configForNetwork$.getValue()

export default configForNetwork$
