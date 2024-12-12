import Big, { BigSource } from 'big.js'

import either from './either'

Big.DP = 30
Big.RM = 0
Big.NE = -30
Big.PE = 10

Big.prototype.toNumber = function toNumber() {
  const roundedValue = this.round(10, 0)
  return Number(roundedValue.toString())
}
export const big = (value?: BigSource | null) =>
  new Big(value && Number(value) ? value : 0)

export const isBigSource = (value: unknown): value is BigSource =>
  either(() => {
    Big(value as BigSource)
    return true
  }, false)

export const ZERO = big(0)

export const B_TWO = big(2)

export const B_TEN = big(10)

export const safeDiv = (input?: BigSource | null, divider?: BigSource | null) =>
  input && divider && !big(divider).eq(0) ? big(input).div(big(divider)) : ZERO

export const idiv = (input?: BigSource, divider?: BigSource) =>
  safeDiv(input, divider).round(0, 0)

export const BONE = B_TEN.pow(18)

export const scale = (input: BigSource, decimalPlaces: number): Big =>
  B_TEN.pow(decimalPlaces).times(big(input))

export const bdiv = (a: BigSource, b: BigSource): Big => {
  const bigA = big(a)
  const bigB = big(b)
  const c0 = bigA.times(BONE)
  const c1 = c0.plus(bigB.div(B_TWO))
  return idiv(c1, bigB)
}

export const toWei = (val: BigSource): Big => scale(val, 18)

export const normalize = (bigBalance: BigSource, decimals = 0): Big =>
  safeDiv(bigBalance, 10 ** decimals)

export const denormalize = (bigBalance: BigSource, decimals = 0): Big =>
  big(bigBalance).times(10 ** decimals)

export const sort = (bigNumbers: BigSource[], mode = 'asc') =>
  bigNumbers.sort(
    (a: BigSource, b: BigSource) =>
      big(a).cmp(b) * (Number(mode === 'desc') ? -1 : 1),
  )

export const min = (...bigNumbers: BigSource[]): Big => big(sort(bigNumbers)[0])

export const max = (...bigNumbers: BigSource[]): Big =>
  big(sort(bigNumbers, 'desc')[0])

export const compareBig = (
  first: Big | null | undefined,
  second: Big | null | undefined,
) => first === second || (!!first && !!second && first.eq(second))

// eslint-disable-next-line @typescript-eslint/no-shadow
export const isBetween = (min: BigSource, max: BigSource) => (value: unknown) =>
  ((typeof value === 'string' && value !== '') ||
    (typeof value === 'number' && !Number.isNaN(value)) ||
    value instanceof Big) &&
  big(min).lte(value) &&
  big(max).gte(value)

// eslint-disable-next-line @typescript-eslint/no-shadow
export const isLessThan = (max: BigSource) => (value: BigSource) =>
  big(value).lte(max)

// eslint-disable-next-line @typescript-eslint/no-shadow
export const isGreaterThan = (min: BigSource) => (value: BigSource) =>
  big(value).gte(min)
