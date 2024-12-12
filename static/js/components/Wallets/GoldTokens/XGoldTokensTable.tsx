import { useTotalSupplyOf } from '@swarm/core/observables/totalSupplyOf'
import { useExchangeRates } from '@swarm/core/services/exchange-rates'
import { prettifyBalance } from '@swarm/core/shared/utils'
import { balanceLoading } from '@swarm/core/shared/utils/tokens'
import { useAccount } from '@swarm/core/web3'
import Collapsible from '@swarm/ui/presentational/Collapsible'
import { HighlightProvider } from '@swarm/ui/presentational/HighlightProvider'
import StyledTable from '@swarm/ui/presentational/StyledTable'
import TableInfoRow from '@swarm/ui/presentational/Table/TableInfoRow'
import TokenInfoPopup, {
  PopupDataBox,
  PopupDataRow,
} from '@swarm/ui/swarm/Popups/TokenInfoPopup'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Flex, Text } from 'rimble-ui'

import TradeRouterLink from './TradeRouterLink'
import { useXGoldContext } from './XGoldContext'
import XGoldInfoPopupDisclamer from './XGoldInfoPopupDisclamer'
import XGoldTokensHead from './XGoldTokensHead'
import XGoldTokensRow from './XGoldTokensRow'
import { groupGoldNfts } from './utils'

const XGoldTokensTable = () => {
  const { t } = useTranslation('wallets')
  const account = useAccount()

  const {
    xGold,
    loading: goldContextLoading,
    error,
    goldNftsInBundle,
    goldKgAddress,
    goldOzAddress,
    openWithdrawModal,
    openAddToBandleModal,
  } = useXGoldContext()
  const totalSupply = useTotalSupplyOf(xGold?.id)

  const { goldKgNfts, goldOzNfts } = useMemo(
    () => groupGoldNfts(goldNftsInBundle, goldKgAddress, goldOzAddress),
    [goldNftsInBundle, goldKgAddress, goldOzAddress],
  )
  const exchangeRates = useExchangeRates([
    ...(goldKgAddress && goldOzAddress ? [goldKgAddress, goldOzAddress] : []),
  ])
  const goldOzUcd = goldOzAddress && exchangeRates[goldOzAddress]

  const [isInfoOpen, setIsInfoOpen] = useState(false)

  const noResults = !xGold
  const disconnected = !account
  const hasError = !!error
  const isBalanceLoading = !!xGold && balanceLoading(xGold)

  const loading = goldContextLoading || isBalanceLoading

  const marketCap =
    goldOzUcd && goldOzUcd.exchangeRate && totalSupply
      ? totalSupply.mul(goldOzUcd.exchangeRate)
      : 0

  const handleRowClick = () => setIsInfoOpen(true)

  return (
    <>
      <StyledTable>
        <XGoldTokensHead />
        <tbody>
          <TableInfoRow
            show={!loading && noResults}
            loading={loading}
            error={
              (disconnected && t('queryStatuses.noAccount')) ||
              (hasError && t('queryStatuses.error'))
            }
          >
            <Flex>
              <Text.span>{t('goldTokens.bundles.noBundles')}</Text.span>
            </Flex>
          </TableInfoRow>
          <HighlightProvider>
            {!loading && xGold && (
              <XGoldTokensRow
                token={xGold}
                rowIndex={0}
                onClick={handleRowClick}
              />
            )}
          </HighlightProvider>
        </tbody>
      </StyledTable>
      {xGold && (
        <TokenInfoPopup
          isOpen={isInfoOpen}
          onClose={() => setIsInfoOpen(false)}
          token={xGold}
          kya={xGold.kya}
          topAdornment={<XGoldInfoPopupDisclamer />}
        >
          <Flex justifyContent="center" mt="18px">
            {goldOzUcd && (
              <Text.span color="text" fontWeight="bold" fontSize="18px">
                ${goldOzUcd.exchangeRate}
              </Text.span>
            )}
          </Flex>
          <Flex justifyContent="flex-end" mt="8px">
            <TradeRouterLink>
              <Button height="28px" px={2}>
                <Text.span fontWeight={3} lineHeight="20px" fontSize={1}>
                  {t('goldTokens.bundles.actions.trade')}
                </Text.span>
              </Button>
            </TradeRouterLink>
            <Button height="28px" px={2} ml={3} onClick={openAddToBandleModal}>
              <Text.span fontWeight={3} lineHeight="20px" fontSize={1}>
                {t('goldTokens.nfts.actions.add')}
              </Text.span>
            </Button>
            <Button onClick={openWithdrawModal} height="28px" px={2} ml={3}>
              <Text.span fontWeight={3} lineHeight="20px" fontSize={1}>
                {t('goldTokens.bundles.actions.withdraw')}
              </Text.span>
            </Button>
          </Flex>
          <Collapsible
            title={t('goldTokens.bundles.bundleDetails')}
            dividerThickness={2}
            mt={3}
            defaultExpanded={true}
          >
            <PopupDataBox>
              <PopupDataRow
                key="totalSupply"
                label={t('goldTokens.bundles.totalSupply')}
                value={`${prettifyBalance(totalSupply || 0)} ${xGold.symbol}`}
              />
              <PopupDataRow
                key="marketCap"
                label={t('goldTokens.bundles.marketCap')}
                value={`${prettifyBalance(marketCap)} USD`}
              />
            </PopupDataBox>
          </Collapsible>
          <Collapsible
            title={t('goldTokens.bundles.bundledAssets')}
            dividerThickness={2}
            mt={3}
            defaultExpanded={true}
          >
            <PopupDataBox>
              <PopupDataRow
                key="goldKg"
                label={t('goldTokens.bundles.xGold1OzNfts')}
                value={goldOzNfts.length.toString()}
              />
              <PopupDataRow
                key="goldOz"
                label={t('goldTokens.bundles.xGold1KgNfts')}
                value={goldKgNfts.length.toString()}
              />
            </PopupDataBox>
          </Collapsible>
        </TokenInfoPopup>
      )}
    </>
  )
}

export default XGoldTokensTable
