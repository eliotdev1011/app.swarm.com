import { ExpandMore } from '@rimble/icons'
import config from '@swarm/core/config'
import useUserAccount from '@swarm/core/hooks/data/useUserAccount'
import usePopupState from '@swarm/core/hooks/state/usePopupState'
import { useToggle } from '@swarm/core/hooks/state/useToggle'
import { compareTokensBy } from '@swarm/core/shared/utils/filters'
import { balancesLoading } from '@swarm/core/shared/utils/tokens/balance'
import { useAccount, useNetwork, useReadyState } from '@swarm/core/web3'
import { WalletBond, WalletStockToken } from '@swarm/types/tokens'
import { HighlightProvider } from '@swarm/ui/presentational/HighlightProvider'
import InfoLink from '@swarm/ui/presentational/InfoLink'
import Section from '@swarm/ui/presentational/Section'
import StyledTable from '@swarm/ui/presentational/StyledTable'
import TableInfoRow from '@swarm/ui/presentational/Table/TableInfoRow'
import Tooltip from '@swarm/ui/presentational/Tooltip'
import TokenInfoPopup from '@swarm/ui/swarm/Popups/TokenInfoPopup'
import { SyntheticEvent, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Flex, Text } from 'rimble-ui'
import { MarginProps } from 'styled-system'

import StockTokenRedeemModal, {
  StockTokenRedeemModalProps,
} from 'src/components/Invest/StockTokens/StockTokenRedeemModal'

import { useWalletsContext } from '../WalletsContext'

import BondRow from './BondRow'
import BondsHead from './BondsHead'

const { getCrypto: getCryptoLink } = config.resources.docs.gettingStarted

const Bonds = (props: MarginProps) => {
  const { t } = useTranslation('wallets')
  const account = useAccount()
  const ready = useReadyState()
  const { selectedAccount, bonds, investAssetsLoading, investAssetsError } =
    useWalletsContext()
  const userAccount = useUserAccount(selectedAccount)
  const { networkName } = useNetwork()
  const [amountToDisplay, setAmountToDisplay] = useState<number>(3)
  const [stockTokenInfo, setStockTokenInfo] = useState<WalletBond | null>(null)
  const {
    isOn: bondTokenInfoIsOpen,
    on: openBondTokenInfo,
    off: closeBondTokenInfo,
  } = useToggle()

  const redeemModal = usePopupState<StockTokenRedeemModalProps>(
    false,
    StockTokenRedeemModal,
  )

  const areBalancesLoading = balancesLoading(bonds, account)

  const onLoadMore = (event: SyntheticEvent) => {
    event.stopPropagation()
    setAmountToDisplay((displayed) => displayed + 3)
  }

  const disconnected = !account
  const loading = investAssetsLoading || !ready || areBalancesLoading
  const hasError = !!investAssetsError
  const noResults = !hasError && !bonds.length

  const sortedBonds = useMemo(
    () =>
      [...bonds].sort(
        compareTokensBy(['fullUsdBalance', 'desc'], 'symbol', 'name'),
      ),
    [bonds],
  )

  const handleOnRedeemClick = useCallback(
    (asset: WalletStockToken) => redeemModal.open({ asset }),
    [redeemModal],
  )

  const handleBondRowClick = (asset: WalletBond) => {
    setStockTokenInfo(asset)
    openBondTokenInfo()
  }

  if (noResults) {
    return null
  }

  return (
    <Section title={t('bonds.header', { network: networkName })} {...props}>
      <Box mt={[3, '24px']}>
        <StyledTable>
          <BondsHead />
          <tbody>
            <TableInfoRow
              span={5}
              show={!loading && noResults}
              loading={loading && noResults}
              error={
                (disconnected && t('queryStatuses.noAccount')) ||
                (hasError && t('queryStatuses.error'))
              }
            >
              {t('queryStatuses.noResults')}
              <InfoLink
                href={getCryptoLink}
                title={t('queryStatuses.getCrypto')}
              >
                {t('queryStatuses.getCrypto')}
              </InfoLink>
            </TableInfoRow>
            <HighlightProvider>
              {!disconnected &&
                sortedBonds
                  .slice(0, amountToDisplay)
                  .map((token, index) => (
                    <BondRow
                      key={token.id}
                      rowIndex={index}
                      tokenToRender={token}
                      selectedAccount={userAccount}
                      onClick={() => handleBondRowClick(token)}
                      onRedeemClick={handleOnRedeemClick}
                    />
                  ))}
            </HighlightProvider>
          </tbody>
        </StyledTable>

        {bonds.length > amountToDisplay && (
          <Flex alignItems="center" justifyContent="center" mt={3}>
            <Tooltip placement="top" message="Load more">
              <ExpandMore
                onClick={onLoadMore}
                cursor="pointer"
                color="near-black"
              />
            </Tooltip>
          </Flex>
        )}
      </Box>
      {redeemModal.modal}
      <TokenInfoPopup
        isOpen={bondTokenInfoIsOpen}
        onClose={closeBondTokenInfo}
        token={stockTokenInfo}
        kya={stockTokenInfo?.kya}
      >
        <Flex justifyContent="center" mt="18px">
          {stockTokenInfo && (
            <Text.span color="text" fontWeight="bold" fontSize="18px">
              ${stockTokenInfo.exchangeRate}
            </Text.span>
          )}
        </Flex>
      </TokenInfoPopup>
    </Section>
  )
}

export default Bonds
