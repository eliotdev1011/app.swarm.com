import { BrandNames, BrandRoutes } from '@swarm/core/shared/enums'
import { getCurrentBaseName } from '@swarm/core/shared/utils'

type BrandKey = keyof typeof BrandNames

export const getCurrentBrandName = () => {
  const baseName = getCurrentBaseName()
  const brandMap = Object.entries(BrandRoutes).find(
    ([, value]) => value === baseName,
  )
  const brandKey = brandMap?.[0]

  if (brandKey) {
    return BrandNames[brandKey as BrandKey]
  }

  return BrandNames.swarm
}

export const checkIsMattereum = () =>
  getCurrentBaseName() === BrandRoutes.mattereum

export const checkIsSwarm = () => {
  const baseName = getCurrentBaseName()
  switch (baseName) {
    case BrandRoutes.fintiv:
    case BrandRoutes.mattereum:
      return false
    default:
      return true
  }
}
