import { BrandRoutes } from '@swarm/core/shared/enums/brand-routes'
import { getCurrentBrandingTokens } from '@swarm/core/shared/subgraph'
import { getCurrentBaseName } from '@swarm/core/shared/utils'
import { getOnlyBrandTokensIds } from '@swarm/core/shared/utils'
import { isSameEthereumAddress } from '@swarm/core/web3'
import { AbstractToken } from '@swarm/types/tokens'

export const isBrandingPoolToken = <T extends Pick<AbstractToken, 'id'>>(
  token: T,
) => {
  const baseName = getCurrentBaseName()

  if (
    [BrandRoutes.mattereum, BrandRoutes.fintiv].includes(
      baseName as BrandRoutes,
    )
  ) {
    return getCurrentBrandingTokens('Token').some((t) =>
      isSameEthereumAddress(token.id, t),
    )
  }

  return getOnlyBrandTokensIds('Token').every(
    (t) => !isSameEthereumAddress(token.id, t),
  )
}
