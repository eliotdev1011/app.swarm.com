import { NetworkStatus, useQuery } from '@apollo/client'
import { Swap } from '@swarm/types'
import { useCallback, useEffect, useMemo, useState } from 'react'

import useEffectCompare from '@core/hooks/effects/useEffectCompare'
import { SwapsQuery } from '@core/queries'

import { DEFAULT_OPTIONS } from './consts'
import { mapSwapOptionsToVariables } from './helpers'
import { SwapQueryVariables, SwapsQueryResult, UseSwapsOptions } from './types'

const useSwaps = (options: UseSwapsOptions): SwapsQueryResult => {
  const variables = useMemo(
    () => mapSwapOptionsToVariables({ ...DEFAULT_OPTIONS, ...options }),
    [options],
  )

  const noTokensPassed = !options.tokens || options.tokens.length === 0
  const [hasMore, setHasMore] = useState(!noTokensPassed)

  const {
    data,
    loading,
    error,
    networkStatus,
    refetch: nativeRefetch,
    called,
    fetchMore: nativeFetchMore,
  } = useQuery<{ swaps: Swap[] }, SwapQueryVariables>(SwapsQuery, {
    variables,
    skip: noTokensPassed || options.ignore,
    notifyOnNetworkStatusChange: true,
  })

  const refetch = useCallback(
    async (limit?: number) => {
      if (noTokensPassed || loading) {
        return Promise.resolve(null)
      }

      return nativeRefetch({
        ...variables,
        limit: limit || data?.swaps.length || variables.limit,
      })
    },
    [data?.swaps.length, loading, nativeRefetch, noTokensPassed, variables],
  )

  const fetchMore = useCallback(async () => {
    if (noTokensPassed || loading) {
      return
    }

    const {
      data: { swaps },
    } = await nativeFetchMore({
      variables: { ...variables, skip: data?.swaps?.length },
    })

    setHasMore(!!swaps.length && swaps.length === variables.limit)
  }, [data?.swaps?.length, loading, nativeFetchMore, noTokensPassed, variables])

  useEffectCompare(() => {
    refetch(options.limit)
  }, [noTokensPassed, options.tokens?.[0], options.tokens?.[1], options.limit])

  useEffect(() => {
    setHasMore(!noTokensPassed)
  }, [noTokensPassed])

  return useMemo(
    () => ({
      data,
      called,
      loading:
        loading ||
        ![NetworkStatus.ready, NetworkStatus.error].includes(networkStatus),
      error,
      refetching: networkStatus === NetworkStatus.refetch,
      refetch,
      fetchMore,
      hasMore,
      options,
    }),
    [
      called,
      data,
      error,
      fetchMore,
      hasMore,
      loading,
      networkStatus,
      refetch,
      options,
    ],
  )
}

export * from './types'
export * from './consts'
export default useSwaps
