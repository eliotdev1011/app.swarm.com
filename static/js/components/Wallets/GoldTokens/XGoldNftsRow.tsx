import { AbstractAsset } from '@swarm/types/tokens'
import { useHighLight } from '@swarm/ui/presentational/HighlightProvider'
import ExpandableCell from '@swarm/ui/presentational/Table/ExpandableCell'
import HighlightableTableRow from '@swarm/ui/presentational/Table/HighlitableTableRow'
import TokenIcon from '@swarm/ui/swarm/TokenIcon'
import { useTranslation } from 'react-i18next'
import { generatePath, Link as RouterLink } from 'react-router-dom'
import { Box, Button, Flex, Text } from 'rimble-ui'

import { ROUTES } from 'src/routes'

import { useXGoldContext } from './XGoldContext'

interface XGoldNftsRowProps {
  nfts: AbstractAsset[]
  rowIndex: number
  inDotcCount: number
  name: string
  symbol: string
}

const XGoldNftsRow = ({
  nfts,
  name,
  symbol,
  rowIndex,
  inDotcCount,
}: XGoldNftsRowProps) => {
  const { t } = useTranslation('wallets', { keyPrefix: 'goldTokens' })
  const { openAddToBandleModal } = useXGoldContext()
  const { highlighted } = useHighLight(rowIndex)

  const hasNfts = !!nfts.length

  const handleAddToBandle = () => {
    openAddToBandleModal()
  }

  const getActions = () => {
    if (!hasNfts) {
      return (
        <RouterLink
          to={generatePath(ROUTES.DOTC_CATEGORY, { category: 'gold' })}
          style={{ textDecoration: 'none' }}
        >
          <Button height="28px" px={2}>
            <Text.span fontWeight={3} lineHeight="20px" fontSize={1}>
              {t('nfts.actions.get')}
            </Text.span>
          </Button>
        </RouterLink>
      )
    }

    return (
      <>
        <RouterLink
          to={generatePath(ROUTES.DOTC_CATEGORY, { category: 'gold' })}
          style={{ textDecoration: 'none' }}
        >
          <Button height="28px" px={2}>
            <Text.span fontWeight={3} lineHeight="20px" fontSize={1}>
              {t('nfts.actions.trade')}
            </Text.span>
          </Button>
        </RouterLink>
        <Button height="28px" px={2} ml={3} onClick={handleAddToBandle}>
          <Text.span fontWeight={3} lineHeight="20px" fontSize={1}>
            {t('nfts.actions.add')}
          </Text.span>
        </Button>
        <Button height="28px" px={2} ml={3} disabled>
          <Text.span fontWeight={3} lineHeight="20px" fontSize={1}>
            {t('nfts.actions.delivery')}
          </Text.span>
        </Button>
      </>
    )
  }

  return (
    <HighlightableTableRow rowIndex={rowIndex}>
      <td>
        <Flex ml={2} alignItems="center">
          <TokenIcon
            symbol={symbol}
            name={name}
            width="32px"
            height="32px"
            mr="10px"
          />
          <Box flexGrow="1">
            <Text.span fontSize={2} fontWeight={5}>
              {symbol}
            </Text.span>
            <Text.span fontSize={2} fontWeight={2} ml="8px">
              {name}
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
        <Flex justifyContent="flex-end">
          <Text.span>
            {nfts.length} {symbol}
          </Text.span>
        </Flex>
      </td>
      <td>
        <Flex justifyContent="flex-end">
          <Text.span>
            {inDotcCount} {symbol}
          </Text.span>
        </Flex>
      </td>
      <ExpandableCell hide={!highlighted}>
        <Flex justifyContent="flex-end">{getActions()}</Flex>
      </ExpandableCell>
    </HighlightableTableRow>
  )
}

export default XGoldNftsRow
