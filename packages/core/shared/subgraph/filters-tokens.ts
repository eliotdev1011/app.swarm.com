import { getCurrentBaseName } from '@core/shared/utils/dom'
import { TokensFilterSGQuery } from '@swarm/types/subgraph-responses'

import { BrandRoutes } from '@core/shared/enums/brand-routes'
import {
  getFintivTokensIds,
  getMattereumTokensIds,
  getOnlyBrandTokensIds,
  TokenType,
} from '@core/shared/utils'

export const excludeAllBrandingTokensFilter = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends Record<PropertyKey, any>,
  P extends PropertyKey = keyof T,
>(
  prefix: P,
) => {
  const notAllowedTokens = getOnlyBrandTokensIds('Token')
  const notAllowedXTokens = getOnlyBrandTokensIds('XToken')

  if (notAllowedTokens.length === 0) {
    return {}
  }

  return {
    [prefix]: [...notAllowedXTokens, ...notAllowedTokens],
  }
}

export const getCurrentBrandingTokens = (tokenType: TokenType) => {
  const baseName = getCurrentBaseName()

  switch (baseName) {
    case BrandRoutes.fintiv: {
      return getFintivTokensIds(tokenType)
    }
    case BrandRoutes.mattereum: {
      return getMattereumTokensIds()
    }
    default: {
      return []
    }
  }
}

export const includeBrandingTokensFilter = <T, P = keyof T>(
  tokenType: TokenType,
  filterPrefix: [P, P?],
  initialFilter?: T,
) => {
  const [prefixIn, prefixOut] = filterPrefix
    .filter((prefix) => prefix)
    .map((prefix) => `${prefix}_in`)

  const allowedTokens = getCurrentBrandingTokens(tokenType)

  return {
    and: [
      {
        [prefixIn]: allowedTokens,
      },
      prefixOut
        ? {
            [prefixOut]: allowedTokens,
          }
        : {},
      {
        ...initialFilter,
      },
    ],
  }
}

export const getTokensFilter = <T = TokensFilterSGQuery>(
  tokenType: TokenType,
  initialFilter?: T,
) => {
  const baseName = getCurrentBaseName()

  switch (baseName) {
    case BrandRoutes.fintiv:
    case BrandRoutes.mattereum: {
      return {
        ...includeBrandingTokensFilter<TokensFilterSGQuery>(
          tokenType,
          ['id'],
          initialFilter || {},
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
