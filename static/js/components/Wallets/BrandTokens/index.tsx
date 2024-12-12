import { ExpandMore } from '@rimble/icons'
import config from '@swarm/core/config'
import useUserAccount from '@swarm/core/hooks/data/useUserAccount'
import { balancesLoading } from '@swarm/core/shared/utils/tokens/balance'
import { useAccount, useNetwork, useReadyState } from '@swarm/core/web3'
import { HighlightProvider } from '@swarm/ui/presentational/HighlightProvider'
import InfoLink from '@swarm/ui/presentational/InfoLink'
import Section from '@swarm/ui/presentational/Section'
import StyledTable from '@swarm/ui/presentational/StyledTable'
import TableInfoRow from '@swarm/ui/presentational/Table/TableInfoRow'
import Tooltip from '@swarm/ui/presentational/Tooltip'
import { SyntheticEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Flex } from 'rimble-ui'
import { MarginProps } from 'styled-system'

import { getCurrentBrandName } from 'src/shared/utils/brand'

import { useWalletsContext } from '../WalletsContext'

import BrandTokenRow from './BrandTokenRow'
import BrandTokensHead from './BrandTokensHead'

const { getCrypto: getCryptoLink } = config.resources.docs.gettingStarted

const BrandTokens = (props: MarginProps) => {
  const { t } = useTranslation('wallets')
  const account = useAccount()
  const ready = useReadyState()
  const {
    selectedAccount,
    brandTokens,
    investAssetsLoading,
    investAssetsError,
  } = useWalletsContext()
  const userAccount = useUserAccount(selectedAccount)
  const { networkName } = useNetwork()
  const [amountToDisplay, setAmountToDisplay] = useState<number>(3)

  const areBalancesLoading = balancesLoading(brandTokens, account)

  const onLoadMore = (event: SyntheticEvent) => {
    event.stopPropagation()
    setAmountToDisplay((displayed) => displayed + 3)
  }

  const disconnected = !account
  const loading = investAssetsLoading || !ready || areBalancesLoading
  const hasError = !!investAssetsError
  const noResults = !hasError && !brandTokens.length

  const brandName = getCurrentBrandName()

  if (noResults) {
    return null
  }

  return (
    <Section
      title={t('brandTokens.header', {
        brand: brandName,
        network: networkName,
      })}
      {...props}
    >
      <Box mt={[3, '24px']}>
        <StyledTable>
          <BrandTokensHead />
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
                brandTokens
                  .slice(0, amountToDisplay)
                  .map((token, index) => (
                    <BrandTokenRow
                      key={token.id}
                      rowIndex={index}
                      tokenToRender={token}
                      selectedAccount={userAccount}
                    />
                  ))}
            </HighlightProvider>
          </tbody>
        </StyledTable>

        {brandTokens.length > amountToDisplay && (
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

export default BrandTokens
