import { ArrowForward } from '@rimble/icons'
import useDeepTranslation from '@swarm/core/hooks/i18n/useDeepTranslation'
import {
  formatBigBalance,
  formatBigInt,
  prettifyBalance,
} from '@swarm/core/shared/utils/formatting'
import { recursiveRound } from '@swarm/core/shared/utils/math'
import { PoolTokenInfo } from '@swarm/types/tokens'
import Tooltip from '@swarm/ui/presentational/Tooltip'
import ExplorerLink from '@swarm/ui/swarm/Link/ExplorerLink'
import TokenIcon from '@swarm/ui/swarm/TokenIcon'
import { Flash, Flex, Text } from 'rimble-ui'
import styled from 'styled-components/macro'
import { layout, LayoutProps } from 'styled-system'

const Td = styled.td<LayoutProps>`
  ${layout}
`

interface Props extends PoolTokenInfo {
  targetWeight?: string
  remainingBlocksUntilAddTokenTimeLock?: number
  remainingBlocksBeforeWeightsUpdateEndBlock?: number
  isBeingAdded?: boolean
}

const PoolBalanceRow = ({
  name,
  symbol,
  weight,
  targetWeight,
  poolBalance,
  userBalance,
  userAssetValue,
  address,
  remainingBlocksUntilAddTokenTimeLock = 0,
  remainingBlocksBeforeWeightsUpdateEndBlock = 0,
  isBeingAdded,
}: Props) => {
  const { t } = useDeepTranslation('poolDetails', [
    'poolTabs',
    'balances',
    'th',
  ])

  return (
    <tr>
      <Td>
        <Flex ml={2} alignItems="center">
          <TokenIcon
            symbol={symbol}
            name={name}
            width="20px"
            height="20px"
            mr="10px"
          />
          <Text.span fontSize={2} fontWeight={5}>
            {symbol}
          </Text.span>
          <Text.span fontSize={2} fontWeight={2} ml="8px">
            {name}
          </Text.span>
          <ExplorerLink type="token" hash={address} label="" />
          {isBeingAdded === true || targetWeight !== undefined ? (
            <Tooltip
              placement="top"
              message={
                isBeingAdded
                  ? t('remainingBlocksUntilAddTokenTimeLock', {
                      blocksCount: remainingBlocksUntilAddTokenTimeLock,
                    })
                  : t('remainingBlocksBeforeWeightsUpdateEndBlock', {
                      blocksCount: remainingBlocksBeforeWeightsUpdateEndBlock,
                    })
              }
            >
              <Flash
                variant="warning"
                p="4px"
                paddingLeft="8px"
                paddingRight="8px"
                width="fit-content"
                ml="16px"
              >
                <Text.span
                  fontWeight={5}
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                  }}
                >
                  {isBeingAdded === true
                    ? t('pendingAddition')
                    : t('pendingChange')}
                </Text.span>
              </Flash>
            </Tooltip>
          ) : null}
        </Flex>
      </Td>
      <Td>
        <Flex justifyContent="flex-end" alignItems="center">
          <Text fontSize={2} fontWeight={2} color="black" textAlign="right">
            {recursiveRound(weight)}%{' '}
          </Text>
          {targetWeight !== undefined ? (
            <>
              <ArrowForward color="warning" size="20" ml="6px" mr="6px" />
              <Text
                fontSize={2}
                fontWeight={2}
                color="warning"
                textAlign="right"
              >
                {recursiveRound(targetWeight)}%
              </Text>
            </>
          ) : null}
        </Flex>
      </Td>
      <Td display={['none', 'table-cell']}>
        <Text
          title={prettifyBalance(poolBalance || 0, 18)}
          fontSize={2}
          fontWeight={2}
          color="black"
          textAlign="right"
        >
          {formatBigBalance(poolBalance || 0)}
        </Text>
      </Td>
      <Td display={['none', 'table-cell']}>
        <Text
          title={prettifyBalance(userBalance, 2, 6)}
          fontSize={2}
          fontWeight={2}
          color="black"
          textAlign="right"
        >
          {formatBigBalance(userBalance)}
        </Text>
      </Td>
      <Td display={['none', 'table-cell']}>
        <Text
          title={prettifyBalance(userAssetValue)}
          fontSize={2}
          fontWeight={2}
          color="black"
          textAlign="right"
        >
          ${formatBigInt(userAssetValue)}
        </Text>
      </Td>
    </tr>
  )
}

export default PoolBalanceRow
