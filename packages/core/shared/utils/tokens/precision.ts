import { Market } from '@swarm/types/lend-borrow'
import { AbstractAsset, ExtendedNativeToken } from '@swarm/types/tokens'
import { InvestAssetSG } from '@swarm/types/tokens/invest'

import {
  DecimalPrecisionKey,
  DECIMALS_PRECISION,
  DEFAULT_DECIMALS,
} from '@core/shared/consts/math'

import {
  isStableCoin,
  isStockToken as isStockTokenFilter,
  isStockTokenType,
} from './filters'

const getPrecisionKey = (symbol: string): DecimalPrecisionKey => {
  if (isStableCoin(symbol)) {
    return 'STABLE_COINS'
  }

  if (isStockTokenFilter(symbol)) {
    return 'STOCK_TOKENS'
  }

  return 'CRYPTO_CURRENCIES'
}

export const getInputPrecision = (
  token:
    | ExtendedNativeToken
    | Pick<InvestAssetSG, 'assetType'>
    | Market
    | Pick<AbstractAsset, 'symbol'>,
) => {
  let decimalPrecisionKey: DecimalPrecisionKey | undefined

  if ('assetType' in token && isStockTokenType(token)) {
    decimalPrecisionKey = 'STOCK_TOKENS'
  } else if ('symbol' in token) {
    // Any abstract token is valid token
    decimalPrecisionKey = getPrecisionKey(token.symbol)
  } else if ('underlyingSymbol' in token) {
    // Condition for market token
    decimalPrecisionKey = getPrecisionKey(token.underlyingSymbol)
  }

  return decimalPrecisionKey
    ? DECIMALS_PRECISION[decimalPrecisionKey].INPUT
    : DEFAULT_DECIMALS
}
