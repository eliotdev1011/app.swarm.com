import { NetworkStatus, useQuery } from '@apollo/client'
import { SwapsQuery } from '@swarm/core/queries'
import { POLL_INTERVAL } from '@swarm/core/shared/consts'
import { Swap } from '@swarm/types'
import { useCallback } from 'react'

interface SwapQueryVariables {
  limit: number
  skip: number
  filter: {
    poolAddress: string
  }
}

const usePoolSwaps = (poolAddress: string) => {
  const {
    data,
    loading,
    error,
    fetchMore: nativeFetchMore,
    networkStatus,
  } = useQuery<{ swaps: Swap[] }, SwapQueryVariables>(SwapsQuery, {
    variables: {
      limit: 10,
      skip: 0,
      filter: {
        poolAddress,
      },
    },
    notifyOnNetworkStatusChange: true,
    pollInterval: POLL_INTERVAL,
  })

  const fetchMore = useCallback(
    (skip: number) =>
      nativeFetchMore({
        variables: {
          filter: { poolAddress },
          limit: 10,
          skip,
        },
      }),
    [nativeFetchMore, poolAddress],
  )

  return {
    data,
    loading:
      loading ||
      ![NetworkStatus.ready, NetworkStatus.error].includes(networkStatus),
    error,
    refetching: networkStatus === NetworkStatus.refetch,
    fetchMore,
  }
}

export default usePoolSwaps
