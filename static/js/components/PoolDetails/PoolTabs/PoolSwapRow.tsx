import {
  formatBigBalance,
  prettifyBalance,
} from '@swarm/core/shared/utils/formatting'
import { Swap } from '@swarm/types'
import ExplorerLink from '@swarm/ui/swarm/Link/ExplorerLink'
import TokenIcon from '@swarm/ui/swarm/TokenIcon'
import { format, fromUnixTime } from 'date-fns'
import { useMemo } from 'react'
import { Flex, Text } from 'rimble-ui'
import styled from 'styled-components/macro'
import { layout, LayoutProps } from 'styled-system'

const Td = styled.td<LayoutProps>`
  ${layout}
`

const PoolSwapRow = ({
  timestamp,
  tokenInSym,
  tokenAmountIn,
  tokenAmountOut,
  tokenOutSym,
  feeValue,
  id,
}: Swap) => {
  const txHash = useMemo(() => id.split('-')[0], [id])

  return (
    <tr>
      <Td>
        <Text.span
          fontSize={2}
          fontWeight={2}
          color="near-black"
          display={['none', 'none', 'none', 'inline']}
        >
          {format(fromUnixTime(timestamp), 'MMMM dd, yyyy hh:mm aa')}
        </Text.span>
      </Td>
      <Td>
        <Flex
          alignItems="center"
          justifyContent={[
            'flex-start',
            'flex-start',
            'flex-start',
            'flex-end',
          ]}
        >
          <Text.span
            title={prettifyBalance(tokenAmountIn, 8)}
            fontSize={2}
            fontWeight={2}
          >
            {formatBigBalance(tokenAmountIn, 3)}
          </Text.span>
          <Text.span fontSize={2} fontWeight={5} ml={2}>
            {tokenInSym}
          </Text.span>
          <TokenIcon ml={2} symbol={tokenInSym} width="20px" height="20px" />
        </Flex>
      </Td>
      <Td>
        <Flex alignItems="center" justifyContent="flex-end">
          <Text.span
            title={prettifyBalance(tokenAmountOut, 8)}
            fontSize={2}
            fontWeight={2}
          >
            {formatBigBalance(tokenAmountOut, 3)}
          </Text.span>
          <Text.span fontSize={2} fontWeight={5} ml={2}>
            {tokenOutSym}
          </Text.span>
          <TokenIcon ml={2} symbol={tokenOutSym} width="20px" height="20px" />
        </Flex>
      </Td>
      <Td>
        <Flex justifyContent="flex-end">
          <ExplorerLink type="tx" hash={txHash} />
        </Flex>
      </Td>
      <Td>
        <Flex justifyContent="flex-end">
          <Text.span
            title={prettifyBalance(feeValue)}
            fontSize={2}
            fontWeight={2}
          >
            ${prettifyBalance(feeValue, 2, 2)}
          </Text.span>
        </Flex>
      </Td>
    </tr>
  )
}

export default PoolSwapRow
