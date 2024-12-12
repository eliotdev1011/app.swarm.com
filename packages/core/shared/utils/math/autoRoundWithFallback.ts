import { BigSource } from 'big.js'

import { big } from '@core/shared/utils/helpers'

import autoRound, { AutoRoundOptions } from './autoRound'

interface FallbackOption {
  minValue?: BigSource
}

const autoRoundWithFallback = (
  num: BigSource,
  { minValue, ...options }: AutoRoundOptions & FallbackOption = {},
) => {
  if (minValue && big(num).lt(minValue) && !big(num).eq(0)) {
    return `<${big(minValue).toString()}`
  }
  return autoRound(num, options)
}

export default autoRoundWithFallback
