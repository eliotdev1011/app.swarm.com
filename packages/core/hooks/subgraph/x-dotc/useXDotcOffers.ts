import { NetworkStatus, useQuery } from '@apollo/client'
import { QueryHookOptions } from '@apollo/client/react/types/types'
import { NormalizedXOffer } from '@swarm/types/normalized-entities/x-offer'
import {
  XOfferFilter,
  XOffersQueryVariables,
  XOffer as XOfferSubgraph,
} from '@swarm/types/x-subgraph/graphql'
import { useCallback, useMemo, useState } from 'react'

import useEffectCompare from '@core/hooks/effects/useEffectCompare'
import { XOffersQuery } from '@core/queries'
import xClient from '@core/services/apollo/x-client'
import { POLL_INTERVAL } from '@core/shared/consts'
import { normalizeOffers } from '@core/shared/utils/subgraph/x-dotc'

export const PageLimit = 10

interface QueryResponse {
  xOffers: XOfferSubgraph[]
}

export type RefetchXOffersFn = (
  filter?: Partial<XOfferFilter>,
) => Promise<NormalizedXOffer[]>

const useXDotcOffers = (
  options?: QueryHookOptions<QueryResponse, XOffersQueryVariables>,
) => {
  const [hasMore, setHasMore] = useState(true)

  const {
    data,
    loading,
    error,
    called,
    fetchMore: nativeFetchMore,
    networkStatus,
    refetch: nativeRefetch,
  } = useQuery<QueryResponse>(XOffersQuery, {
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

  useEffectCompare(() => {
    setHasMore(true)
  }, [options?.variables?.filter])

  const fetchMore = useCallback(
    async (skip: number, limit?: number) => {
      const offersResponse = await nativeFetchMore({
        variables: {
          ...options?.variables,
          ...(limit && { limit }),
          skip,
          filter: options?.variables?.filter,
        },
      })
      if (offersResponse.data.xOffers.length < PageLimit) {
        setHasMore(false)
      }

      return offersResponse
    },
    [nativeFetchMore, options?.variables],
  )

  const refetch = useCallback<RefetchXOffersFn>(
    (filter: Partial<XOfferFilter> = {}) =>
      nativeRefetch({
        filter,
        limit: PageLimit,
        skip: 0,
      }).then((res) => {
        return normalizeOffers(res.data?.xOffers || [])
      }),
    [nativeRefetch],
  )

  const offers = useMemo<NormalizedXOffer[]>(
    () => normalizeOffers(data?.xOffers || []),
    [data?.xOffers],
  )

  return useMemo(
    () => ({
      offers,
      loadingOffers:
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
      fetchMore,
      hasMore,
    }),
    [
      offers,
      loading,
      networkStatus,
      error,
      called,
      refetch,
      fetchMore,
      hasMore,
    ],
  )
}

export default useXDotcOffers
