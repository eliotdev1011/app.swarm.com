import { useQuery } from '@apollo/client'
import useArrayInjector from '@swarm/core/hooks/rxjs/useArrayInjector'
import contractOf$ from '@swarm/core/observables/contractOf'
import tokenBalanceOf$ from '@swarm/core/observables/tokenBalanceOf'
import { PoolTokensQuery } from '@swarm/core/queries'
import { POLL_INTERVAL } from '@swarm/core/shared/consts'
import {
  prettifyTokenList,
  tokenFilter,
} from '@swarm/core/shared/utils/filters'
import { poolTokenToToken } from '@swarm/core/shared/utils/tokens'
import { useIsLoggedIn } from '@swarm/core/state/hooks'
import { useAccount } from '@swarm/core/web3'
import { ExtendedPoolToken, PoolToken } from '@swarm/types/tokens'
import { useMemo } from 'react'

import { isBrandingPoolToken } from 'src/shared/utils/filters/branding'

const usePoolTokens = (search = '', filter?: (token: PoolToken) => boolean) => {
  const isLoggedIn = useIsLoggedIn()
  const account = useAccount()

  const { data, loading, error, refetch } = useQuery<{
    poolTokens: PoolToken[]
  }>(PoolTokensQuery, {
    pollInterval: POLL_INTERVAL,
  })

  const cleanTokens = useMemo<PoolToken[]>(
    () =>
      prettifyTokenList(
        data?.poolTokens
          .map(poolTokenToToken)
          .filter(
            (poolToken) =>
              !poolToken?.xToken?.paused && isBrandingPoolToken(poolToken),
          ),
      ),
    [data?.poolTokens],
  )

  const allTokens = useArrayInjector<ExtendedPoolToken>(
    useMemo(
      () =>
        isLoggedIn
          ? {
              contract: (token) => contractOf$()(token),
              balance: tokenBalanceOf$(account),
            }
          : undefined,
      [account, isLoggedIn],
    ),
    useMemo(() => cleanTokens, [cleanTokens]),
  )

  const tokens = useMemo(
    () => allTokens.filter(tokenFilter(search, filter)),
    [allTokens, filter, search],
  )

  return { allTokens, tokens, loading, error, refetch }
}

export default usePoolTokens
