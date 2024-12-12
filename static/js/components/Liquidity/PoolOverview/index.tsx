import { truncateStringInTheMiddle } from '@swarm/core/shared/utils'
import { big } from '@swarm/core/shared/utils/helpers/big-helpers'
import { recursiveRound } from '@swarm/core/shared/utils/math'
import { PoolOverviewProps } from '@swarm/types/props'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Text } from 'rimble-ui'

import H4 from 'src/components/Liquidity/H4'
import LiquidityPieChart from 'src/components/Liquidity/LiquidityPieChart'
import { LiquidityActionColor } from 'src/shared/enums/liquidity-action-color'

import Block from './Block'

const PoolOverview = ({
  tokens,
  poolTokensToIssue,
  userPoolTokenBalance: myBalance,
  totalShares,
  swapFee,
  id: poolId,
  action,
}: PoolOverviewProps) => {
  const { t } = useTranslation('liquidityModals')
  const isAddLiquidity = action === 'add'

  const bigTotalShares = big(totalShares)

  const mySharePercent = bigTotalShares.eq(0)
    ? 0
    : recursiveRound(myBalance.div(bigTotalShares).times(100))

  const [newShare, newTotalShares] = isAddLiquidity
    ? [myBalance.add(poolTokensToIssue), bigTotalShares.add(poolTokensToIssue)]
    : [myBalance.sub(poolTokensToIssue), bigTotalShares.sub(poolTokensToIssue)]

  const newSharePercentage =
    newTotalShares.eq(0) || newShare.eq(0)
      ? 0
      : recursiveRound(newShare.div(newTotalShares).times(100))

  return (
    <Box
      width="200px"
      borderRight="1px solid"
      borderColor="light-gray"
      pr="24px"
    >
      <H4 text={t('poolOverview')} />
      <Block title={t('poolAddress')}>
        <Text color="black" title={poolId} lineHeight="24px">
          {truncateStringInTheMiddle(poolId)}
        </Text>
      </Block>
      <Block title={t('yourShare')}>
        <Text.span color="black" lineHeight="24px">
          {mySharePercent}%
        </Text.span>
        <Text.span
          color={!!action && LiquidityActionColor[action]}
          fontWeight={5}
          lineHeight="24px"
          opacity={mySharePercent === newSharePercentage ? 0 : 1}
        >
          {' -> '} {newSharePercentage}%
        </Text.span>
      </Block>
      <Block title={t('swapFee')}>
        <Text.span color="black" lineHeight="24px">
          {big(swapFee).times(100).toString()}%
        </Text.span>
      </Block>
      <LiquidityPieChart tokens={tokens} />
    </Box>
  )
}

export default PoolOverview
