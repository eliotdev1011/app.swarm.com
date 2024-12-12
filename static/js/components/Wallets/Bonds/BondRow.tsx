import { ExpandLess, ExpandMore, Help } from '@rimble/icons'
import useFeatureFlags, {
  FlaggedFeatureName,
} from '@swarm/core/hooks/data/useFeatureFlags'
import { isETH2sn } from '@swarm/core/shared/utils'
import { AssetTokenActionsProps } from '@swarm/types/props'
import { UserAccount } from '@swarm/types/state/user-account'
import { WalletBond } from '@swarm/types/tokens'
import { useHighLight } from '@swarm/ui/presentational/HighlightProvider'
import ExpandableCell from '@swarm/ui/presentational/Table/ExpandableCell'
import HighlitableTableRow from '@swarm/ui/presentational/Table/HighlitableTableRow'
import Tooltip from '@swarm/ui/presentational/Tooltip'
import AllowanceIndicator from '@swarm/ui/swarm/AllowanceIndicator'
import AddToMetaMask from '@swarm/ui/swarm/Buttons/AddToMetamask'
import SvgIcon from '@swarm/ui/swarm/SvgIcon'
import TokenBalance from '@swarm/ui/swarm/TokenBalance'
import TokenIcon from '@swarm/ui/swarm/TokenIcon'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Flex, Text } from 'rimble-ui'

import BondsActions from './BondsActions'

interface BondRowProps {
  tokenToRender: WalletBond
  rowIndex: number
  disableActions?: boolean
  selectedAccount?: UserAccount | null
  onRedeemClick?: (token: WalletBond) => void
  onClick?: () => void
}

// TODO: Refactor this component and check if netApy is available. Now it's missed in token entity.

const BondRow = ({
  tokenToRender,
  rowIndex,
  disableActions = false,
  selectedAccount,
  onRedeemClick,
  onClick,
}: BondRowProps) => {
  const { checkFeature } = useFeatureFlags()
  const { t } = useTranslation('wallets')
  const { highlighted } = useHighLight(rowIndex)
  const [expanded, setExpanded] = useState(false)
  const [isPerformingAnAction, setIsPerformingAnAction] =
    useState<boolean>(false)

  const {
    name,
    symbol,
    balance,
    userBalances,
    xToken,
    exchangeRate,
    allowanceStatus,
    cpkAllowance,
    id,
    pooledTokenBalance,
    usdPooledTokenBalance,
    kyaInformation,
    ...rest
  } = tokenToRender

  const handleExpand = () => {
    setExpanded((prev: boolean) => !prev)
  }

  const tokenActions: AssetTokenActionsProps = {
    allowanceStatus,
    name,
    symbol,
    ...rest,
    id,
  }

  const handleOnRedeemClick = useCallback(
    () => onRedeemClick?.(tokenToRender),
    [onRedeemClick, tokenToRender],
  )

  return (
    <HighlitableTableRow rowIndex={rowIndex} onClick={onClick}>
      <td>
        <Flex ml={2} alignItems="center" onClick={handleExpand}>
          {kyaInformation?.image ? (
            <SvgIcon
              name={kyaInformation?.image}
              width="32px"
              height="32px"
              title={name}
              external
            />
          ) : (
            <TokenIcon symbol={symbol} name={name} width="32px" height="32px" />
          )}
          <Box flexGrow="1" ml="10px">
            <Text.span fontSize={2} fontWeight={5}>
              {symbol}
            </Text.span>
            <Text.span fontSize={2} fontWeight={2} ml="8px">
              {name}
            </Text.span>
            <Text.span ml={1}>
              <AllowanceIndicator allowanceStatus={allowanceStatus} />
            </Text.span>

            {highlighted && <AddToMetaMask token={tokenToRender} ml={3} />}
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
            {t('bonds.native')}
          </Text>
          <Tooltip placement="top" message={t('bonds.native')}>
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
          </Flex>
        </Flex>
      </ExpandableCell>

      <ExpandableCell
        expanded={expanded}
        hide={!highlighted && !isPerformingAnAction}
      >
        <Flex alignItems="center" justifyContent={['flex-start', 'flex-end']}>
          {!disableActions && (
            <BondsActions
              {...tokenActions}
              onRedeemClick={handleOnRedeemClick}
              isPerformingAnAction={isPerformingAnAction}
              setIsPerformingAnAction={setIsPerformingAnAction}
              isRedeemDisabled={
                balance === undefined ||
                (!checkFeature(FlaggedFeatureName.eth2snRedeem) &&
                  isETH2sn(tokenToRender))
              }
            />
          )}
        </Flex>
      </ExpandableCell>
    </HighlitableTableRow>
  )
}

export default BondRow
