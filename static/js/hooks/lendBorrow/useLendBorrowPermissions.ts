import { Tier } from '@swarm/core/shared/enums'
import { useTier } from '@swarm/core/state/hooks'
import { useMemo } from 'react'

interface Permissions {
  canSupply: boolean
  canRedeem: boolean
  canBorrow: boolean
  canRepay: boolean
}

export function useLendBorrowPermissions(): Permissions {
  const tier = useTier()

  const value = useMemo<Permissions>(() => {
    const isTier2 = tier === Tier.tier2
    const isRejected = tier === Tier.tier99

    return {
      canSupply: isTier2,
      canRedeem: isTier2 || isRejected,
      canBorrow: isTier2,
      canRepay: isTier2 || isRejected,
    }
  }, [tier])

  return value
}
