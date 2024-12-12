/* eslint-disable camelcase */
import { useAccount } from '@swarm/core/web3'
import { HighlightProvider } from '@swarm/ui/presentational/HighlightProvider'
import StyledTable from '@swarm/ui/presentational/StyledTable'
import TableInfoRow from '@swarm/ui/presentational/Table/TableInfoRow'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, Text } from 'rimble-ui'

import { useXGoldContext } from './XGoldContext'
import XGoldNftsHead from './XGoldNftsHead'
import XGoldNftsRow from './XGoldNftsRow'
import { groupGoldNfts } from './utils'

const XGoldTokensTable = () => {
  const { t } = useTranslation('wallets')
  const account = useAccount()

  const {
    goldNfts,
    goldKgAddress,
    goldOzAddress,
    goldKgOffersInDotc,
    goldOzOffersInDotc,
    loading: contextLoading,
    error,
    xGoldKg,
    xGoldOz,
  } = useXGoldContext()

  const { goldKgNfts, goldOzNfts } = useMemo(
    () => groupGoldNfts(goldNfts, goldKgAddress, goldOzAddress),
    [goldKgAddress, goldNfts, goldOzAddress],
  )

  const disconnected = !account
  const hasError = !!error
  const loading = contextLoading

  return (
    <StyledTable>
      <XGoldNftsHead />
      <tbody>
        <TableInfoRow
          show={loading}
          loading={loading}
          error={
            (disconnected && t('queryStatuses.noAccount')) ||
            (hasError && t('queryStatuses.error'))
          }
        >
          <Flex>
            <Text.span>{t('goldTokens.nfts.noNfts')}</Text.span>
          </Flex>
        </TableInfoRow>
        <HighlightProvider>
          {xGoldKg && (
            <XGoldNftsRow
              name={xGoldKg.name}
              symbol={xGoldKg.symbol}
              nfts={goldKgNfts}
              rowIndex={0}
              inDotcCount={goldKgOffersInDotc.length}
            />
          )}
          {xGoldOz && (
            <XGoldNftsRow
              name={xGoldOz.name}
              symbol={xGoldOz.symbol}
              nfts={goldOzNfts}
              rowIndex={1}
              inDotcCount={goldOzOffersInDotc.length}
            />
          )}
        </HighlightProvider>
      </tbody>
    </StyledTable>
  )
}

export default XGoldTokensTable
