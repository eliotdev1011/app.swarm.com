import { NetworkId } from '@swarm/types/config'
import { providers } from 'ethers'
import { BehaviorSubject, distinctUntilChanged } from 'rxjs'

import config from '@core/config'
import either from '@core/shared/utils/helpers/either'

import { getLastUsedNetworkId } from './utils'

const { rpcUrls, fallbackRpcUrls } = config

// const BLOCKS_TO_WAIT_BEFORE_SWITCHING_TO_FALLBACK_RPC = 3
// const INTERVAL_MILLISECONDS_TO_CHECK_FOR_FALLBACK_RPC_MODE = 3000

export const isInFallbackRpcMode$ = new BehaviorSubject(false)

const getRpcUrl = (networkId: NetworkId) => {
  const urls = isInFallbackRpcMode$.getValue() ? fallbackRpcUrls : rpcUrls

  return urls[networkId] || urls[getLastUsedNetworkId()]
}

export const getReadOnlyProvider = (
  networkId: NetworkId = getLastUsedNetworkId(),
) => new providers.JsonRpcProvider(getRpcUrl(networkId), 'any')

export const readOnlyProvider$ = new BehaviorSubject(getReadOnlyProvider())

// React to change on fallback RPC mode
isInFallbackRpcMode$.pipe(distinctUntilChanged()).subscribe(() => {
  readOnlyProvider$.next(getReadOnlyProvider())
})

// const initialReadOnlyProvider = getReadOnlyProvider()

// let currentFailingBlocksCount = 0
// const checkAndUpdateIsInFallbackRpcMode = async () => {
//   try {
//     await initialReadOnlyProvider.getBlockNumber()

//     // Reset whenever one block number was retrieved successfully
//     currentFailingBlocksCount = 0
//     isInFallbackRpcMode$.next(false)
//   } catch (error) {
//     // Count failing blocks and turn on the fallback mode when reaching threshold
//     currentFailingBlocksCount += 1

//     if (
//       currentFailingBlocksCount >=
//       BLOCKS_TO_WAIT_BEFORE_SWITCHING_TO_FALLBACK_RPC
//     ) {
//       isInFallbackRpcMode$.next(true)
//     }
//   }
// }

// Watchout for fallback RPC mode
// setInterval(
//   checkAndUpdateIsInFallbackRpcMode,
//   INTERVAL_MILLISECONDS_TO_CHECK_FOR_FALLBACK_RPC_MODE,
// )

export const provider$ = new BehaviorSubject<providers.BaseProvider>(
  readOnlyProvider$.getValue(),
)

export const walletProvider$ =
  new BehaviorSubject<providers.Web3Provider | null>(null)

export const getSigner = (
  provider: providers.JsonRpcProvider | null = walletProvider$.getValue(),
) => either(() => provider?.getSigner(), undefined)
