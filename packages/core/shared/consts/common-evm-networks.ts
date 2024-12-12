import { NetworkId, NetworkName } from '@swarm/types/config'

import { SupportedNetworkId } from '@core/shared/enums/supported-network-id'

export interface EVMNetwork {
  networkId: NetworkId
  chainId: string
  networkName: NetworkName
  rpcPrefix: string
  chainName: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  rpcUrls: string[]
  blockExplorerUrls: string[]
  blocksPerDay: number
}

export const evmNetworkConstantMap = [
  {
    networkId: 1,
    chainId: '0x1',
    networkName: 'Ethereum',
    rpcPrefix: 'mainnet',
    chainName: 'Ethereum Mainnet',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: [
      'https://1.rpc.thirdweb.com',
      'https://ethereumnodelight.app.runonflux.io',
      'https://cloudflare-eth.com',
      'https://rpc.ankr.com/eth',
    ],
    blockExplorerUrls: ['https://etherscan.io'],
    blocksPerDay: 6570, // 13.15 seconds per block
  },
  {
    networkId: 137,
    chainId: '0x89',
    networkName: 'Polygon',
    rpcPrefix: 'polygon-mainnet',
    chainName: 'Polygon Mainnet',
    nativeCurrency: {
      name: 'Polygon Ecosystem Token',
      symbol: 'POL',
      decimals: 18,
    },
    rpcUrls: [
      'https://polygon.rpc.thirdweb.com',
      'https://rpc-mainnet.matic.quiknode.pro',
      'https://poly-rpc.gateway.pokt.network',
      'https://polygon-rpc.com/',
    ],
    blockExplorerUrls: ['https://polygonscan.com'],
    blocksPerDay: 41143, // 2.1 seconds per block
  },
  {
    networkId: 8453,
    chainId: '0x2105',
    networkName: 'Base',
    rpcPrefix: 'base-mainnet',
    chainName: 'Base Mainnet',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://mainnet.base.org'],
    blockExplorerUrls: ['https://basescan.org'],
    blocksPerDay: 41143, // 2.1 seconds per block
  },
  {
    networkId: 421614,
    chainId: '0x66eee',
    networkName: 'Arbitrum Sepolia',
    rpcPrefix: 'arbitrum-sepolia',
    chainName: 'Arbitrum Sepolia',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: [
      'https://sepolia-rollup.arbitrum.io/rpc',
      'https://421614.rpc.thirdweb.com',
    ],
    blockExplorerUrls: ['https://sepolia.arbiscan.io'],
    blocksPerDay: 41143, // 2.1 seconds per block
  },
] as const

export const commonEVMNetworks: EVMNetwork[] = Object.assign(
  evmNetworkConstantMap,
)

export const NetworkMap = new Map<number, EVMNetwork>(
  commonEVMNetworks.map((network) => [network.networkId, network]),
)

export const MAIN_NETWORKS = [
  SupportedNetworkId.Ethereum,
  SupportedNetworkId.Polygon,
  SupportedNetworkId.Base,
]

export const TEST_NETWORKS = [SupportedNetworkId.ArbitrumSepolia]

export const POLYGON_NETWORK_IDS = [SupportedNetworkId.Polygon]

export const NETWORK_ID_BY_NAME: Record<NetworkName, SupportedNetworkId> =
  commonEVMNetworks.reduce(
    (record, network) => ({
      ...record,
      [network.networkName]: network.networkId,
    }),
    {} as Record<NetworkName, SupportedNetworkId>,
  )
