import { BigSource } from 'big.js'

import { BigUnit } from '@core/shared/enums'
import { big } from '@core/shared/utils/helpers'

import { recursiveRound } from '../math'

const unitValues = Object.values(BigUnit).filter(
  (value) => !Number.isNaN(+value),
) as number[]

export const formatBigInt = (_figure: BigSource, base = 1): string => {
  const figure = big(_figure)
  const unit = unitValues.find((u) => figure.gte(u)) || 1
  const prettyInt = recursiveRound(figure.div(unit), { base })

  return prettyInt + (BigUnit[unit] || '')
}
