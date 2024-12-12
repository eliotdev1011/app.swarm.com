/* eslint-disable camelcase */
import { PoolsFilterSGQuery } from '@swarm/types/subgraph-responses'

import {
  getCurrentBaseName,
  getOnlyBrandTokensIds,
} from '@core/shared/utils'

import { BrandRoutes } from '../enums'

import { getCurrentBrandingTokens } from './filters-tokens'

export const getPoolTokensFilter = (
  initialFilter?: PoolsFilterSGQuery,
): PoolsFilterSGQuery => {
  const baseName = getCurrentBaseName()
  switch (baseName) {
    case BrandRoutes.mattereum:
    case BrandRoutes.fintiv: {
      return {
        ...initialFilter,
        tokensList_contains: getCurrentBrandingTokens('XToken'),
      }
    }
    default: {
      return {
        ...initialFilter,
        tokensList_not_contains: getOnlyBrandTokensIds('XToken'),
      }
    }
  }
}
