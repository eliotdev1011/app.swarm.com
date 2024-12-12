import { NetworkStatus, useQuery } from '@apollo/client'
import { QueryHookOptions } from '@apollo/client/react/types/types'
import {
  UserHoldingFilter,
  UserHoldingsQueryVariables,
  UserHolding as UserHoldingSubgraph,
} from '@swarm/types/x-subgraph/graphql'
import { useCallback, useMemo } from 'react'

import { UserHoldingsQuery } from '@core/queries'
import { POLL_INTERVAL } from '@core/shared/consts'
import { normalizeUserHolding } from '@core/shared/utils/subgraph/x-dotc'
import { NormalizedUserHolding } from '@swarm/types/normalized-entities/user-holding'
import xClient from '@core/services/apollo/x-client'

export const PageLimit = 100

interface QueryResponse {
  userHoldings: UserHoldingSubgraph[]
}

export type RefetchUserHoldingsFn = (
  filter?: Partial<UserHoldingFilter>,
) => Promise<any[]>

const useUserHoldings = (
  options?: QueryHookOptions<QueryResponse, UserHoldingsQueryVariables>,
) => {
  const {
    data,
    loading,
    error,
    called,
    networkStatus,
    refetch: nativeRefetch,
  } = useQuery<QueryResponse>(UserHoldingsQuery, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    pollInterval: POLL_INTERVAL,
    ...options,
    variables: {
      limit: PageLimit,
      skip: 0,
      filter: options?.variables?.filter,
    },
    client: xClient,
  })

  const refetch = useCallback<RefetchUserHoldingsFn>(
    (filter: Partial<UserHoldingFilter> = {}) =>
      nativeRefetch({
        filter,
        limit: PageLimit,
        skip: 0,
      }).then((res) => {
        return res.data?.userHoldings || []
      }),
    [nativeRefetch],
  )

  const userHoldings = useMemo<NormalizedUserHolding[]>(
    () => data?.userHoldings.map(normalizeUserHolding) || [],
    [data?.userHoldings],
  )

  return useMemo(
    () => ({
      userHoldings,
      loadingUserHoldings:
        loading ||
        ![
          NetworkStatus.ready,
          NetworkStatus.error,
          NetworkStatus.poll,
        ].includes(networkStatus),
      error,
      called,
      refetching: networkStatus === NetworkStatus.refetch,
      refetch,
    }),
    [loading, networkStatus, error, called, refetch],
  )
}

export default useUserHoldings
