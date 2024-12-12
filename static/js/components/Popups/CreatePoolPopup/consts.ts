import { big, BONE } from '@swarm/core/shared/utils/helpers/big-helpers'

import { NewPoolSchema } from './types'

export const MIN_FEE = big(1).div(big(10).pow(6))
export const MAX_FEE = big(3).div(100)
export const MIN_WEIGHT = big(1)
export const MAX_WEIGHT = big(50)
export const MAX_TOTAL_WEIGHT = big(50)
export const MIN_BALANCE = BONE.div(big(10).pow(12))
export const DEFAULT_SWAP_FEE = 0.0015
export const DEFAULT_TOKEN_WEIGHT = '1'
export const MIN_POOL_SUPPLY = 100
export const MAX_POOL_SUPPLY = big(10).pow(9)

export const newPoolInitialValues: NewPoolSchema = {
  swapFee: DEFAULT_SWAP_FEE,
  assets: [],
  smartPool: {
    rights: {
      canPauseSwapping: false,
      canChangeSwapFee: false,
      canChangeWeights: false,
      canAddRemoveTokens: false,
      canWhitelistLPs: false,
      canChangeCap: false,
    },
    minimumGradualUpdateDuration: 0,
    addTokenTimeLockDuration: 0,
    tokenSymbol: 'SPT',
    tokenName: '', // will be populated with the assets symbols by default
    initialSupply: '100',
  },
  isSmartPool: false,
}

export const AMOUNT_EXCEEDS_BALANCE = 'Amount exceeds balance'
