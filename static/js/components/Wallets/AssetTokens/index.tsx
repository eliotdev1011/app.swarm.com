import { ExpandMore } from '@rimble/icons'
import config from '@swarm/core/config'
import useUserAccount from '@swarm/core/hooks/data/useUserAccount'
import { prettifyBalance } from '@swarm/core/shared/utils/formatting'
import { balancesLoading } from '@swarm/core/shared/utils/tokens/balance'
import {
  isSameEthereumAddress,
  useAccount,
  useNetwork,
  useReadyState,
} from '@swarm/core/web3'
import { HighlightProvider } from '@swarm/ui/presentational/HighlightProvider'
import InfoLink from '@swarm/ui/presentational/InfoLink'
import Section from '@swarm/ui/presentational/Section'
import StyledTable from '@swarm/ui/presentational/StyledTable'
import TableInfoRow from '@swarm/ui/presentational/Table/TableInfoRow'
import Tooltip from '@swarm/ui/presentational/Tooltip'
import { SyntheticEvent, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Flex, Text } from 'rimble-ui'
import { MarginProps } from 'styled-system'

import { useWalletsContext } from 'src/components/Wallets/WalletsContext'

import AssetTokensHead from './AssetTokensHead'
import AssetTokenRow from './AssetTokensRow'
import { getSortedFilteredAssetTokens } from './helpers'

const { getCrypto: getCryptoLink } = config.resources.docs.gettingStarted

const AssetTokens = (props: MarginProps) => {
  const {
    selectedAccount,
    userUsdBalance,
    hideSmallBalances,
    assetTokens,
    assetTokensLoading,
    assetTokensError,
  } = useWalletsContext()
  const { t } = useTranslation('wallets')
  const account = useAccount()
  const ready = useReadyState()
  const userAccount = useUserAccount(selectedAccount)
  const { networkName } = useNetwork()

  const [amountToDisplay, setAmountToDisplay] = useState<number>(3)

  const areBalancesLoading = balancesLoading(assetTokens, account)

  const positiveTokens = useMemo(
    () => getSortedFilteredAssetTokens(assetTokens, hideSmallBalances),
    [assetTokens, hideSmallBalances],
  )

  const onLoadMore = (event: SyntheticEvent) => {
    event.stopPropagation()
    setAmountToDisplay((displayed) => displayed + 3)
  }

  const disconnected = !account
  const loading = assetTokensLoading || !ready || areBalancesLoading
  const hasError = !!assetTokensError.length
  const noResults = !hasError && !positiveTokens.length

  return (
    <Section
      title={t('assetTokens.header', { network: networkName })}
      badge={
        <Text
          fontWeight={5}
          color="grey"
          fontSize={2}
          display={['block', 'none']}
        >
          {prettifyBalance(userUsdBalance.nativeTokens)} USD
        </Text>
      }
      {...props}
    >
      <Box mt={[3, '24px']}>
        <StyledTable>
          <AssetTokensHead />
          <tbody>
            <TableInfoRow
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
                positiveTokens
                  .slice(0, amountToDisplay)
                  .map(({ balance, ...token }, index) => (
                    <AssetTokenRow
                      key={token.id}
                      rowIndex={index}
                      tokenToRender={token}
                      disableActions={
                        !isSameEthereumAddress(account, selectedAccount)
                      }
                      selectedAccount={userAccount}
                    />
                  ))}
            </HighlightProvider>
          </tbody>
        </StyledTable>
        {!disconnected && positiveTokens.length > amountToDisplay && (
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
    </Section>
  )
}

export default AssetTokens
