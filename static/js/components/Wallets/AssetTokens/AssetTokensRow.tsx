import { ExpandLess, ExpandMore, Help } from '@rimble/icons'
import { VSMT } from '@swarm/core/contracts/VSMT'
import { AllowanceStatus } from '@swarm/core/shared/enums'
import { normalizeUSDCE } from '@swarm/core/shared/utils/tokens'
import {
  isNativeToken,
  isNotNativeToken,
  isVSMT,
} from '@swarm/core/shared/utils/tokens/filters'
import { AssetTokenActionsProps, AssetTokenRowProps } from '@swarm/types/props'
import { useHighLight } from '@swarm/ui/presentational/HighlightProvider'
import ExpandableCell from '@swarm/ui/presentational/Table/ExpandableCell'
import HighlightableTableRow from '@swarm/ui/presentational/Table/HighlitableTableRow'
import Tooltip from '@swarm/ui/presentational/Tooltip'
import AllowanceIndicator from '@swarm/ui/swarm/AllowanceIndicator'
import AddToMetaMask from '@swarm/ui/swarm/Buttons/AddToMetamask'
import TokenBalance from '@swarm/ui/swarm/TokenBalance'
import TokenIcon from '@swarm/ui/swarm/TokenIcon'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Flex, Text } from 'rimble-ui'

import AssetTokenActions from './AssetTokenActions'
import UnwrapVSmtButton from './UnwrapVSmtButton'

const AssetTokenRow = ({
  tokenToRender,
  rowIndex,
  disableActions = false,
  selectedAccount,
}: AssetTokenRowProps) => {
  const { t } = useTranslation('wallets')
  const { highlighted } = useHighLight(rowIndex)
  const [expanded, setExpanded] = useState(false)
  const [isPerformingAnAction, setIsPerformingAnAction] =
    useState<boolean>(false)
  const {
    name,
    symbol,
    userBalances,
    exchangeRate,
    allowanceStatus,
    cpkAllowance,
    id,
    pooledTokenBalance,
    usdPooledTokenBalance,
    ...rest
  } = normalizeUSDCE(tokenToRender)

  const handleExpand = () => {
    setExpanded((prev: boolean) => !prev)
  }

  const isNative = useMemo(() => isNativeToken({ id }), [id])

  const tokenActions: AssetTokenActionsProps = {
    allowanceStatus,
    name,
    symbol,
    ...rest,
    id,
  }

  return (
    <HighlightableTableRow rowIndex={rowIndex}>
      <td>
        <Flex ml={2} alignItems="center" onClick={handleExpand}>
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

            <Text.span ml={1}>
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
            )}
          </Box>
          <Box display={['block', 'none']}>
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
            {t('assetTokens.native')}
          </Text>
          <Tooltip placement="top" message={t('assetTokens.native')}>
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
            <TokenBalance
              tokenAddress={id}
              account={selectedAccount?.address}
              symbol={symbol}
              wrapper={Text}
              fontSize={2}
              fontWeight={2}
              color={['near-black', 'black']}
              textAlign="right"
            />
            {!isVSMT({ id }) && (
              <TokenBalance
                tokenAddress={tokenToRender?.id}
                account={selectedAccount?.address}
                symbol="USD"
                usd
                wrapper={Text}
                fontSize={[2, 0]}
                fontWeight={3}
                color="grey"
                textAlign="right"
                ml={[2, 0]}
              />
            )}
          </Flex>
        </Flex>
      </ExpandableCell>
      <ExpandableCell
        expanded={expanded}
        hide={!highlighted && !isPerformingAnAction}
      >
        <Flex alignItems="center" justifyContent={['flex-start', 'flex-end']}>
          {isVSMT({ id }) ? (
            <UnwrapVSmtButton contract={tokenToRender.contract as VSMT} />
          ) : (
            !disableActions && (
              <AssetTokenActions
                {...tokenActions}
                isPerformingAnAction={isPerformingAnAction}
                setIsPerformingAnAction={setIsPerformingAnAction}
              />
            )
          )}
        </Flex>
      </ExpandableCell>
    </HighlightableTableRow>
  )
}

export default AssetTokenRow
