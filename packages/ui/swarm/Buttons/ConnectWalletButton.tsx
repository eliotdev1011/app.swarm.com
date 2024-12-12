import {
  useAccount,
  useConnectWallet,
  useDisconnectWallet,
} from '@swarm/core/web3'
import StyledButton from '@ui/presentational/StyledButton'
import { ReactElement, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import ConnectedSuccessfullyModal from '../ConnectionModal/ConnectedSuccessfullyModal'
import { useSnackbar } from '../Snackbar'
import { AlertVariant } from '../Snackbar/types'

interface Props {
  onNext?: () => void
  render?: (
    open: () => void,
    disconnect: () => void,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) => ReactElement<any, any> | null
}

const ConnectWalletButton = ({
  onNext,
  render = (open) => <StyledButton onClick={open}>Connect wallet</StyledButton>,
}: Props) => {
  const { addAlert } = useSnackbar()
  const { t } = useTranslation(['common', 'alerts'])
  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const account = useAccount()

  const connectWallet = useConnectWallet(
    useCallback(
      (success: boolean) => success && setSuccessModalOpen(success),
      [],
    ),
  )
  const disconnectWallet = useDisconnectWallet(
    useCallback(
      (success: boolean) => {
        if (success) {
          addAlert(t('common:userDisconnected'), {
            variant: AlertVariant.warning,
          })
        }
      },
      [addAlert, t],
    ),
  )

  const closeSuccessModal = useCallback(() => {
    if (successModalOpen) {
      setSuccessModalOpen(false)
    }
  }, [successModalOpen])

  const handleConnectSuccess = async () => {
    await onNext?.()
    closeSuccessModal()
  }

  const connect = () => {
    connectWallet()
  }

  const logout = () => {
    disconnectWallet()
  }

  return (
    <>
      {render(connect, logout)}
      {successModalOpen && (
        <ConnectedSuccessfullyModal
          address={account || ''}
          onClose={closeSuccessModal}
          onNext={handleConnectSuccess}
          nextButtonLabel={t('alerts:signIn.button')}
        />
      )}
    </>
  )
}

export default ConnectWalletButton
