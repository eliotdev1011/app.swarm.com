import {
  IContractAddresses,
  IEdgeTagPreferences,
  IEnvironment,
  ITenderlyPreferences,
  IYotiConfig,
  NetworkId,
  ProjectName,
} from '@swarm/types/config'

import {
  MAIN_NETWORKS,
  TEST_NETWORKS,
} from '@core/shared/consts/common-evm-networks'
import {
  generateInfuraRpcUrls,
  isMainnet,
  isPolygon,
  validateEnv,
} from '@core/shared/utils/config'

import networks from './networks'
import resources from './resources'

const windowEnv = window?.ENV || {}
const procEnv = process.env || {}

const uniqKeys = Array.from(
  new Set([...Object.keys(windowEnv), ...Object.keys(procEnv)]),
)

validateEnv(uniqKeys)

const ENV: Record<string, string> = uniqKeys.reduce(
  (map, key) => ({ ...map, [key]: windowEnv?.[key] || procEnv?.[key] }),
  {},
)

const projectName = ENV?.REACT_APP_PROJECT_NAME as ProjectName

const defaultChainId = Number(ENV?.REACT_APP_DEFAULT_CHAIN_ID) as NetworkId

const supportedChainIds = isMainnet(defaultChainId)
  ? MAIN_NETWORKS
  : TEST_NETWORKS

const tenderlyPreferences: ITenderlyPreferences = Object.freeze({
  user: ENV?.REACT_APP_TENDERLY_USER,
  project: ENV?.REACT_APP_TENDERLY_PROJECT,
  accessKey: ENV?.REACT_APP_TENDERLY_ACCESS_KEY,
})

const edgeTagPreferences: IEdgeTagPreferences = Object.freeze({
  edgeUrl: ENV?.REACT_APP_EDGETAG_EDGE_URL,
  debug: ENV?.REACT_APP_EDGETAG_DEBUG === 'true',
})

const yoti: IYotiConfig = Object.freeze({
  scriptStatusUrl: ENV?.REACT_APP_YOTI_STATUS_URL || '',
  scenarioId: ENV?.REACT_APP_YOTI_SCENARIO_ID || '',
  clientSdkId: ENV?.REACT_APP_YOTI_CLIENT_SDK_ID || '',
  vouchersScenarioId: ENV?.REACT_APP_VOUCHERS_YOTI_SCENARIO_ID || '',
})

const fallbackRpcUrls = Object.freeze<Record<NetworkId, string>>(
  generateInfuraRpcUrls(supportedChainIds, ENV?.REACT_APP_INFURA_PROJECT_ID),
)

const subgraphUrls = Object.freeze<Record<NetworkId, string>>(
  supportedChainIds.reduce(
    (map, id) => ({
      ...map,
      [id]: `${networks[id].subgraphUrl}${
        ENV?.REACT_APP_USE_BETA_SUBGRAPH === 'true' ? '-beta' : ''
      }`,
    }),
    {} as Record<NetworkId, string>,
  ),
)

const uniswapSubgraphUrls = Object.freeze<Record<NetworkId, string>>(
  supportedChainIds.reduce(
    (map, id) => ({
      ...map,
      [id]: networks[id].uniswapSubgraphUrl,
    }),
    {} as Record<NetworkId, string>,
  ),
)

const xSubgraphUrls = Object.freeze<Record<NetworkId, string>>(
  supportedChainIds.reduce(
    (map, id) => ({
      ...map,
      [id]: networks[id].xSubgraphUrl,
    }),
    {} as Record<NetworkId, string>,
  ),
)

const rpcUrls = Object.freeze<Record<NetworkId, string>>(
  supportedChainIds.reduce(
    (map, id) => ({ ...map, [id]: networks[id].rpcUrl }),
    {} as Record<NetworkId, string>,
  ),
)

const alchemyApiKeys = Object.freeze<Record<NetworkId, string>>(
  supportedChainIds.reduce(
    (map, id) => ({ ...map, [id]: networks[id].alchemyApiKey }),
    {} as Record<NetworkId, string>,
  ),
)

const contracts = Object.freeze<Record<NetworkId, IContractAddresses>>(
  supportedChainIds.reduce(
    (map, id) => ({ ...map, [id]: networks[id].contracts }),
    {} as Record<NetworkId, IContractAddresses>,
  ),
)

const commonConfig: IEnvironment = Object.freeze({
  projectName,
  contracts,
  alchemyApiKeys,
  subgraphUrls,
  uniswapSubgraphUrls,
  xSubgraphUrls,
  sourceKey: 'swarm-app',
  tenderlyPreferences,
  edgeTagPreferences,
  yoti,
  defaultChainId,
  supportedChainIds,
  rpcUrls,
  fallbackRpcUrls,
  apiUrl: ENV?.REACT_APP_API_URL || '',
  rewardsUrl:
    'https://raw.githubusercontent.com/SwarmMarkets/smt-rewards-distribution/main/reports',
  poolsToExclude:
    ENV?.REACT_APP_POOLS_TO_EXCLUDE?.toLowerCase()?.split(',') || [],
  isProduction: () =>
    !['localhost', 'vercel', 'dev'].some((hostPart) =>
      window.location.hostname.includes(hostPart),
    ),
  isLocalhost: () => {
    return Boolean(
      window.location.hostname === 'localhost' ||
        // [::1] is the IPv6 localhost address.
        window.location.hostname === '[::1]' ||
        // 127.0.0.0/8 are considered localhost for IPv4.
        window.location.hostname.match(
          /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/,
        ),
    )
  },
  isUsingDevAPI: () => {
    return ENV?.REACT_APP_API_URL?.includes('.dev')
  },
  matchNetworkSupportsSmartPools: (networkId: NetworkId) => {
    return isPolygon(networkId)
  },
  flaggedFeatures: ENV?.REACT_APP_FLAGGED_FEATURES?.split(',') || [],
  resources,
  moonPayApiKey: ENV?.REACT_APP_MOONPAY_WIDGET_API_KEY || '',
  moonPayBaseURL: ENV?.REACT_APP_MOONPAY_WIDGET_BASE_URL || '',
  sentryDsn: ENV?.REACT_APP_SENTRY_DSN || '',
  walletConnectProjectId: ENV?.REACT_APP_WALLET_CONNECT_PROJECT_ID || '',
})

export { commonConfig }
