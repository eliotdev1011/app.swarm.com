import { ExpandMore } from '@rimble/icons'
import { useCpk } from '@swarm/core/contracts/cpk'
import { FlaggedFeatureName } from '@swarm/core/hooks/data/useFeatureFlags'
import useUserAccount from '@swarm/core/hooks/data/useUserAccount'
import { prettifyBalance } from '@swarm/core/shared/utils/formatting'
import { recursiveRound } from '@swarm/core/shared/utils/math'
import { useAccount, useNetwork, useReadyState } from '@swarm/core/web3'
import { HighlightProvider } from '@swarm/ui/presentational/HighlightProvider'
import InfoLink from '@swarm/ui/presentational/InfoLink'
import Section from '@swarm/ui/presentational/Section'
import StyledTable from '@swarm/ui/presentational/StyledTable'
import TableInfoRow from '@swarm/ui/presentational/Table/TableInfoRow'
import Tooltip from '@swarm/ui/presentational/Tooltip'
import FlaggedFeature from '@swarm/ui/swarm/FlaggedFeature'
import { SyntheticEvent, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Flex, Text } from 'rimble-ui'
import { MarginProps } from 'styled-system'

import { useWalletsContext } from 'src/components/Wallets/WalletsContext'
import usePoolTokens from 'src/hooks/pool/usePoolTokens'
import { ROUTES } from 'src/routes'

import PoolTokensHead from './PoolTokensHead'
import PoolTokensRow from './PoolTokensRow'

const PoolTokens = (props: MarginProps) => {
  const { selectedAccount, userUsdBalance, setPoolTokensBalance } =
    useWalletsContext()
  const { t } = useTranslation('wallets')
  const account = useAccount()
  const cpk = useCpk()
  const ready = useReadyState()
  const userAccount = useUserAccount(selectedAccount)
  const { networkName } = useNetwork()

  const {
    allTokens: allPoolTokens,
    errors,
    loading: queryLoading,
    refetch,
  } = usePoolTokens({
    cpkAddress: userAccount?.cpkAddress,
  })

  const [amountToDisplay, setAmountToDisplay] = useState<number>(3)

  const loading = useMemo<boolean>(
    () => queryLoading || (!!account && !cpk?.address),
    [account, queryLoading, cpk?.address],
  )

  const balancesLoading = allPoolTokens.some(
    (token) => token.userBalances.loading,
  )

  const positivePoolTokens = useMemo(
    () =>
      allPoolTokens
        .filter(({ userBalances }) => userBalances.ether)
        .sort((a, b) => b.userBalances.usd - a.userBalances.usd),
    [allPoolTokens],
  )

  useEffect(() => {
    const rawTotal = positivePoolTokens.reduce(
      (total, { userBalances }) => total + userBalances.usd,
      0,
    )
    setPoolTokensBalance(recursiveRound<number>(rawTotal))
  }, [positivePoolTokens, setPoolTokensBalance])

  const onLoadMore = (event: SyntheticEvent) => {
    event.stopPropagation()
    setAmountToDisplay((displayed) => displayed + 3)
  }

  const disconnected = !account
  const dataLoading = !ready || loading || balancesLoading
  const hasError = !!errors.length
  const noResults = !hasError && !positivePoolTokens.length

  return (
    <Section
      title={t('poolTokens.header', { network: networkName })}
      badge={
        <Text
          fontWeight={5}
          color="grey"
          fontSize={2}
          display={['block', 'none']}
        >
          {prettifyBalance(userUsdBalance.poolTokens)} USD
        </Text>
      }
      {...props}
    >
      <Box mt={[3, '24px']}>
        <StyledTable>
          <PoolTokensHead />
          <tbody>
            <TableInfoRow
              show={!dataLoading && noResults}
              loading={dataLoading && noResults}
              error={
                (disconnected && t('queryStatuses.noAccount')) ||
                (hasError && t('queryStatuses.error'))
              }
            >
              <>
                {t('poolTokens.noPools')}
                <FlaggedFeature name={FlaggedFeatureName.addLiqudity}>
                  <InfoLink
                    internal
                    href={ROUTES.POOLS}
                    title={t('poolTokens.actions.addLiquidity')}
                    target="_self"
                  >
                    {t('poolTokens.actions.addLiquidity')}
                  </InfoLink>
                  {t('poolTokens.getStarted')}
                </FlaggedFeature>
              </>
            </TableInfoRow>
            <HighlightProvider>
              {positivePoolTokens
                .slice(0, amountToDisplay)
                .map((token, index) => (
                  <PoolTokensRow
                    key={token.id}
                    tokenToRender={token}
                    rowIndex={index}
                    reload={refetch}
                  />
                ))}
            </HighlightProvider>
          </tbody>
        </StyledTable>
        {positivePoolTokens.length > amountToDisplay && (
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

export default PoolTokens
