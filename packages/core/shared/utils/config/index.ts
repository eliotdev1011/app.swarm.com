import { NetworkId, NetworkName } from '@swarm/types/config'

import {
  EVMNetwork,
  MAIN_NETWORKS,
  NETWORK_ID_BY_NAME,
  NetworkMap,
  POLYGON_NETWORK_IDS,
  TEST_NETWORKS,
} from '@core/shared/consts/common-evm-networks'
import { envNames } from '@core/shared/consts/env-names'
import { SupportedNetworkId } from '@core/shared/enums/supported-network-id'

export const getNetworkById = (
  id: NetworkId | number,
): EVMNetwork | undefined => NetworkMap.get(id)

const getInfuraRpcUrl = (networkId: NetworkId, infuraId: string) =>
  infuraId
    ? `https://${getNetworkById(
        networkId,
      )?.rpcPrefix.toLowerCase()}.infura.io/v3/${infuraId}`
    : ''

export const generateInfuraRpcUrls = (
  chainIds: NetworkId[],
  infuraId: string,
) =>
  chainIds.reduce<Record<NetworkId, string>>(
    (map, id) => ({
      ...map,
      [id]: getInfuraRpcUrl(id, infuraId),
    }),
    {} as Record<NetworkId, string>,
  )

export const validateEnv = (keys: string[]) => {
  envNames.forEach((key) => {
    if (!keys.includes(key)) {
      // eslint-disable-next-line no-console
      console.error(`Missing configuration variable: ${key}`)
    }
  })
}

export const isMainnet = (networkId: number) =>
  MAIN_NETWORKS.includes(networkId)

export const isTestnet = (networkId: NetworkId) =>
  TEST_NETWORKS.includes(networkId)

export const isPolygon = (networkId: number) =>
  POLYGON_NETWORK_IDS.includes(networkId)

export const isEthereum = (networkId: number) =>
  networkId === SupportedNetworkId.Ethereum

export const isBase = (networkId: number) =>
  networkId === SupportedNetworkId.Base

export const getNetworkIdByName = (
  name: NetworkName | string,
): NetworkId | undefined => {
  return NETWORK_ID_BY_NAME[name as NetworkName]
}
