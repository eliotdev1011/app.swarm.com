import { big, ZERO } from '@swarm/core/shared/utils/helpers/big-helpers'
import { Pool } from '@swarm/types'

export const calculateMarketCap = <P extends Pool>(pool: P) => {
  const validTokens = pool.tokens.filter(
    ({ exchangeRate, poolBalance }) => exchangeRate && poolBalance,
  )

  if (validTokens.length) {
    const [sumWeight, sumValue] = validTokens.reduce(
      (acc, token) => {
        const value = big(token.poolBalance).times(token.exchangeRate || 0)
        const sWeight = acc[0].plus(
          big(token.denormWeight).div(pool.totalWeight).toNumber(),
        )
        const sValue = acc[1].plus(value)

        return [sWeight, sValue]
      },
      [ZERO, ZERO],
    )

    if (sumWeight.gt(0)) {
      return sumValue.div(sumWeight).toNumber()
    }
  }

  return 0
}
