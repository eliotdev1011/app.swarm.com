import { normalize } from '@core/shared/utils/helpers'

export const DEFAULT_DECIMALS = 18
export const SPT_DECIMALS = 18
export const BONE = 10 ** SPT_DECIMALS
export const BALANCE_BUFFER = 0.01
export const MAX_OUT_RATIO = normalize(BONE / 3 + 1, SPT_DECIMALS)
export const MAX_IN_RATIO = normalize(BONE / 2, SPT_DECIMALS)
export const DOTC_ACCURAC = 0.999

interface DecimalPrecision {
  DISPLAY_BALANCE: number
  DISPLAY_PRICE: number
  INPUT: number
}

export type DecimalPrecisionKey =
  | 'DOLLARS'
  | 'STABLE_COINS'
  | 'CRYPTO_CURRENCIES'
  | 'STOCK_TOKENS'

export const DECIMALS_PRECISION: Record<DecimalPrecisionKey, DecimalPrecision> =
  {
    DOLLARS: {
      DISPLAY_BALANCE: 2,
      DISPLAY_PRICE: 2,
      INPUT: 2,
    },
    STABLE_COINS: {
      DISPLAY_BALANCE: 2,
      DISPLAY_PRICE: 6,
      INPUT: 6,
    },
    CRYPTO_CURRENCIES: {
      DISPLAY_BALANCE: 4,
      DISPLAY_PRICE: 7,
      INPUT: 7,
    },
    STOCK_TOKENS: {
      DISPLAY_BALANCE: 4,
      DISPLAY_PRICE: 7,
      INPUT: 7,
    },
  }
