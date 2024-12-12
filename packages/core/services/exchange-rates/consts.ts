import { NetworkId } from '@swarm/types/config'

import { NATIVE_TOKEN_SKELETON } from '@core/shared/consts'
import { unifyKeyValueObj } from '@core/shared/utils/formatting'

export const testnetToMainnetTokensMap: Record<
  NetworkId,
  Record<string, string>
> = {
  1: {
    [NATIVE_TOKEN_SKELETON.id]: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // WETH
  },
  137: {
    [NATIVE_TOKEN_SKELETON.id]: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270', // WMATIC
  },
  421614: {},
  8453: {},
}

export const HARDCODED_EXCHANGE_RATES: Record<
  NetworkId,
  Record<string, number>
> = {
  1: {},
  137: {},
  421614: {},
  8453: {},
}

export const exchangeRatesMap: Record<NetworkId, Record<string, string>> = {
  1: unifyKeyValueObj({
    '0x7F94388A552580712C4ec724f470c6E4a74B5244':
      '0x6ce43f19A23Ba474449D6231446D752ab3dB3f6D', // xGold - xGoldOz
  }),
  137: unifyKeyValueObj({
    '0xf7cad33265149a4e49686dfcf51b9e0243b6ff97':
      '0xFb75d446E30842C8b7100014dB7C5fD2CBfbC072', // xGoldTracker - xGoldOz
  }),
  421614: {},
  8453: {},
}
