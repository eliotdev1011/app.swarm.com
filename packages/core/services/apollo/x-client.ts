import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'

import { getCurrentConfig } from '@core/observables/configForNetwork'

import { mergeEntities } from './utils'

const getGraphqlUrl = () => getCurrentConfig().xSubgraphUrl

const xClient = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          xOffers: {
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
})

export default xClient
