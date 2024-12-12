import { isSameEthereumAddress } from '@swarm/core/web3'
import { PoolExpanded } from '@swarm/types'

import { PoolType } from 'src/shared/enums'

export function getPoolType(
  pool: Pick<PoolExpanded, 'crp' | 'holders'>,
  accountAddress: string,
): PoolType {
  const isHolder = pool.holders.some((holder) => {
    return isSameEthereumAddress(holder, accountAddress)
  })

  if (isHolder) {
    return PoolType['my-pools']
  }

  if (pool.crp) {
    return PoolType.smart
  }

  return PoolType.fixed
}
