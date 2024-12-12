import {
  normalizedPoolTokens,
  truncateStringInTheMiddle,
} from '@swarm/core/shared/utils'
import { calculateVolume } from '@swarm/core/shared/utils/calculations'
import {
  formatBigInt,
  prettifyBalance,
} from '@swarm/core/shared/utils/formatting'
import { big } from '@swarm/core/shared/utils/helpers/big-helpers'
import { recursiveRound } from '@swarm/core/shared/utils/math'
import { PoolExpanded } from '@swarm/types'
import { AbstractToken } from '@swarm/types/tokens'
import SvgIcon from '@swarm/ui/swarm/SvgIcon'
import TokenIcons from '@swarm/ui/swarm/TokenIcons'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Flex, Text } from 'rimble-ui'
import styled from 'styled-components/macro'
import { layout, LayoutProps } from 'styled-system'

import { calculateMarketCap } from 'src/shared/utils/pool'

const Td = styled.td<LayoutProps>`
  ${layout}
`

interface PoolRowProps {
  pool: PoolExpanded
}

const PoolRow = ({ pool }: PoolRowProps) => {
  const {
    id: poolId,
    crp,
    swaps,
    totalShares,
    totalSwapVolume,
    userShare,
    hasExtraRewards,
    marketCap,
  } = pool

  const bigTotalShares = big(totalShares)

  const userPoolSharePercent =
    !userShare || bigTotalShares.eq(0)
      ? 0
      : userShare.times(100).div(bigTotalShares).toNumber()

  const liquidityMultiplier = big(pool.liquidity).gt(0)
    ? big(calculateMarketCap(pool)).div(pool.liquidity)
    : big(1)

  const volume = calculateVolume(totalSwapVolume, swaps)
    .mul(liquidityMultiplier)
    .toNumber()

  const tokensInfo = useMemo(
    () =>
      pool.tokens
        .map(({ xToken }) => xToken?.token)
        .filter(Boolean) as AbstractToken[],
    [pool.tokens],
  )

  return (
    <tr>
      <Td title={poolId}>
        <Link to={`/pool/${poolId}`} style={{ textDecoration: 'none' }}>
          <Text.span color="near-black">
            {truncateStringInTheMiddle(poolId)}
          </Text.span>
        </Link>
      </Td>
      <Td>
        <Link to={`/pool/${poolId}`} style={{ textDecoration: 'none' }}>
          <TokenIcons tokens={tokensInfo} />
        </Link>
      </Td>
      <Td>
        <Link to={`/pool/${poolId}`} style={{ textDecoration: 'none' }}>
          <Flex flexWrap="wrap">
            {normalizedPoolTokens(pool.tokens).map((token) => (
              <Text.span key={token.address} mr={2} color="black">
                <Text.span fontWeight={5}>{`${big(token.weight)
                  .round(0, 2)
                  .toString()}% `}</Text.span>
                {token.xToken?.token?.symbol}
              </Text.span>
            ))}
          </Flex>
        </Link>
      </Td>
      <Td style={{ textAlign: 'center' }}>
        {hasExtraRewards || crp ? (
          <Link
            to={`/pool/${poolId}`}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
            }}
          >
            {hasExtraRewards ? (
              <SvgIcon
                style={{ flexShrink: 0 }}
                name="PoolExtraRewards"
                width="33px"
              />
            ) : null}
            {crp ? (
              <Text.span
                style={{ flexShrink: 0 }}
                fontSize="0.75rem"
                fontWeight={5}
                color="primary"
                fontStyle="italic"
              >
                SMART
              </Text.span>
            ) : null}
          </Link>
        ) : null}
      </Td>
      <Td>{big(pool.swapFee).times(100).toString()}%</Td>
      <Td title={prettifyBalance(marketCap || 0)}>
        {marketCap === null ? '--' : `$${formatBigInt(marketCap || 0)}`}
      </Td>
      <Td>
        <>{recursiveRound(userPoolSharePercent, { base: 1 })}%</>
      </Td>
      <Td title={prettifyBalance(volume)}>${formatBigInt(volume)}</Td>
    </tr>
  )
}

export default PoolRow
