import { getCurrentConfig } from '@swarm/core/observables/configForNetwork'
import { getNetworkById } from '@swarm/core/shared/utils'
import { getLastUsedNetworkId } from '@swarm/core/web3'
import { ChildrenProps } from '@swarm/types'
import { generatePath, Link as RouterLink } from 'react-router-dom'

import { ROUTES } from 'src/routes'

const { usdcAddress, xGoldBundleAddress } = getCurrentConfig()

const TradeRouterLink = ({ children }: ChildrenProps) => {
  const networkName = getNetworkById(getLastUsedNetworkId())?.networkName

  return (
    <RouterLink
      to={{
        pathname: generatePath(ROUTES.DOTC_CATEGORY, {
          category: 'gold',
        }),
        hash: 'create-offer',
        search: `offer=${usdcAddress}&for=${xGoldBundleAddress}&network=${networkName}`,
      }}
      style={{ textDecoration: 'none' }}
    >
      {children}
    </RouterLink>
  )
}

export default TradeRouterLink
