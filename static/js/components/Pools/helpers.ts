/* eslint-disable camelcase */
import { isSameEthereumAddress } from '@swarm/core/web3'
import { PoolsFilterSGQuery } from '@swarm/types/subgraph-responses'
import { PoolToken } from '@swarm/types/tokens'
import match from 'conditional-expression'

import { PoolCategory } from './consts'

const AllPoolsFilter = {
  tokensCount_gt: 1,
  active: true,
}

const NonAllSmartPoolsPoolsFilter = {
  ...AllPoolsFilter,
  crp: false,
  finalized: true,
}

const SmartPoolsFilter = {
  ...AllPoolsFilter,
  crp: true,
}

const UserPoolsFilter = (account: string) => ({
  ...(account && { holders_contains: [account] }),
  tokensCount_gt: 1,
  active: true,
})

export const getCategoryFilter = (
  category: PoolCategory = 'all',
  account = '',
  hasSmartPoolsSupport = false,
): PoolsFilterSGQuery =>
  match(category)
    .equals('my-pools')
    .then(UserPoolsFilter(account))
    .equals('smart-pools')
    .then(SmartPoolsFilter)
    .else(hasSmartPoolsSupport ? AllPoolsFilter : NonAllSmartPoolsPoolsFilter)

export const getAssetFilter = <T extends PoolToken = PoolToken>(
  poolTokens: T[],
  assets: string[],
) =>
  poolTokens.filter((token) => {
    return assets.some((asset) => isSameEthereumAddress(asset, token.address))
  })
