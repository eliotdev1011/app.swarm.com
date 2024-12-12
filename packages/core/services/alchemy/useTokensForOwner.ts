import { AlchemyToken } from '@swarm/types/tokens'
import { useQuery } from '@tanstack/react-query'
import { TokenBalanceType } from 'alchemy-sdk'
import { useMemo } from 'react'

import { updateBalanceKey } from '@core/observables/watcher'
import AlchemyAPI from '@core/services/alchemy'
import { TokenType } from '@core/shared/enums'
import { mapBy } from '@core/shared/utils/collection'
import { normalize, ZERO } from '@core/shared/utils/helpers'
import { useReadyState } from '@core/web3'

interface FilterAlchemyQuery {
  includeTokens?: string[] | TokenBalanceType
}

interface UseTokensForOwnerOptions {
  account?: string
  initialFilter?: FilterAlchemyQuery
  enabled?: boolean
}

const useTokensForOwner = (options: UseTokensForOwnerOptions) => {
  const ready = useReadyState()

  const { account, initialFilter, enabled = true } = options
  const includeTokens = initialFilter?.includeTokens

  const localOptions = useMemo(
    () => ({
      contractAddresses: includeTokens || [],
    }),
    [includeTokens],
  )

  const { data, refetch, isLoading } = useQuery({
    queryFn: () => {
      if (localOptions?.contractAddresses)
        return AlchemyAPI.getTokensForOwner(account as string, localOptions)
      return AlchemyAPI.getAllTokensForOwner(account as string)
    },
    queryKey: ['allTokensForOwner', account, localOptions.contractAddresses],
    enabled: enabled && !!account,
  })

  const tokens = useMemo(() => {
    if (!data) return []

    return data.tokens.map((token) => {
      const balance = token.rawBalance
        ? normalize(token.rawBalance, token.decimals)
        : ZERO
      if (account) {
        updateBalanceKey({
          account,
          address: token.contractAddress,
          value: balance,
        })
      }

      return {
        id: token.contractAddress,
        name: token.name,
        symbol: token.symbol,
        decimals: token.decimals,
        logo: token.logo,
        type: TokenType.erc20,
        balance: token.rawBalance
          ? normalize(token.rawBalance, token.decimals)
          : ZERO,
      } as AlchemyToken
    })
  }, [account, data])

  const tokensDictionary: Map<string, AlchemyToken> = useMemo(
    () => mapBy(tokens, 'id'),
    [tokens],
  )

  return {
    tokens: tokens,
    tokensDictionary,
    reloadTokens: refetch,
    loading: !ready || isLoading,
  }
}

export default useTokensForOwner
