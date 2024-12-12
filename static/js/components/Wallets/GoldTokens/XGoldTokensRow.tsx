import { prettifyBalance } from '@swarm/core/shared/utils'
import { ZERO } from '@swarm/core/shared/utils/helpers'
import { AlchemyToken } from '@swarm/types/tokens'
import { useHighLight } from '@swarm/ui/presentational/HighlightProvider'
import ExpandableCell from '@swarm/ui/presentational/Table/ExpandableCell'
import HighlightableTableRow from '@swarm/ui/presentational/Table/HighlitableTableRow'
import TokenIcon from '@swarm/ui/swarm/TokenIcon'
import { MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { generatePath, Link as RouterLink } from 'react-router-dom'
import { Box, Button, Flex, Text } from 'rimble-ui'

import { ROUTES } from 'src/routes'

import TradeRouterLink from './TradeRouterLink'
import { useXGoldContext } from './XGoldContext'

interface XGoldTokensRowProps {
  token: AlchemyToken
  rowIndex: number
  onClick?: (e: MouseEvent<HTMLDivElement>) => void
}

const XGoldTokensRow = ({ token, rowIndex, onClick }: XGoldTokensRowProps) => {
  const { t } = useTranslation('wallets', { keyPrefix: 'goldTokens' })
  const { highlighted } = useHighLight(rowIndex)
  const { openWithdrawModal, xGoldOffersInDotc } = useXGoldContext()

  const inDotcAmount = xGoldOffersInDotc.reduce(
    (sum, offer) => sum.plus(offer.amountIn),
    ZERO,
  )

  const hasBalance = token.balance && token.balance.gt(0)
  const prettifiedBalance = token.balance && prettifyBalance(token.balance)
  const prettifiedInDotcAmount = prettifyBalance(inDotcAmount)

  const getActions = () => {
    if (!hasBalance) {
      return (
        <RouterLink
          to={generatePath(ROUTES.DOTC_CATEGORY, { category: 'gold' })}
          style={{ textDecoration: 'none' }}
        >
          <Button height="28px" px={2}>
            <Text.span fontWeight={3} lineHeight="20px" fontSize={1}>
              {t('bundles.actions.get', { symbol: token.symbol })}
            </Text.span>
          </Button>
        </RouterLink>
      )
    }

    return (
      <>
        <TradeRouterLink>
          <Button height="28px" px={2}>
            <Text.span fontWeight={3} lineHeight="20px" fontSize={1}>
              {t('bundles.actions.trade')}
            </Text.span>
          </Button>
        </TradeRouterLink>
        <Button
          onClick={(e: MouseEvent<HTMLDivElement>) => {
            e.stopPropagation()
            openWithdrawModal()
          }}
          height="28px"
          px={2}
          ml={3}
        >
          <Text.span fontWeight={3} lineHeight="20px" fontSize={1}>
            {t('bundles.actions.withdraw')}
          </Text.span>
        </Button>
      </>
    )
  }

  return (
    <HighlightableTableRow rowIndex={rowIndex} onClick={onClick}>
      <td>
        <Flex ml={2} alignItems="center">
          <TokenIcon
            symbol={token.symbol}
            name={token.name}
            width="32px"
            height="32px"
            mr="10px"
          />
          <Box>
            <Text.span fontSize={2} fontWeight={5}>
              {token.symbol}
            </Text.span>
            <Text.span fontSize={2} fontWeight={2} ml="8px">
              {token.name}
            </Text.span>

            {/* <Text.span ml={1}>
              <AllowanceIndicator
                allowanceStatus={
                  !isVSMT({ id }) && isNotNativeToken({ id })
                    ? allowanceStatus
                    : AllowanceStatus.NOT_AVAILABLE
                }
              />
            </Text.span>

            {highlighted && !isNative && (
              <AddToMetaMask token={tokenToRender} ml={4} />
            )} */}
          </Box>
        </Flex>
      </td>
      <td>
        <Flex ml={2} justifyContent="flex-end">
          <Text.span>{prettifiedBalance}</Text.span>
        </Flex>
      </td>
      <td>
        <Flex ml={2} justifyContent="flex-end">
          <Text.span>{prettifiedInDotcAmount}</Text.span>
        </Flex>
      </td>
      <ExpandableCell hide={!highlighted}>
        <Flex justifyContent="flex-end">{getActions()}</Flex>
      </ExpandableCell>
    </HighlightableTableRow>
  )
}

export default XGoldTokensRow
