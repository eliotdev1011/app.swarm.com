import { useQuery } from '@apollo/client'
import { useCpk } from '@swarm/core/contracts/cpk'
import useAbstractTokens from '@swarm/core/hooks/data/useAbstractTokens'
import useArrayInjector from '@swarm/core/hooks/rxjs/useArrayInjector'
import contractOf$ from '@swarm/core/observables/contractOf'
import exchangeRateOf$ from '@swarm/core/observables/exchangeRateOf'
import tokenBalanceOf$ from '@swarm/core/observables/tokenBalanceOf'
import { AllPoolsQuery, XTokensQuery } from '@swarm/core/queries'
import { POLL_INTERVAL, SPT_DECIMALS } from '@swarm/core/shared/consts'
import { calcPoolTokenExchangeRate } from '@swarm/core/shared/utils/calculations'
import { propEquals } from '@swarm/core/shared/utils/collection/filters'
import { tokenFilter } from '@swarm/core/shared/utils/filters'
import { Pool } from '@swarm/types'
import { PoolToken, XToken } from '@swarm/types/tokens'
import { useMemo } from 'react'
import { combineLatest } from 'rxjs'
import { map } from 'rxjs/operators'

import { createPoolsFilter } from 'src/shared/utils/filters'

interface PoolsDto {
  pools: Pick<Pool, 'id' | 'totalWeight' | 'tokens'>[]
}

export interface OwnablePoolToken extends XToken {
  tokens: PoolToken[]
  isAnyPoolAssetPaused: boolean
  exchangeRate?: number
  userBalances: {
    ether: number
    usd: number
    loading: boolean
  }
}

type FullPoolToken = Pick<Pool, 'id' | 'totalWeight' | 'totalShares'> & {
  decimals: number
  tokens: PoolToken[]
}

interface UsePoolTokensParams {
  search?: string
  filter?: (token: XToken) => boolean
  cpkAddress?: string
}

const usePoolTokens = ({
  cpkAddress,
  search = '',
  filter,
}: UsePoolTokensParams) => {
  const cpk = useCpk()

  const selectedCpkAddress = cpkAddress || cpk?.address

  const {
    data,
    loading: pLoading,
    error: pError,
  } = useQuery<PoolsDto>(AllPoolsQuery, {
    variables: {
      filter: createPoolsFilter(),
    },
    fetchPolicy: 'no-cache',
    pollInterval: POLL_INTERVAL,
  })

  const poolAddresses = useMemo<string[]>(
    () => (!pLoading && data?.pools ? data?.pools.map((pool) => pool.id) : []),
    [data?.pools, pLoading],
  )

  const {
    allTokens: rawTokens,
    tokenAddrs,
    loading: tokensLoading,
    error: tokensError,
    refetch,
  } = useAbstractTokens<XToken>(XTokensQuery, {
    skip: pLoading,
    variables: {
      filter: poolAddresses.length
        ? {
            // eslint-disable-next-line camelcase
            token_in: poolAddresses,
          }
        : {},
    },
  })

  const poolTokens = useArrayInjector<FullPoolToken>(
    useMemo(
      () => ({
        tokens: (pool) =>
          combineLatest(
            pool.tokens
              .map((token) => ({
                ...token,
                address: token.xToken?.token.id || token.address,
                id: token.xToken?.token.id || token.address,
              }))
              .map((token) =>
                exchangeRateOf$(0)(token).pipe(
                  map((exchangeRate) => ({
                    ...token,
                    exchangeRate: exchangeRate || 0,
                  })),
                ),
              ),
          ),
      }),
      [],
    ),
    useMemo(
      () =>
        (data?.pools || []).map((pool) => ({
          ...pool,
          decimals: SPT_DECIMALS,
        })) as FullPoolToken[],
      [data?.pools],
    ),
  )

  const allTokens = useArrayInjector<OwnablePoolToken>(
    useMemo(
      () => ({
        userBalances: (rawToken) =>
          tokenBalanceOf$(selectedCpkAddress)(rawToken).pipe(
            map((ether) => ({
              ether: ether?.toNumber() || 0,
              usd: ether?.times(rawToken?.exchangeRate || 0).toNumber() || 0,
              loading:
                ether === null ||
                (typeof ether === 'undefined' && !!selectedCpkAddress),
            })),
          ),
        contract: contractOf$(),
      }),
      [selectedCpkAddress],
    ),
    useMemo(
      () =>
        rawTokens.map((rawToken) => {
          const poolToken = poolTokens.find(propEquals('id', rawToken.token.id))

          return {
            ...rawToken,
            isAnyPoolAssetPaused: poolToken?.tokens.some(
              (token) => !!token?.xToken?.paused,
            ),
            tokens: poolToken?.tokens || [],
            exchangeRate: poolToken ? calcPoolTokenExchangeRate(poolToken) : 0,
            userBalances: {
              ether: 0,
              usd: 0,
              loading: !!selectedCpkAddress,
            },
          }
        }) as OwnablePoolToken[],
      [poolTokens, rawTokens, selectedCpkAddress],
    ),
  )

  const areBalancesLoading = allTokens.some(
    (token) => token.userBalances.loading,
  )

  const tokens = useMemo(
    () => allTokens.filter(tokenFilter(search, filter)),
    [allTokens, filter, search],
  )

  const queryOpts = {
    loading: pLoading || tokensLoading || areBalancesLoading,
    errors: [pError, tokensError].filter((error) => error),
    refetch,
  }

  return { allTokens, tokens, tokenAddrs, ...queryOpts }
}

export default usePoolTokens
