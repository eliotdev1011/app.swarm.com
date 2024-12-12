import { big, ZERO } from '@swarm/core/shared/utils/helpers/big-helpers'
import { isSameEthereumAddress } from '@swarm/core/web3'
import { PoolExpanded } from '@swarm/types'

export const mapUserShareToPool = <P extends PoolExpanded>(
  pool: P,
  userAddress?: string,
) => {
  if (pool && pool.shares && pool.shares.length > 0) {
    const userShare = pool.shares.find((share) =>
      isSameEthereumAddress(share.userAddress.id, userAddress),
    )
    return {
      ...pool,
      userShare: userShare ? big(userShare.balance) : ZERO,
    }
  }

  return pool
}
