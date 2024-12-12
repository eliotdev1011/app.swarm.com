import { ExpandMore } from '@rimble/icons'
import config from '@swarm/core/config'
import useUserAccount from '@swarm/core/hooks/data/useUserAccount'
import usePopupState from '@swarm/core/hooks/state/usePopupState'
import { balancesLoading } from '@swarm/core/shared/utils/tokens/balance'
import { useAccount, useNetwork, useReadyState } from '@swarm/core/web3'
import { WalletStockToken } from '@swarm/types/tokens'
import { HighlightProvider } from '@swarm/ui/presentational/HighlightProvider'
import InfoLink from '@swarm/ui/presentational/InfoLink'
import Section from '@swarm/ui/presentational/Section'
import StyledTable from '@swarm/ui/presentational/StyledTable'
import TableInfoRow from '@swarm/ui/presentational/Table/TableInfoRow'
import Tooltip from '@swarm/ui/presentational/Tooltip'
import { SyntheticEvent, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Flex } from 'rimble-ui'
import { MarginProps } from 'styled-system'

import StockTokenRedeemModal, {
  StockTokenRedeemModalProps,
} from 'src/components/Invest/StockTokens/StockTokenRedeemModal'

import StockTokenRow from '../StockTokens/StockTokenRow'
import StockTokensHead from '../StockTokens/StockTokensHead'
import { useWalletsContext } from '../WalletsContext'

const { getCrypto: getCryptoLink } = config.resources.docs.gettingStarted

const IndexTokens = (props: MarginProps) => {
  const { t } = useTranslation('wallets')
  const account = useAccount()
  const ready = useReadyState()
  const {
    selectedAccount,
    indexTokens,
    investAssetsLoading,
    investAssetsError,
  } = useWalletsContext()
  const userAccount = useUserAccount(selectedAccount)
  const { networkName } = useNetwork()
  const [amountToDisplay, setAmountToDisplay] = useState<number>(3)

  const redeemModal = usePopupState<StockTokenRedeemModalProps>(
    false,
    StockTokenRedeemModal,
  )

  const areBalancesLoading = balancesLoading(indexTokens, account)

  const onLoadMore = (event: SyntheticEvent) => {
    event.stopPropagation()
    setAmountToDisplay((displayed) => displayed + 3)
  }

  const disconnected = !account
  const loading = investAssetsLoading || !ready || areBalancesLoading
  const hasError = !!investAssetsError
  const noResults = !hasError && !indexTokens.length

  const handleOnRedeemClick = useCallback(
    (asset: WalletStockToken) => redeemModal.open({ asset }),
    [redeemModal],
  )

  if (noResults) {
    return null
  }

  return (
    <Section
      title={t('indexTokens.header', { network: networkName })}
      {...props}
    >
      <Box mt={[3, '24px']}>
        <StyledTable>
          <StockTokensHead />
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
                indexTokens
                  .slice(0, amountToDisplay)
                  .map((token, index) => (
                    <StockTokenRow
                      key={token.id}
                      rowIndex={index}
                      tokenToRender={token}
                      selectedAccount={userAccount}
                      onRedeemClick={handleOnRedeemClick}
                    />
                  ))}
            </HighlightProvider>
          </tbody>
        </StyledTable>

        {indexTokens.length > amountToDisplay && (
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
    </Section>
  )
}

export default IndexTokens
