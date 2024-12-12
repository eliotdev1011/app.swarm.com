import { useQuery } from '@apollo/client'
import { QueryHookOptions } from '@apollo/client/react/types/types'
import {
  NativeTokenSubgraph,
  TokensFilterSGQuery,
} from '@swarm/types/subgraph-responses'
import { NativeToken } from '@swarm/types/tokens'
import { useMemo } from 'react'

import { NativeTokensQuery } from '@core/queries'
import { createMapper } from '@core/shared/utils'
import {
  fillEtherFields,
  idToAddress,
  idToAddressXToken,
} from '@core/shared/utils/tokens'

interface NativeTokensResponse {
  tokens: Required<NativeTokenSubgraph>[]
}

interface NativeTokensQueryVariables {
  includePoolTokens?: boolean
  filter?: TokensFilterSGQuery
}

const mapper = createMapper(idToAddress, idToAddressXToken, fillEtherFields)

const useNativeTokens = <T = NativeToken>(
  options?: QueryHookOptions<NativeTokensResponse, NativeTokensQueryVariables>,
) => {
  const { data, ...respOptions } = useQuery<
    NativeTokensResponse,
    NativeTokensQueryVariables
  >(NativeTokensQuery, options)

  const nativeTokens = useMemo<T[]>(
    () => mapper(data?.tokens || []) as T[],
    [data?.tokens],
  )

  return {
    nativeTokens,
    ...respOptions,
    loading: respOptions.loading,
  }
}

export default useNativeTokens
