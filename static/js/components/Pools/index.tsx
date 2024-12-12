import config from '@swarm/core/config'
import { useCpk } from '@swarm/core/contracts/cpk'
import useFeatureFlags, {
  FlaggedFeatureName,
} from '@swarm/core/hooks/data/useFeatureFlags'
import useDeepMemo from '@swarm/core/hooks/memo/useDeepMemo'
import { useAccount, useNetwork } from '@swarm/core/web3'
import { PoolExpanded } from '@swarm/types'
import InfiniteTable from '@swarm/ui/presentational/InfiniteTable'
import AlertPanel from '@swarm/ui/swarm/AlertPanel'
import { getUnixTime, startOfDay, subDays } from 'date-fns/esm'
import map from 'lodash/map'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import { Box, Card, Heading, Text } from 'rimble-ui'
import styled from 'styled-components/macro'
import { StringParam, useQueryParam } from 'use-query-params'

import usePools from 'src/hooks/pool/usePools'
import { createPoolsFilter } from 'src/shared/utils/filters'

import AssetFilter from './AssetFilter'
import PoolRow from './PoolRow'
import { AssetParam, PageLimit, PoolCategory } from './consts'
import { getAssetFilter, getCategoryFilter } from './helpers'
import usePoolTokens from './usePoolTokens'

const { matchNetworkSupportsSmartPools } = config

const StyledInfiniteTable = styled(InfiniteTable)`
  col {
    width: 10%;
  }

  colgroup.assets {
    col {
      &:first-child {
        width: 68px;
      }
      &:nth-child(2) {
        width: 30%;
      }
    }
  }

  th,
  td {
    &:nth-last-child(-n + 4) {
      text-align: right;
    }
    min-width: 90px;
    white-space: nowrap;
  }

  td {
    color: ${(props) => props.theme.colors['near-black']};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints?.[2]}) {
    col {
      width: 0;
    }

    colgroup.assets {
      col {
        &:first-child {
          width: 68px;
        }
        &:nth-child(2) {
          width: auto;
        }
      }
    }

    col.market-cap {
      width: 100px;
    }
  }
`

const Pools = () => {
  const { t } = useTranslation('pools')
  const { ifFeature } = useFeatureFlags()
  const { networkId, networkName } = useNetwork()
  const { current: currentTimestamp } = useRef(
    getUnixTime(subDays(startOfDay(Date.now()), 1)),
  )
  const { category = 'all' } = useParams<{
    category?: PoolCategory
  }>()

  const networkSupportsSmartPools = matchNetworkSupportsSmartPools(networkId)

  const account = useAccount()
  const cpk = useCpk()

  const { tokens: poolTokens, loading: poolTokensLoading } = usePoolTokens()
  const [filterCategory, setFilterCategory] = useQueryParam(
    'category',
    StringParam,
  )

  const [assetsParam, setAssetsParam] = useQueryParam('assets', AssetParam)

  const assetFilter = useMemo(
    () => getAssetFilter(poolTokens, assetsParam),
    [poolTokens, assetsParam],
  )

  const currentCategory = useMemo<PoolCategory>(() => {
    if (filterCategory === null || filterCategory === undefined) {
      return category
    }
    return filterCategory as PoolCategory
  }, [filterCategory, category])

  const filter = useDeepMemo(
    () => ({
      ...createPoolsFilter(),
      ...getCategoryFilter(
        currentCategory,
        account,
        networkSupportsSmartPools &&
          ifFeature(FlaggedFeatureName.smartPools, true, false),
      ),
      ...(assetFilter.length > 0 && {
        // eslint-disable-next-line camelcase
        tokensList_contains: map(assetFilter, 'xToken.address') as string[],
      }),
    }),
    [
      assetFilter,
      ifFeature,
      currentCategory,
      cpk?.address,
      networkSupportsSmartPools,
    ],
  )

  const [hasMore, setHasMore] = useState(true)

  const { pools, called, loadingPools, refetch, fetchMore, refetching } =
    usePools({
      variables: {
        filter,
        currentTimestamp,
      },
      skip: poolTokensLoading,
    })

  const loading = loadingPools || (!poolTokens.length && poolTokensLoading)

  const canRefetch = called && !poolTokensLoading && cpk === null

  useEffect(() => {
    let isNotCancelled = true

    if (canRefetch) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      refetch(filter).then(({ data: { pools: refetchedPools } }) => {
        if (isNotCancelled) {
          setHasMore(refetchedPools?.length === PageLimit)
        }
      })
    }

    return () => {
      isNotCancelled = false
    }
  }, [called, canRefetch, filter, loading, refetch])

  const loadMore = useCallback(async () => {
    if (pools && hasMore && !loading && !poolTokensLoading) {
      const {
        data: { pools: fetchedPools },
      } = await fetchMore(pools.length, PageLimit)
      setHasMore(fetchedPools.length === PageLimit)
    }
  }, [fetchMore, hasMore, loading, poolTokensLoading, pools])

  const sortedPools: PoolExpanded[] = useMemo(
    () => pools.sort((a, b) => b.marketCap - a.marketCap),
    [pools],
  )

  return (
    <Box
      width="100%"
      bg="background"
      display="flex"
      flexDirection="column"
      p={[3, 3, 4]}
      flexGrow={1}
    >
      <AlertPanel />
      <Card
        width="100%"
        p={4}
        borderRadius={1}
        overflow="hidden"
        display="flex"
        flexDirection="column"
        justifyContent="stretch"
      >
        <Heading
          as="h3"
          mt={0}
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          flexWrap="wrap"
        >
          <Text.span
            color="grey"
            fontSize={3}
            lineHeight="28px"
            fontWeight={5}
            flexGrow={1}
            flexShrink={0}
            mb={3}
          >
            {t(`headings.${currentCategory}`, { network: networkName })}
          </Text.span>
          <AssetFilter
            value={assetFilter}
            onSubmit={(value) => setAssetsParam(map(value, 'address'))}
            flexGrow={0}
            flexShrink={1}
            flexBasis="auto"
            tokens={poolTokens}
            loading={poolTokensLoading}
            category={currentCategory}
            setCategory={setFilterCategory}
            showTokenInfo
          />
        </Heading>
        <StyledInfiniteTable
          colgroup={
            <>
              <colgroup>
                <col />
              </colgroup>
              <colgroup className="assets" span={2}>
                <col />
                <col />
              </colgroup>
              <colgroup>
                <col />
                <col className="market-cap" />
                <col />
                <col />
              </colgroup>
            </>
          }
          head={
            <tr>
              <th>{t(`th.poolAddress`)}</th>
              <th colSpan={2} scope="colgroup">
                {t(`th.assets`)}
              </th>
              <th style={{ textAlign: 'center' }}>{t(`th.features`)}</th>
              <th>{t(`th.swapFee`)}</th>
              <th>{t(`th.marketCap`)}</th>
              <th>{t(`th.myShare`)}</th>
              <th>{t(`th.volume`)}</th>
            </tr>
          }
          loading={loading}
          hasMore={hasMore}
          loadMore={loadMore}
          noResults={
            <tr>
              <td colSpan={7}>
                <Text.p color="grey" textAlign="center" width="100%">
                  {t('noPools')}
                </Text.p>
              </td>
            </tr>
          }
        >
          {refetching
            ? []
            : sortedPools.map((pool) => <PoolRow key={pool.id} pool={pool} />)}
        </StyledInfiniteTable>
      </Card>
    </Box>
  )
}

export default Pools
