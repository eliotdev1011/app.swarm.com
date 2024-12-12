import { ZERO } from '@swarm/core/shared/utils/helpers/big-helpers'
import { PoolToken } from '@swarm/types/tokens'

const getRatio = <T extends PoolToken>({
  balance = ZERO,
  poolBalance = 1,
}: T): number => balance?.div(poolBalance).toNumber() || 0

export const calculateRatio = <T extends PoolToken>(tokens: T[]) => {
  const frontRunnableToken = tokens.reduce(
    (frontToken, token) =>
      getRatio(token) <= getRatio(frontToken) ? token : frontToken,
    tokens[0],
  )

  return getRatio(frontRunnableToken)
}
