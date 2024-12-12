import { NetworkStatus, useQuery } from '@apollo/client'
import { QueryHookOptions } from '@apollo/client/react/types/types'
import { useCpk } from '@swarm/core/contracts/cpk'
import { PoolsQuery } from '@swarm/core/queries'
import { useExchangeRates } from '@swarm/core/services/exchange-rates'
import { POLL_INTERVAL } from '@swarm/core/shared/consts'
import { getPoolTokensFilter } from '@swarm/core/shared/subgraph'
import { safeDiv } from '@swarm/core/shared/utils/helpers/big-helpers'
import { poolTokenToToken } from '@swarm/core/shared/utils/tokens'
import { isBrandingDOTCToken } from '@swarm/core/shared/utils/tokens/filters'
import { useAccount } from '@swarm/core/web3'
import { PoolExpanded } from '@swarm/types'
import { PoolsFilterSGQuery } from '@swarm/types/subgraph-responses'
import { PoolsQueryVariables } from '@swarm/types/subgraph-responses/query-variables'
import uniqBy from 'lodash/uniqBy'
import { useCallback, useMemo } from 'react'

import { PageLimit } from 'src/components/Pools/consts'
import { calculateMarketCap, mapUserShareToPool } from 'src/shared/utils/pool'

import useHasExtraRewards from './useHasExtraRewards'

interface PoolsResponse {
  pools: Required<PoolExpanded>[]
}

const usePools = (
  options?: QueryHookOptions<PoolsResponse, PoolsQueryVariables>,
) => {
  const account = useAccount()
  const cpk = useCpk()

  const hasExtraRewards = useHasExtraRewards()
  const exchangeRates = useExchangeRates()

  const {
    data,
    called,
    refetch: nativeRefetch,
    fetchMore: nativeFetchMore,
    networkStatus,
    loading,
  } = useQuery<PoolsResponse>(PoolsQuery, {
    fetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    pollInterval: POLL_INTERVAL,
    ...options,
    variables: {
      limit: PageLimit,
      skip: 0,
      ...options?.variables,
      filter: getPoolTokensFilter(options?.variables?.filter),
    },
  })

  const fetchMore = useCallback(
    (skip: number, limit?: number) =>
      nativeFetchMore({
        variables: {
          ...options?.variables,
          ...(limit && { limit }),
          filter: getPoolTokensFilter(options?.variables?.filter),
          skip,
        },
      }),
    [nativeFetchMore, options?.variables],
  )

  const refetch = useCallback(
    (filter: Partial<PoolsFilterSGQuery> = {}) =>
      nativeRefetch({
        filter: getPoolTokensFilter(filter),
        limit: PageLimit,
        skip: 0,
      }),
    [nativeRefetch],
  )

  const filteredPools = useMemo(() => {
    if (data === undefined) {
      return []
    }

    const poolsExpanded = data.pools.map((pool) => {
      const poolTokens = pool.tokens.map((poolToken) => {
        const token = poolTokenToToken(poolToken)

        return {
          ...token,
          exchangeRate: exchangeRates[token.id]?.exchangeRate,
          weight: safeDiv(token.denormWeight, pool.totalWeight).toNumber(),
        }
      })

      const poolExpanded = {
        ...mapUserShareToPool(pool, account),
        hasExtraRewards: hasExtraRewards(pool),
        tokens: poolTokens,
      }

      const marketCap = calculateMarketCap(poolExpanded)

      return {
        ...poolExpanded,
        marketCap,
      }
    })
    return uniqBy(poolsExpanded || [], 'id').filter(
      (pool) =>
        !pool.tokensList.some(
          (address) => !isBrandingDOTCToken({ id: address }),
        ),
    )
  }, [data, account, hasExtraRewards, exchangeRates])

  const loadingPools =
    loading ||
    (account !== undefined && cpk === null) ||
    ![NetworkStatus.ready, NetworkStatus.error, NetworkStatus.poll].includes(
      networkStatus,
    )

  return {
    called,
    pools: filteredPools,
    loadingPools,
    refetch,
    refetching: networkStatus === NetworkStatus.refetch,
    fetchMore,
  }
}

export default usePools
