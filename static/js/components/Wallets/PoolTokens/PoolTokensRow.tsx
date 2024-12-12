import { ExpandLess, ExpandMore, Help } from '@rimble/icons'
import { FlaggedFeatureName } from '@swarm/core/hooks/data/useFeatureFlags'
import { prettifyBalance } from '@swarm/core/shared/utils/formatting'
import { LiquidityActionType, PoolTokensRowProps } from '@swarm/types/props'
import { useHighLight } from '@swarm/ui/presentational/HighlightProvider'
import ExpandableCell from '@swarm/ui/presentational/Table/ExpandableCell'
import HighlightableTableRow from '@swarm/ui/presentational/Table/HighlitableTableRow'
import Tooltip from '@swarm/ui/presentational/Tooltip'
import FlaggedFeature from '@swarm/ui/swarm/FlaggedFeature'
import TokenIcon from '@swarm/ui/swarm/TokenIcon'
import { SyntheticEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'
import { Box, Button, Flex, Text } from 'rimble-ui'

import LiquidityModals from 'src/components/Liquidity/LiquidityModals'

const PoolTokensRow = ({
  tokenToRender,
  rowIndex,
  reload,
}: PoolTokensRowProps) => {
  const { name, symbol, userBalances, token, paused } = tokenToRender
  const { highlighted } = useHighLight(rowIndex)
  const [expanded, setExpanded] = useState(false)
  const { t } = useTranslation('wallets')
  const history = useHistory()

  const [liquidityModalOpen, setLiquidityModalOpen] = useState<
    LiquidityActionType | ''
  >('')

  const handleExpand = (e: SyntheticEvent) => {
    e.stopPropagation()
    setExpanded((prev: boolean) => !prev)
  }
  const handleAddLiquidityClick = (e: SyntheticEvent) => {
    e.stopPropagation()
    setLiquidityModalOpen('add')
  }

  const handleRemoveLiquidityClick = (e: SyntheticEvent) => {
    e.stopPropagation()
    setLiquidityModalOpen('remove')
  }

  const handleLiquidityModalClose = () => setLiquidityModalOpen('')

  const handleRowClick = () => history.push(`/pool/${token.id}`)

  return (
    <HighlightableTableRow rowIndex={rowIndex} onClick={handleRowClick}>
      <td>
        <Flex ml={2} alignItems="center">
          <TokenIcon symbol={symbol} name={name} width="32px" height="32px" />
          <Box flexGrow="1">
            <Text.span fontSize={2} fontWeight={5} ml="10px">
              {symbol}
            </Text.span>
            <Text.span fontSize={2} fontWeight={2} ml="8px">
              {name}
            </Text.span>
          </Box>
          <Box display={['block', 'none']} onClick={handleExpand}>
            {expanded ? (
              <ExpandLess color="near-black" />
            ) : (
              <ExpandMore color="near-black" />
            )}
          </Box>
        </Flex>
      </td>
      <ExpandableCell expanded={expanded}>
        <Flex
          alignItems="center"
          justifyContent="flex-start"
          display={['flex', 'none']}
        >
          <Text fontSize={1} fontWeight={4} color="grey">
            {t('poolTokens.pooled')}
          </Text>
          <Tooltip placement="top" message={t('poolTokens.pooled')}>
            <Help size="15" ml={2} color="grey" />
          </Tooltip>
        </Flex>

        <Flex
          alignItems="center"
          justifyContent={['flex-start', 'flex-end']}
          mt={[1, 0]}
        >
          <Flex
            flexDirection={['center', 'column']}
            alignItems={['center', 'flex-end']}
            justifyContent="flex-start"
            width={['100%', 'fit-content']}
          >
            <Text
              fontSize={2}
              fontWeight={2}
              color={['near-black', 'black']}
              textAlign="right"
            >
              {prettifyBalance(userBalances.ether)} {symbol}
            </Text>
            <Text
              fontSize={[2, 0]}
              fontWeight={3}
              color="grey"
              textAlign="right"
              ml={[2, 0]}
            >
              {prettifyBalance(userBalances.usd, 0)} USD
            </Text>
          </Flex>
        </Flex>
      </ExpandableCell>
      {!paused && (
        <ExpandableCell expanded={expanded} hide={!highlighted}>
          <Flex alignItems="center" justifyContent={['flex-start', 'flex-end']}>
            <FlaggedFeature name={FlaggedFeatureName.addLiqudity}>
              {!tokenToRender.isAnyPoolAssetPaused && (
                <Button height="28px" px={2} onClick={handleAddLiquidityClick}>
                  {t('poolTokens.actions.addLiquidity')}
                </Button>
              )}
            </FlaggedFeature>
            <Button
              height="28px"
              px={2}
              ml={3}
              onClick={handleRemoveLiquidityClick}
            >
              {t('poolTokens.actions.removeLiquidity')}
            </Button>
          </Flex>
        </ExpandableCell>
      )}
      <LiquidityModals
        pool={token.id}
        openModal={liquidityModalOpen}
        onClose={handleLiquidityModalClose}
        reload={reload}
      />
    </HighlightableTableRow>
  )
}

export default PoolTokensRow
