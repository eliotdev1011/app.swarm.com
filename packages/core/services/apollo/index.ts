import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'

import { getCurrentConfig } from '@core/observables/configForNetwork'

import typeDefs from './type-defs'
import { mergeEntities } from './utils'

const getGraphqlUrl = () => getCurrentConfig().subgraphUrl

const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          pools: {
            keyArgs: ['id', 'where'],
            merge: (existing, incoming, { args }) => {
              const skip = args?.skip || 0

              if (skip === 0) {
                return incoming
              }

              if (incoming.length) {
                return [...(existing || []), ...(incoming || [])]
              }

              return existing
            },
          },
          swaps: {
            keyArgs: ['id', 'where'],
            merge: mergeEntities,
          },
          poolShares: {
            keyArgs: ['id'],
            // eslint-disable-next-line @typescript-eslint/default-param-last
            merge: (existing = [], incoming = [], options) => {
              const skip = options.args?.skip || 0

              if (skip === 0) return incoming

              if (incoming.length) return [...existing, ...incoming]

              return existing
            },
          },
          offers: {
            keyArgs: ['id', 'where'],
            merge: mergeEntities,
          },
          bundleTokens: {
            keyArgs: ['id', 'where'],
            merge: mergeEntities,
          },
          transactions: {
            keyArgs: ['id', 'where'],
            merge: mergeEntities,
          },
          swarmStakes: {
            keyArgs: ['id', 'where'],
            merge: mergeEntities,
          },
        },
      },
    },
  }),
  link: new HttpLink({
    uri: getGraphqlUrl,
  }),
  typeDefs,
})

export default client
