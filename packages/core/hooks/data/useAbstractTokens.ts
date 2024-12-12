import {
  ApolloError,
  DocumentNode,
  QueryHookOptions,
  TypedDocumentNode,
  useQuery,
} from '@apollo/client'
import { Obj } from '@swarm/types'
import { AbstractToken } from '@swarm/types/tokens'
import { useMemo } from 'react'

import { prettifyTokenList } from '@core/shared/utils/filters'

import useArrayInjector, {
  AdditionalProps,
  InjectionCreatorMap,
} from '../rxjs/useArrayInjector'

interface AbstractTokensResponse<K> {
  allTokens: K[]
  tokenAddrs: string[]
  tokenSymbols: string[]
  loading: boolean
  error: ApolloError | undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  refetch: any
  fetched: boolean
}

const useAbstractTokens = <
  TData extends AbstractToken,
  M extends InjectionCreatorMap<TData> = InjectionCreatorMap<TData>
>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queryDoc: DocumentNode | TypedDocumentNode<any, Obj>,
  queryOptions?: QueryHookOptions<Record<string, TData[]>, Obj>,
  injections?: M,
): AbstractTokensResponse<TData & AdditionalProps<TData, M>> => {
  const { data, loading, error, refetch } = useQuery<Record<string, TData[]>>(
    queryDoc,
    queryOptions,
  )
  const tokensArray = useMemo(() => {
    const tokensArrayKey = Object.keys(data || {})[0]
    return data?.[tokensArrayKey] || []
  }, [data])

  const allTokens = useArrayInjector(
    useMemo(() => injections || ({} as M), [injections]),
    useMemo(() => prettifyTokenList<TData>(tokensArray), [tokensArray]),
  )

  const tokenAddrs = useMemo(() => allTokens.map((token) => token.id), [
    allTokens,
  ])

  const tokenSymbols = useMemo(() => allTokens.map((token) => token.symbol), [
    allTokens,
  ])

  return useMemo(() => {
    return {
      allTokens,
      tokenAddrs,
      tokenSymbols,
      loading,
      error,
      refetch,
      fetched: !!data,
    }
  }, [allTokens, tokenAddrs, tokenSymbols, data, error, loading, refetch])
}

export default useAbstractTokens
