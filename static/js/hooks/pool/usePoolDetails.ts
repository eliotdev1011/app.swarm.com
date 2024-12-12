import { useQuery } from '@apollo/client'
import { SinglePoolQuery } from '@swarm/core/queries'
import { POLL_INTERVAL } from '@swarm/core/shared/consts'
import { safeDiv } from '@swarm/core/shared/utils/helpers/big-helpers'
import { useAccount } from '@swarm/core/web3'
import { PoolExpanded } from '@swarm/types'
import { getUnixTime, startOfDay, subDays } from 'date-fns'
import { useCallback, useMemo, useRef } from 'react'

import { mapUserShareToPool } from 'src/shared/utils/pool'

import useFullTokens from './useFullTokens'

type PoolData = {
  pool: PoolExpanded | null
}

interface PoolQueryVariables {
  id?: string
  currentTimestamp: number
}

const DEFAULT_POOL_TOKEN_NAME = 'Swarm Pool Token'

const usePoolDetails = (id?: string) => {
  const account = useAccount()

  const { current: currentTimestamp } = useRef(
    getUnixTime(subDays(startOfDay(Date.now()), 1)),
  )

  const {
    data: poolData,
    loading: poolLoading,
    error: poolError,
    refetch,
  } = useQuery<PoolData, PoolQueryVariables>(
    SinglePoolQuery,
    useMemo(() => {
      return {
        variables: { ...(id && { id }), currentTimestamp },
        skip: !id,
        pollInterval: POLL_INTERVAL,
      }
    }, [id, currentTimestamp]),
  )

  const poolToken = useMemo(() => {
    if (poolData === undefined) {
      return undefined
    }

    if (poolData.pool === null) {
      return null
    }

    return {
      ...poolData.pool.liquidityPoolToken,
      name:
        poolData.pool.liquidityPoolToken.xToken?.name ||
        DEFAULT_POOL_TOKEN_NAME,
    }
  }, [poolData])

  const poolWithUserShares = useMemo(
    () =>
      poolData && poolData.pool && mapUserShareToPool(poolData.pool, account),
    [poolData, account],
  )

  const fullTokens = useFullTokens(poolWithUserShares)

  const reload = useCallback(async () => {
    if (id) {
      await refetch({ id, currentTimestamp })
    }
  }, [id, currentTimestamp, refetch])

  const newCRPoolToken = useMemo(
    () =>
      poolData?.pool?.newCRPoolToken
        ? {
            ...poolData.pool.newCRPoolToken,
            weight: safeDiv(
              poolData.pool.newCRPoolToken.denormWeight,
              parseFloat(poolData.pool.totalWeight) +
                parseFloat(poolData.pool.newCRPoolToken.denormWeight),
            )
              .times(100)
              .toNumber(),
          }
        : null,
    [poolData?.pool],
  )

  return useMemo(() => {
    return {
      pool: poolWithUserShares && {
        ...poolWithUserShares,
        isAnyAssetPaused: fullTokens.some(({ xToken }) => xToken?.paused),
        xPoolTokenAddress: poolToken?.xToken?.id,
        tokens: fullTokens,
        newCRPoolToken,
      },
      poolToken,
      loading:
        poolLoading ||
        (!!id && (poolWithUserShares === undefined || poolToken === undefined)),
      error: poolError,
      refetch: reload,
    }
  }, [
    poolWithUserShares,
    fullTokens,
    poolToken,
    newCRPoolToken,
    poolLoading,
    id,
    poolError,
    reload,
  ])
}

export default usePoolDetails
