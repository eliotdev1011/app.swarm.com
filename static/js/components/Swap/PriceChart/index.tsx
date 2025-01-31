import useSwaps from '@swarm/core/hooks/pool/useSwaps'
import autoRound from '@swarm/core/shared/utils/math/autoRound'
import { ExtendedNativeToken } from '@swarm/types/tokens'
import match from 'conditional-expression'
import { fromUnixTime, isAfter, subHours } from 'date-fns'
import { useEffect, useMemo } from 'react'
import { Area, AreaChart, YAxis } from 'recharts'
import { Card, Flex, Icon, Text } from 'rimble-ui'

import { NOW, STABLE_DATA } from './consts'
import { getColors } from './helpers'

interface PriceChartProps {
  tokenPair?: [string, string]
  tokenIn?: ExtendedNativeToken
  tokenOut?: ExtendedNativeToken
  lastSwapId?: string
}

const DEFAULT_DATE_FROM = subHours(new Date(), 24)

const PriceChart = ({
  tokenPair,
  tokenIn,
  tokenOut,
  lastSwapId,
}: PriceChartProps) => {
  const { data, refetch } = useSwaps(
    useMemo(
      () => ({
        tokens: tokenPair,
        dateFrom: DEFAULT_DATE_FROM,
      }),
      [tokenPair],
    ),
  )

  const localLastSwapId = data?.swaps?.[0]?.id

  useEffect(() => {
    if (lastSwapId !== localLastSwapId) {
      refetch()
    }
  }, [localLastSwapId, lastSwapId, refetch])

  const chartData = useMemo(() => {
    const swaps = data?.swaps
      .filter((swap) =>
        isAfter(fromUnixTime(swap.timestamp), subHours(NOW, 24)),
      )
      .map((swap) => ({
        name: 'price',
        value:
          tokenIn?.xToken?.id === swap.tokenIn
            ? Number(swap.tokenAmountOut) / Number(swap.tokenAmountIn)
            : Number(swap.tokenAmountIn) / Number(swap.tokenAmountOut),
      }))
      .reverse()

    if (!swaps?.length) {
      return STABLE_DATA
    }

    if (swaps?.length === 1) {
      return [swaps[0], swaps[0]]
    }

    return swaps
  }, [data?.swaps, tokenIn?.xToken?.id])

  const change = useMemo(
    () =>
      autoRound(
        ((chartData[chartData.length - 1].value - chartData[0].value) * 100) /
          chartData[0].value,
      ),
    [chartData],
  )

  const { stroke, fill, status } = getColors(change)

  if (!tokenIn || !tokenOut) {
    return null
  }

  return (
    <Card
      mt={3}
      p={['16px', '24px']}
      borderRadius={1}
      boxShadow={4}
      border="0"
      display="flex"
      flexDirection="column"
    >
      <Flex
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Text fontSize={1} color="grey" mr="auto">
          <Text.span fontWeight={4}>{` ${tokenIn?.symbol} / `}</Text.span>
          <Text.span fontWeight={4}>{` ${tokenOut?.symbol}`}</Text.span>
        </Text>

        <Flex alignItems="flex-end">
          {match(change)
            .equals(0)
            .then(null)
            .else(
              <Icon
                name="PlayArrow"
                color={status}
                size="20px"
                style={{
                  transform: `rotate(${-Math.sign(change) * 90}deg)`,
                }}
              />,
            )}
          <Text
            fontSize={1}
            color={match(change)
              .isGreaterThan(0)
              .then('success')
              .lessThan(0)
              .then('danger')
              .else('warning')}
            fontWeight={5}
            mx={2}
          >
            {change}%
          </Text>
          <Text fontSize={1} color="grey">{` (24h price)`}</Text>
        </Flex>
        {chartData.length && (
          <AreaChart width={132} height={32} data={chartData}>
            <YAxis domain={['auto', 'auto']} width={0} />
            <Area dataKey="value" stroke={stroke} fill={fill} baseLine={0} />
          </AreaChart>
        )}
      </Flex>
    </Card>
  )
}

export default PriceChart
