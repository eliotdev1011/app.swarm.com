import { SwapsQueryResult } from '@swarm/core/hooks/pool/useSwaps'
import { useInfiniteScroll } from '@swarm/core/hooks/useInfiniteScroll'
import { useAccount, useReadyState } from '@swarm/core/web3'
import { useTranslation } from 'react-i18next'
import { Box, Card, Flex, Heading, Link, Loader, Text } from 'rimble-ui'

import { ROUTES } from 'src/routes'

import SwapRow from './SwapRow'

interface TokePairSwapsProps {
  tokenPair?: [string, string]
  swaps: SwapsQueryResult
}

const TokenPairSwaps = ({ tokenPair, swaps }: TokePairSwapsProps) => {
  const { data, loading: swapsLoading, fetchMore, hasMore } = swaps
  const { t } = useTranslation('swap')
  const account = useAccount()
  const ready = useReadyState()

  const notConnected = !account
  const noPair = !notConnected && !tokenPair
  const loading = swapsLoading || !ready
  const noResults = !noPair && data?.swaps.length === 0

  const loaderRef = useInfiniteScroll<HTMLTableRowElement>({
    hasMore,
    loadMore: fetchMore,
  })

  return (
    <>
      <Card
        mt={3}
        p={['16px', '24px']}
        borderRadius={1}
        boxShadow={4}
        border="0"
        display="flex"
        flexDirection="column"
      >
        <Flex
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Heading
            as="h3"
            fontSize={3}
            lineHeight="28px"
            fontWeight={5}
            color="grey"
            m={0}
          >
            {t('recentSwaps.header')}
          </Heading>
          <Link
            href={ROUTES.WALLETS}
            color="primary"
            hoverColor="primary-dark"
            fontSize={2}
            fontWeight={2}
            display="none"
          >
            {t('recentSwaps.viewAllTransactions')}
          </Link>
        </Flex>
        <Box mt="28px">
          {notConnected && !loading && (
            <Text.span color="grey" fontWeight={3}>
              {t('recentSwaps.notConnected')}
            </Text.span>
          )}
          {noPair && !loading && (
            <Text.span color="grey" fontWeight={3}>
              {t('recentSwaps.noTokenPair')}
            </Text.span>
          )}
          {noResults && !loading && (
            <Text.span color="grey" fontWeight={3}>
              {t('recentSwaps.noSwap')}
            </Text.span>
          )}
          {!noResults &&
            data?.swaps.map((swap) => <SwapRow swap={swap} key={swap.id} />)}
          {loading && (
            <Flex key={0}>
              <Loader mx="auto" mt={2} />
            </Flex>
          )}
          <div ref={loaderRef} />
        </Box>
      </Card>
    </>
  )
}

export default TokenPairSwaps
