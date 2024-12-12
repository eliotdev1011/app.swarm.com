import useAbstractTokens from '@swarm/core/hooks/data/useAbstractTokens'
import useArrayInjector from '@swarm/core/hooks/rxjs/useArrayInjector'
import exchangeRateOf$ from '@swarm/core/observables/exchangeRateOf'
import tokenBalanceOf$ from '@swarm/core/observables/tokenBalanceOf'
import { NativeTokensQuery } from '@swarm/core/queries'
import { getTokensFilter } from '@swarm/core/shared/subgraph'
import { ZERO } from '@swarm/core/shared/utils/helpers/big-helpers'
import { NativeToken, ProxyToken } from '@swarm/types/tokens'
import { useMemo } from 'react'
import { combineLatest, of } from 'rxjs'
import { map } from 'rxjs/operators'

const useProxyAddressTokens = (cpkAddress?: string) => {
  const {
    allTokens: allNativeTokens,
    loading: queryLoading,
    error,
  } = useAbstractTokens<NativeToken>(NativeTokensQuery, {
    variables: {
      filter: getTokensFilter('XToken', { isLPT: false, paused: false }),
    },
  })

  const fullTokens = useArrayInjector<ProxyToken>(
    useMemo(
      () => ({
        // Temporar USD and Token CPK balance for tokens without XTOKEN. To delete in future:
        cpkTokenBalance: (token: NativeToken) =>
          cpkAddress && token ? tokenBalanceOf$(cpkAddress)(token) : of(ZERO),
        cpkTokenUsdBalance: (token: NativeToken) =>
          combineLatest([
            cpkAddress && token ? tokenBalanceOf$(cpkAddress)(token) : of(ZERO),
            exchangeRateOf$(0)(token),
          ]).pipe(
            map(
              ([balance, exchangeRate]) =>
                balance?.times(exchangeRate || 0).toNumber() || 0,
            ),
          ),

        cpkXTokenBalance: (token: NativeToken) =>
          cpkAddress && token.xToken
            ? tokenBalanceOf$(cpkAddress)(token.xToken)
            : of(ZERO),
        cpkXTokenUsdBalance: (token: NativeToken) =>
          combineLatest([
            cpkAddress && token.xToken
              ? tokenBalanceOf$(cpkAddress)(token.xToken)
              : of(ZERO),
            exchangeRateOf$(0)(token),
          ]).pipe(
            map(
              ([balance, exchangeRate]) =>
                balance?.times(exchangeRate || 0).toNumber() || 0,
            ),
          ),
      }),
      [cpkAddress],
    ),
    useMemo(
      () =>
        allNativeTokens.map((token) => ({
          ...token,
          cpkTokenBalance: undefined,
          cpkTokenUsdBalance: 0,

          cpkXTokenBalance: undefined,
          cpkXTokenUsdBalance: 0,
        })),
      [allNativeTokens],
    ),
  )

  const positiveTokens = useMemo(
    () =>
      fullTokens?.filter(
        ({ cpkXTokenBalance, cpkTokenBalance }) =>
          (cpkXTokenBalance && cpkXTokenBalance.gt(0)) ||
          (cpkTokenBalance && cpkTokenBalance.gt(0)),
      ),
    [fullTokens],
  )

  return {
    tokens: positiveTokens,
    loading:
      queryLoading ||
      fullTokens.some(
        (token) =>
          token.cpkXTokenBalance === null ||
          (typeof token.cpkXTokenBalance === 'undefined' && cpkAddress),
      ),
    error,
  }
}

export default useProxyAddressTokens
