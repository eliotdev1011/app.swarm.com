import { PoolToken } from '@swarm/types/tokens'
import match from 'conditional-expression'

import { FORBIDDEN_TIERS } from '@core/shared/consts/tiers'
import { Tier, VerificationStatus } from '@core/shared/enums'
import { vouchersYotiLocalStorage } from '@core/shared/localStorage/vouchersYotiLocalStorage'
import { big, ZERO } from '@core/shared/utils/helpers'

export const truncateStringInTheMiddle = (
  str: string,
  strLength = 41,
  strPositionStart = 6,
  strPositionEnd = 4,
) => {
  if (str.length > strLength) {
    return `${str.substr(0, strPositionStart)}...${str.substr(
      str.length - strPositionEnd,
      str.length,
    )}`
  }
  return str
}

export const getVouchersAuthToken = () => {
  const response = vouchersYotiLocalStorage.get()
  return response?.access_token
}

export const normalizedPoolTokens = <T extends PoolToken>(tokens: T[]) => {
  const totalWeight = tokens.reduce(
    (acc, token) => acc.add(token.denormWeight || 0),
    ZERO,
  )

  if (totalWeight.eq(0)) {
    return tokens.map((token) => ({ ...token, weight: ZERO }))
  }

  return tokens.map((token) => ({
    ...token,
    weight: big(token.denormWeight).times(100).div(totalWeight),
  }))
}

export const arrayWrap = (item: unknown) => {
  if (typeof item === 'undefined' || item === null) {
    return []
  }
  if (Array.isArray(item)) {
    return item
  }
  return [item]
}

export const getVerificationStep = (status: VerificationStatus) =>
  match(status)
    .equals(VerificationStatus.notVerified)
    .then(2)
    .equals(VerificationStatus.addressVerified)
    .then(3)
    .equals(VerificationStatus.kycVerified)
    .then(4)
    .equals(VerificationStatus.tier1Verified)
    .then(5)
    .equals(VerificationStatus.paymentVerified)
    .then(6)
    .equals(VerificationStatus.DocSignVerified)
    .then(7)
    .equals(VerificationStatus.tier2Verified)
    .then(8)
    .else(0)

export const hasCompletedVerification = (target: VerificationStatus) => (
  status: VerificationStatus,
) => {
  const targetStep = getVerificationStep(target)
  const currentStep = getVerificationStep(status)

  return targetStep <= currentStep
}

export const tierAtLeast = (toMatch: Tier) => (candidate: Tier) => {
  if (candidate === Tier.admin) return true

  if (FORBIDDEN_TIERS.includes(candidate)) {
    return false
  }

  if (toMatch === candidate) {
    return true
  }

  if (toMatch === Tier.tier1) {
    return [Tier.tier1, Tier.tier2].includes(candidate)
  }

  return false
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createMapper = <Output extends any, Input extends any = any>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...mappers: ((item: any) => any)[]
) => (collection: Input[]) =>
  (mappers.reduce(
    (acc, mapper) => acc.map(mapper),
    collection,
  ) as unknown) as Output[]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createFilter = <T extends any>(
  ...filters: ((item: T) => boolean)[]
) => (collection: T[]): T[] =>
  filters.reduce((acc, filter) => acc.filter(filter), collection)

export const propertyNotFalsy = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends Record<string, any> = Record<string, any>
>(
  property: string,
) => (item: T) => !!item[property]

export const getEnvironment = ():
  | 'local'
  | 'development'
  | 'production'
  | 'deployable' => {
  switch (window.location.hostname) {
    case 'localhost':
      return 'local'
    case 'dev.swarm.com':
      return 'development'
    case 'trade.swarm.markets':
    case 'app.swarm.com':
      return 'production'
    default:
      return 'deployable'
  }
}
