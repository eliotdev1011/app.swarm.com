import {
  isNetworkSupported as checkNetworkSupported,
  switchNetwork,
  useStoredNetworkId,
  useWalletNetworkId,
} from '@swarm/core/web3'
import { ExtractProps } from '@swarm/types/props'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'rimble-ui'

import LoaderButton from './LoaderButton'

export interface SwitchNetworkButtonProps {
  loading?: boolean
}

const SwitchNetworkButton = ({
  ...props
}: SwitchNetworkButtonProps & ExtractProps<typeof Button>) => {
  const { t } = useTranslation('common')

  const networkId = useWalletNetworkId()
  const desiredNetworkId = useStoredNetworkId()
  const isNetworkSupported = checkNetworkSupported(networkId)
  const changeNetwork = useCallback(
    () => switchNetwork(desiredNetworkId),
    [desiredNetworkId],
  )

  if (isNetworkSupported) return null

  return (
    <LoaderButton {...props} onClick={changeNetwork}>
      {t('switchNetwork')}
    </LoaderButton>
  )
}

export default SwitchNetworkButton
