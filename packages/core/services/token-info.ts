import { ApolloQueryResult } from '@apollo/client'
import { loader } from 'graphql.macro'

import apolloClient from '@core/services/apollo'
import { NATIVE_ETH } from '@core/shared/consts'
import { isSameEthereumAddress } from '@core/web3'

export interface TokenInfo {
  id: string
  name: string
  symbol: string
  decimals: number
}

export interface TokenInfoResponse {
  tokens: TokenInfo[]
  xtokens: TokenInfo[]
}

let tokenInfo: Record<string, TokenInfo> = {}

let requestPromise: null | Promise<ApolloQueryResult<TokenInfoResponse>> = null

export const getTokenInfo = async (id: string) => {
  if (isSameEthereumAddress(id, NATIVE_ETH.address)) {
    return NATIVE_ETH
  }

  if (!requestPromise) {
    requestPromise = apolloClient.query<TokenInfoResponse>({
      query: loader('../queries/TokensInfo.gql'),
      variables: {
        tokensFilter: {
          paused: false,
        },
        xtokensFilter: {
          paused: false,
        },
      },
    })

    const response = await requestPromise

    if (response.data) {
      const tokens = response.data.tokens.reduce(
        (all, token) => ({
          ...all,
          [token.id]: token,
        }),
        {},
      )

      const xTokens = response.data.xtokens.reduce(
        (all, token) => ({
          ...all,
          [token.id.toLowerCase()]: token,
        }),
        {},
      )

      tokenInfo = { ...tokens, ...xTokens }
    }
  }

  await requestPromise

  if (tokenInfo[id.toLowerCase()]) {
    return tokenInfo[id.toLowerCase()]
  }

  return {
    id,
    name: '',
    symbol: '',
    decimals: null,
  }
}
