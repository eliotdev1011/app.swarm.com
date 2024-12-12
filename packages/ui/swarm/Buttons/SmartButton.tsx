import { FORBIDDEN_TIERS } from '@swarm/core/shared/consts'
import { Tier } from '@swarm/core/shared/enums'
import { tierAtLeast } from '@swarm/core/shared/utils'
import { useInitiated, useIsLoggedIn, useTier } from '@swarm/core/state/hooks'
import {
  isNetworkSupported as checkNetworkSupported,
  useAccount,
  useWalletNetworkId,
} from '@swarm/core/web3'
import { ExtractProps } from '@swarm/types/props'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'
import { Button } from 'rimble-ui'

import ConnectWalletButton from './ConnectWalletButton'
import LoaderButton from './LoaderButton'
import SwitchNetworkButton from './SwitchNetworkButton'
import VerifyAddressButton from './VerifyAddressButton'
export interface SmartButtonProps {
  requireTier?: Tier
  requireAccount?: boolean
  requireInitiated?: boolean
  requireLogin?: boolean
  loading?: boolean
}

const SmartButton = ({
  requireInitiated = false,
  requireAccount = false,
  requireTier = false,
  requireLogin = false,
  ...props
}: SmartButtonProps & ExtractProps<typeof Button>) => {
  const initiated = useInitiated()
  const account = useAccount()
  const tier = useTier()
  const history = useHistory()
  const isLoggedIn = useIsLoggedIn()
  const { t } = useTranslation(['alerts', 'common'])

  const networkId = useWalletNetworkId()
  const isNetworkSupported = checkNetworkSupported(networkId)

  const goToOnboarding = useCallback(
    () => history.push('/onboarding'),
    [history],
  )

  if (requireInitiated && !initiated) {
    return <LoaderButton {...props} loading disabled />
  }

  if (requireAccount && !account) {
    return (
      <ConnectWalletButton
        render={(connect) => (
          <LoaderButton {...props} disabled={false} onClick={connect}>
            {t('common:connect')}
          </LoaderButton>
        )}
      />
    )
  }

  if (!isNetworkSupported && account) {
    return <SwitchNetworkButton {...props} disabled={false} loading={false} />
  }

  if (requireLogin && !isLoggedIn) {
    return (
      <VerifyAddressButton
        render={(verify) => (
          <LoaderButton {...props} disabled={false} onClick={verify}>
            {t('alerts:signIn.button')}
          </LoaderButton>
        )}
      />
    )
  }

  if (requireTier && FORBIDDEN_TIERS.includes(tier)) {
    return <LoaderButton {...props} disabled />
  }

  if (
    [Tier.tier1, Tier.tier2, Tier.admin].includes(requireTier) &&
    !tierAtLeast(requireTier)(tier)
  ) {
    return (
      <LoaderButton {...props} disabled={false} onClick={goToOnboarding}>
        {t('alerts:completePassport.button')}
      </LoaderButton>
    )
  }

  return <LoaderButton {...props} />
}

SmartButton.Outline = function OutlineButton(
  props: ExtractProps<typeof Button>,
) {
  return <SmartButton {...props} component={Button.Outline} />
}

export default SmartButton
