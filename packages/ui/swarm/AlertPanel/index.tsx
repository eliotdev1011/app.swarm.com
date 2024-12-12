import useFeatureFlags, {
  FlaggedFeatureName,
} from '@swarm/core/hooks/data/useFeatureFlags'
import { KycProvider, Tier } from '@swarm/core/shared/enums'
import {
  useInitiated,
  useIsLoggedIn,
  useKycProvider,
  useTier,
} from '@swarm/core/state/hooks'
import {
  isNetworkSupported,
  useAccount,
  useWalletNetworkId,
} from '@swarm/core/web3'
import { useTranslation } from 'react-i18next'

import ChangeNetworkAlert from './ChangeNetworkAlert'
import CompletePassportAlert from './CompletePassportAlert'
import CompleteSignInAlert from './CompleteSignInAlert'
import ConnectWalletAlert from './ConnectWalletAlert'

interface AlertPanelProps {
  page?: 'wallet' | 'staking'
  show?: boolean
  promptSignIn?: boolean
  promptPassport?: boolean
}

const AlertPanel = ({
  show = true,
  promptSignIn = false,
  promptPassport = true,
  page,
}: AlertPanelProps) => {
  const { t } = useTranslation('alerts')
  const account = useAccount()
  const initiated = useInitiated()
  const networkId = useWalletNetworkId()
  const tier = useTier()
  const kycProvider = useKycProvider()
  const isLoggedIn = useIsLoggedIn()
  const { checkFeature } = useFeatureFlags()

  if (!initiated || !show) {
    return null
  }

  if (!account) {
    return (
      <ConnectWalletAlert
        maxWidth={['auto', 'auto', '735px']}
        {...(page === 'staking' && {
          content: t('connect.staking.content'),
        })}
      />
    )
  }

  if (!isNetworkSupported(networkId)) {
    return <ChangeNetworkAlert />
  }

  if (
    checkFeature(FlaggedFeatureName.completePassportBanner) &&
    promptPassport &&
    (tier === Tier.tier0 ||
      (tier === Tier.tier1 && kycProvider === KycProvider.yes))
  ) {
    return <CompletePassportAlert maxWidth={['auto', 'auto', '735px']} />
  }

  if (promptSignIn && !isLoggedIn) {
    return (
      <CompleteSignInAlert
        maxWidth={['auto', 'auto', '735px']}
        {...(page === 'wallet' && {
          title: t('signIn.wallet.title'),
          content: t('signIn.wallet.content'),
        })}
      />
    )
  }

  return null
}

export default AlertPanel
