/* eslint-disable camelcase */
import {
  OffersFilterSGQuery,
  TokensFilterSGQuery,
} from '@swarm/types/subgraph-responses'

import { excludedDotcTokens } from '@core/shared/consts/dotc'
import { getCurrentBaseName } from '@core/shared/utils'
import { getLastUsedNetworkId } from '@core/web3'

import { BrandRoutes } from '../enums'

import {
  excludeAllBrandingTokensFilter,
  includeBrandingTokensFilter,
} from './filters-tokens'

export const excludeDOTCTokensFilter = () => {
  const networkId = getLastUsedNetworkId()
  if (excludedDotcTokens[networkId].length <= 0) {
    return {}
  }
  return {
    id_not_in: excludedDotcTokens[networkId],
  }
}

const excludeBrandOffersFilter = (
  initialFilter?: OffersFilterSGQuery,
): OffersFilterSGQuery => {
  return {
    and: [
      excludeAllBrandingTokensFilter<OffersFilterSGQuery>('tokenOut_not_in'),
      excludeAllBrandingTokensFilter<OffersFilterSGQuery>('tokenIn_not_in'),
      initialFilter || {},
    ],
  }
}

export const getOTCTokensFilter = (initialFilter?: TokensFilterSGQuery) => {
  const baseName = getCurrentBaseName()

  switch (baseName) {
    case BrandRoutes.mattereum:
    case BrandRoutes.fintiv: {
      return {
        ...includeBrandingTokensFilter<TokensFilterSGQuery>(
          'XToken',
          ['id'],
          initialFilter,
        ),
      }
    }
    default: {
      return {
        ...excludeAllBrandingTokensFilter<TokensFilterSGQuery>('id_not_in'),
        ...initialFilter,
      }
    }
  }
}

export const getOTCOffersFilter = (initialFilter?: OffersFilterSGQuery) => {
  const baseName = getCurrentBaseName()

  switch (baseName) {
    case BrandRoutes.mattereum:
    case BrandRoutes.fintiv: {
      return includeBrandingTokensFilter<OffersFilterSGQuery>(
        'XToken',
        ['tokenIn', 'tokenOut'],
        initialFilter,
      )
    }
    default: {
      return excludeBrandOffersFilter(initialFilter)
    }
  }
}
