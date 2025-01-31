import { PoolToken } from '@swarm/types/tokens'
import { Color } from '@swarm/ui/theme'
import React from 'react'
import { Cell, Pie, PieChart, Tooltip } from 'recharts'
import { Box, Text } from 'rimble-ui'

import Dot from './Dot'
import Legend from './Legend'
import { COLORS } from './config'

const LiquidityPieChart = ({ tokens }: { tokens: PoolToken[] }) => {
  const data = tokens.map((token) => ({
    id: token.id,
    name: token.symbol,
    value: Math.round((token.weight || 0) * 1000) / 10,
  }))

  return (
    <Box my="24px">
      <PieChart width={100} height={100}>
        <Tooltip
          allowEscapeViewBox={{ x: true, y: true }}
          content={({ payload, active }) =>
            active ? (
              <div
                style={{
                  backgroundColor: Color.greyDark,
                  borderRadius: '4px',
                  padding: '8px',
                  color: '#fff',
                  whiteSpace: 'nowrap',
                }}
              >
                {payload?.[0].name} {payload?.[0].value}%
              </div>
            ) : null
          }
        />
        <Pie
          data={data}
          dataKey="value"
          labelLine={false}
          outerRadius={50}
          startAngle={90}
          endAngle={450}
        >
          {data.map((token, index) => (
            <Cell
              key={token.id}
              fill={COLORS[index % COLORS.length]}
              stroke="none"
            />
          ))}
        </Pie>
      </PieChart>
      <Legend mt={3}>
        {data.map((token, index) => (
          <li key={token.id}>
            <Dot color={COLORS[index % COLORS.length]} />{' '}
            <Text.span fontSize={1}>
              {token.value}%{' '}
              <Text.span fontWeight={5} fontSize={1}>
                {token.name}
              </Text.span>
            </Text.span>
          </li>
        ))}
      </Legend>
    </Box>
  )
}

export default LiquidityPieChart
