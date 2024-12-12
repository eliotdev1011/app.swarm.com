import sumsubWebSdk from '@sumsub/websdk'
import { getAppConfig } from '@swarm/core/config'
import api from '@swarm/core/services/api'
import Dialog, { DialogCloseButton } from '@swarm/ui/presentational/Dialog'
import { useEffect } from 'react'
import { Box } from 'rimble-ui'

const APPLICATION_SUBMITTED_MESSAGE_VISIBLE_TIME = 3000

interface SumsubKycModalProps {
  isVisible: boolean
  onSuccess: () => void
  onCancel: () => void
}

const SumsubKycModal = (props: SumsubKycModalProps) => {
  const { isVisible, onSuccess, onCancel } = props

  useEffect(() => {
    async function launchWebSdk() {
      const sourceKey = getAppConfig().sourceKey
      const accessToken = await api.getSumsubKYCSessionAccessToken(sourceKey)

      const sumsubWebSdkInstance = sumsubWebSdk
        .init(accessToken, () => api.getSumsubKYCSessionAccessToken(sourceKey))
        .withConf({
          lang: 'en',
        })
        .onMessage((type) => {
          if (type === 'idCheck.onApplicantSubmitted') {
            setTimeout(onSuccess, APPLICATION_SUBMITTED_MESSAGE_VISIBLE_TIME)
          }
        })
        .build()

      sumsubWebSdkInstance.launch('#sumsub-kyc-websdk-container')
    }

    if (isVisible) {
      launchWebSdk()
    }
  }, [isVisible, onSuccess, onCancel])

  return (
    <Dialog
      isOpen={isVisible}
      isFullScreen
      titleProps={{ mb: '10px' }}
      closeNode={<DialogCloseButton label="Close" onClick={onCancel} />}
      onClose={onCancel}
    >
      <Box overflowY="scroll" id="sumsub-kyc-websdk-container" />
    </Dialog>
  )
}

export default SumsubKycModal
