import { big } from '@swarm/core/shared/utils/helpers/big-helpers'
import { PoolExpanded } from '@swarm/types'

export function matchPoolHasReachedLiquidityCap(
  pool: Pick<PoolExpanded, 'cap' | 'totalShares'>,
): boolean {
  return pool.cap !== null && big(pool.totalShares).gte(pool.cap)
}
