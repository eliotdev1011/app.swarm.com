import { formatXAxisTick, generateChartData } from '@swarm/core/shared/utils'
import { PoolChartProps } from '@swarm/types/props'
import { Color } from '@ui/theme'
import { useMemo } from 'react'
import { Area, AreaChart, Tooltip, XAxis, YAxis } from 'recharts'

import ResponsivePoolChart, { commonAxisProps } from './ResponsiveChart'

const LinePoolChart = ({
  metrics,
  timestamps,
  yAxisTickFormatter,
  tooltipFormatter,
}: PoolChartProps) => {
  const data = useMemo(() => generateChartData(timestamps, metrics), [
    metrics,
    timestamps,
  ])

  return (
    <ResponsivePoolChart data={data} yAxisTickFormatter={yAxisTickFormatter}>
      <AreaChart data={data} margin={{ right: 10 }}>
        <YAxis domain={['auto', 'auto']} width={0} orientation="right" />
        <XAxis
          {...commonAxisProps}
          dataKey="time"
          interval={1}
          tickFormatter={formatXAxisTick}
        />
        <Area
          strokeWidth={2}
          type="linear"
          dataKey="value"
          fill="#fef5ed"
          stroke="#F2994A"
        />
        <Tooltip
          isAnimationActive={false}
          cursor={{
            stroke: 'grey',
            strokeWidth: 1,
            strokeDasharray: '4',
          }}
          allowEscapeViewBox={{ x: false, y: false }}
          labelFormatter={() => ''}
          itemStyle={{ color: '#fff' }}
          contentStyle={{
            backgroundColor: Color.greyDark,
            borderRadius: '4px',
            padding: '8px',
          }}
          separator=""
          formatter={(value: number) => [tooltipFormatter(value), '']}
        />
      </AreaChart>
    </ResponsivePoolChart>
  )
}

export default LinePoolChart
