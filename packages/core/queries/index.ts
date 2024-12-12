import { loader } from 'graphql.macro'

export const NativeTokensQuery = loader('./NativeTokens.gql')
export const UserQuery = loader('./UserQuery.gql')
export const TransactionsQuery = loader('./Transactions.gql')
export const Transactions = loader('./Transactions.gql')
export const AllPoolsQuery = loader('./AllPools.gql')
export const AssetTokensQuery = loader('./AssetTokens/AssetTokens.gql')
export const AssetTokensPoorQuery = loader('./AssetTokens/AssetTokensPoor.gql')
export const SinglePoolQuery = loader('./Pool.gql')
export const PoolsQuery = loader('./Pools.gql')
export const PoolSharesQuery = loader('./PoolShares.gql')
export const PoolTokensQuery = loader('./PoolTokens.gql')
export const SwapsQuery = loader('./Swaps.gql')
export const XTokensQuery = loader('./xTokens.gql')
export const OffersQuery = loader('./Offers.gql')
export const Erc20TokensQuery = loader('./Erc20Tokens.gql')
export const SecuritiesQuery = loader('./Securities.gql')
export const StakesQuery = loader('./Stakes.gql')

export const DotcAssetsQuery = loader('./x-subgraph/DotcAssets.gql')
export const XOffersQuery = loader('./x-subgraph/XOffers.gql')
export const Volume24hsQuery = loader('./x-subgraph/Volume24hs.gql')
export const Sx1155TokenIdsQuery = loader('./x-subgraph/Sx1155TokenIds.gql')
export const UserHoldingsQuery = loader('./x-subgraph/UserHoldings.gql')

export const UniswapTokensQuery = loader('./uniswap-subgraph/Tokens.gql')
