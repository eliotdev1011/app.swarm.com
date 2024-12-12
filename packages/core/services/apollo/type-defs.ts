import { gql } from '@apollo/client'

const typeDefs = gql`
  extend type PoolToken {
    id: ID! # poolId + token address
    poolId: Pool!
    symbol: String
    name: String
    decimals: Int!
    address: String!
    balance: BigDecimal!
    denormWeight: BigDecimal!
  }

  extend type User @entity {
    id: ID!
    sharesOwned: [PoolShare!] @derivedFrom(field: "userAddress")
    txs: [Transaction!] @derivedFrom(field: "userAddress")
    swaps: [Swap!] @derivedFrom(field: "userAddress")
  }

  type XToken @entity {
    id: ID!
    token: Token!
    name: String!
    symbol: String!
    decimals: Int!
    paused: Boolean!
    poolTokens: [PoolToken!] @derivedFrom(field: "xToken")
  }

  enum TransactionType {
    swap
    createPool
    joinPool
    joinPoolSingleIn
    exitPool
    exitPoolSingleOut
  }

  type Transaction @entity {
    id: ID!
    block: Int!
    timestamp: Int!
    gasUsed: BigDecimal!
    gasPrice: BigDecimal!
    userAddress: User
    action: TransactionType
    tokensIn: [XToken!]!
    tokensOut: [XToken!]!
    tokensInAddresses: [Bytes!]!
    tokensOutAddresses: [Bytes!]!
    tokenAmountsIn: [BigDecimal!]!
    tokenAmountsOut: [BigDecimal!]!
    pools: [Pool!]!
  }
`

export default typeDefs
