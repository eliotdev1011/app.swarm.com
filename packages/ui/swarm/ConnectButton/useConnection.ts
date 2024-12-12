import {
  useAccount,
  useConnectWallet,
  useDisconnectWallet,
} from '@swarm/core/web3'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { useSnackbar } from '../Snackbar'
import { AlertVariant } from '../Snackbar/types'

const useConnection = (onConnect?: () => void, onDisconnect?: () => void) => {
  const { addAlert } = useSnackbar()
  const { t } = useTranslation('common')
  const account = useAccount()

  const connect = useConnectWallet(
    useCallback(
      (success: boolean) => {
        if (success) {
          addAlert(t('walletConnected'), {
            variant: AlertVariant.success,
          })
          onConnect?.()
        }
      },
      [addAlert, onConnect, t],
    ),
  )

  const disconnect = useDisconnectWallet(
    useCallback(
      (success: boolean) => {
        if (success) {
          addAlert(t('userDisconnected'), {
            variant: AlertVariant.warning,
          })
          onDisconnect?.()
        }
      },
      [onDisconnect, addAlert, t],
    ),
  )

  return {
    account,
    isConnected: !!account,
    connect,
    disconnect,
  }
}

export default useConnection
