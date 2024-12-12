import { gql, useQuery } from '@apollo/client'
import { big } from '@swarm/core/shared/utils/helpers/big-helpers'
import { Obj } from '@swarm/types'
import Big from 'big.js'
import { addDays, getUnixTime, startOfToday, subDays } from 'date-fns'
import { jsonToGraphQLQuery } from 'json-to-graphql-query'
import { useMemo, useRef } from 'react'

const keySorter = (a: string, b: string) =>
  +a.replace('stamp_', '') - +b.replace('stamp_', '')

interface ReceivedMetrics {
  poolTotalSwapVolume: string
  poolTotalSwapFee: string
  poolLiquidity: string
}

export const usePoolMetrics = (
  poolAddress: string,
  liquidityMultiplier: Big,
) => {
  const { current: today } = useRef(startOfToday())
  const queryObj = useMemo(
    () =>
      [...Array.from({ length: 31 })].reduce((map: Obj, _, i) => {
        const day = subDays(today, i)
        const timestamp = getUnixTime(day)
        return {
          ...map,
          [`stamp_${timestamp}`]: {
            __aliasFor: 'swaps',
            __args: {
              first: 1,
              orderBy: 'timestamp',
              orderDirection: 'desc',
              where: {
                poolAddress,
                // eslint-disable-next-line camelcase
                timestamp_gt: timestamp,
                // eslint-disable-next-line camelcase
                timestamp_lt: getUnixTime(addDays(day, 1)),
              },
            },
            poolTotalSwapVolume: true,
            poolTotalSwapFee: true,
            poolLiquidity: true,
          },
        }
      }, {}),
    [poolAddress, today],
  )

  const rawQueryString = jsonToGraphQLQuery({ query: queryObj })

  const { data, loading, error } = useQuery<Record<string, ReceivedMetrics[]>>(
    gql(rawQueryString),
    {
      skip: !rawQueryString,
      fetchPolicy: 'no-cache',
    },
  )

  const keys = useMemo(() => Object.keys(data || {}).sort(keySorter), [data])
  const newKeys = useMemo(
    () => keys.map((key) => +key.replace('stamp_', '')),
    [keys],
  )

  const metrics = useMemo(
    () =>
      keys?.reduce(
        (map: Record<number, ReceivedMetrics>, key, index) => ({
          ...map,
          [newKeys[index]]: data?.[key].length
            ? data?.[key][0]
            : map[newKeys[index - 1]] || {},
        }),
        {},
      ),
    [data, keys, newKeys],
  )

  const liquidityMetrics = useMemo<Record<number, number>>(
    () =>
      newKeys.reduce(
        (map, key) => ({
          ...map,
          [key]:
            big(metrics?.[key].poolLiquidity).toNumber() === 0
              ? 0
              : liquidityMultiplier
                  .mul(big(metrics?.[key].poolLiquidity))
                  .toNumber(),
        }),
        {},
      ),
    [liquidityMultiplier, metrics, newKeys],
  )

  const volumeMetrics = useMemo(
    () =>
      newKeys.reduce((map: Record<number, number>, key, index) => {
        if (index === 0) {
          return map
        }

        const current = big(metrics?.[key].poolTotalSwapVolume)
        const previous = big(metrics?.[newKeys[index - 1]]?.poolTotalSwapVolume)

        return {
          ...map,
          [key]: current.minus(previous).mul(liquidityMultiplier).toNumber(),
        }
      }, {}),
    [liquidityMultiplier, metrics, newKeys],
  )

  const swapFeeMetrics = useMemo(
    () =>
      newKeys.reduce((map: Record<number, number>, key, index) => {
        if (index === 0) {
          return map
        }

        const totalFee = big(metrics?.[key].poolTotalSwapFee).toNumber()

        const previousTotalFee = big(
          metrics?.[newKeys[index - 1]]?.poolTotalSwapFee,
        ).toNumber()
        const dailyFee = totalFee - previousTotalFee
        const liquidity = liquidityMetrics[key]

        return {
          ...map,
          [key]: (dailyFee / liquidity) * 365 * 100 || 0,
        }
      }, {}),
    [metrics, newKeys, liquidityMetrics],
  )

  return {
    timestamps: newKeys.slice(1),
    liquidityMetrics,
    volumeMetrics,
    swapFeeMetrics,
    loading,
    error,
  }
}

export default usePoolMetrics
