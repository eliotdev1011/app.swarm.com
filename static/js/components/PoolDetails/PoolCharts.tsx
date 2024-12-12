import {
  formatBigInt,
  prettifyBalance,
} from '@swarm/core/shared/utils/formatting'
import { recursiveRound } from '@swarm/core/shared/utils/math'
import BarPoolChart from '@swarm/ui/presentational/Charts/BarPoolChart'
import LinePoolChart from '@swarm/ui/presentational/Charts/LinePoolChart'
import { StyledTabs } from '@swarm/ui/presentational/StyledTabs'
import StyledTab from '@swarm/ui/swarm/StyledTab'
import Big from 'big.js'
import match from 'conditional-expression'
import { ChangeEvent, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Loader } from 'rimble-ui'

import { usePoolMetrics } from 'src/hooks/pool/usePoolMetrics'

interface PoolChartsProps {
  poolAddress: string
  liquidityMultiplier: Big
}

const PoolCharts = ({ poolAddress, liquidityMultiplier }: PoolChartsProps) => {
  const { t } = useTranslation('poolDetails')
  const [currentChartIndex, setCurrentChartIndex] = useState(0)
  const {
    timestamps,
    liquidityMetrics,
    swapFeeMetrics,
    volumeMetrics,
    loading,
    error,
  } = usePoolMetrics(poolAddress, liquidityMultiplier)

  const handleSwitchTab = useCallback(
    // eslint-disable-next-line @typescript-eslint/ban-types
    (e: ChangeEvent<{}>, index: number) => {
      if (index !== currentChartIndex) {
        setCurrentChartIndex(index)
      }
    },
    [currentChartIndex],
  )

  const dollarChartProps = useMemo(
    () => ({
      timestamps,
      yAxisTickFormatter: (value: number) => `$${formatBigInt(value)}`,
      tooltipFormatter: (value: number) => `$ ${prettifyBalance(value)}`,
    }),
    [timestamps],
  )

  const swapFeeChartProps = useMemo(
    () => ({
      timestamps,
      metrics: swapFeeMetrics,
      yAxisTickFormatter: (value: number) => `${value}%`,
      tooltipFormatter: (value: number) => `${recursiveRound(value)}%`,
    }),
    [swapFeeMetrics, timestamps],
  )

  return (
    <>
      <StyledTabs
        value={currentChartIndex}
        onChange={handleSwitchTab}
        aria-label="chart tabs"
      >
        <StyledTab label={t('charts.liquidity')} />
        <StyledTab label={t('charts.volume')} />
        <StyledTab label={t('charts.feeReturns')} />
      </StyledTabs>
      <Box role="tabpanel" height="285px">
        {(loading && <Loader m="auto" />) ||
          (error && 'An error occurred!') ||
          match(currentChartIndex)
            .equals(0)
            .then(
              <LinePoolChart
                metrics={liquidityMetrics}
                {...dollarChartProps}
              />,
            )
            .equals(1)
            .then(
              <BarPoolChart metrics={volumeMetrics} {...dollarChartProps} />,
            )
            .equals(2)
            .then(<LinePoolChart {...swapFeeChartProps} />)
            .else(null)}
      </Box>
    </>
  )
}

export default PoolCharts
