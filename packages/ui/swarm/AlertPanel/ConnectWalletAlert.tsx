import config from '@swarm/core/config'
import useVerify from '@swarm/core/hooks/useVerify'
import { useAccount, useConnectWallet } from '@swarm/core/web3'
import { ExtractProps } from '@swarm/types/props'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Flash } from 'rimble-ui'

import ConnectedSuccessfullyModal from '../ConnectionModal/ConnectedSuccessfullyModal'

import Alert from './Alert'
import AlertLink from './AlertLink'

const { passportLinkingYourWallet } = config.resources.docs.coreConcepts

interface ConnectWalletAlertProps extends ExtractProps<typeof Flash> {
  title?: string
  content?: string
}

const ConnectWalletAlert = ({
  title,
  content,
  ...props
}: ConnectWalletAlertProps) => {
  const { t } = useTranslation(['alerts', 'common'])
  const account = useAccount()
  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const { verify } = useVerify()

  const connectWallet = useConnectWallet(
    (success) => success && setSuccessModalOpen(success),
  )

  const closeSuccessModal = () => setSuccessModalOpen(false)

  return (
    <>
      <Alert
        title={title ?? t('connect.title')}
        controls={
          <>
            <Button
              onClick={() => {
                connectWallet()
              }}
              size="medium"
              px={3}
              mr="24px"
              fontWeight={4}
            >
              {t('common:connect')}
            </Button>
            <AlertLink href={passportLinkingYourWallet} target="_blank">
              {t('connect.link')}
            </AlertLink>
          </>
        }
        {...props}
      >
        {content ?? t('connect.content')}
      </Alert>
      {successModalOpen && (
        <ConnectedSuccessfullyModal
          address={account || ''}
          onClose={closeSuccessModal}
          onNext={verify}
        />
      )}
    </>
  )
}

export default ConnectWalletAlert
