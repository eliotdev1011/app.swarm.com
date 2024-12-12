import { getAppConfig } from '@swarm/core/config'
import { useToggle } from '@swarm/core/hooks/state/useToggle'
import api from '@swarm/core/services/api'
import { KycStatus } from '@swarm/core/shared/enums'
import repeat from '@swarm/core/shared/utils/helpers/repeat'
import { ProfileResponse } from '@swarm/types/api-responses'
import { useSnackbar } from '@swarm/ui/swarm/Snackbar'
import { AlertVariant } from '@swarm/ui/swarm/Snackbar/types'
import { useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import KycCard from './KycCard'
import StyledKycButton from './StyledKycButton'
import SumsubKycModal from './SumsubKycModal'

const POLLING_PROFILE_INTERVAL = 2000

interface SumsubKycCardProps {
  kycStatus: KycStatus
  isProvider: boolean
  updateProfile: (profile: ProfileResponse) => void
}

const SumsubKycCard = (props: SumsubKycCardProps) => {
  const { kycStatus, isProvider, updateProfile } = props

  const { addAlert } = useSnackbar()
  const { t } = useTranslation(['onboarding'])

  const isPollingProfileRef = useRef<boolean>(false)

  const {
    isOn: isSumsubKycModalOpen,
    on: openSumsubKycModal,
    off: closeSumsubKycModal,
  } = useToggle(false)

  const handleCreateKYCSession = async () => {
    try {
      const sourceKey = getAppConfig().sourceKey
      await api.createSumsubKYCSession(sourceKey)
      openSumsubKycModal()
    } catch (error) {
      addAlert(t(`verifyIdentity.cards.sumsub.sessionCreationError`), {
        variant: AlertVariant.error,
      })
    }
  }

  const startProfilePolling = useCallback(async () => {
    isPollingProfileRef.current = true
    await repeat(async (stop) => {
      try {
        const profile = await api.profile()

        if (profile.attributes.kyc_status !== KycStatus.pendingProvider) {
          isPollingProfileRef.current = false
        }

        if (isPollingProfileRef.current === false) {
          stop()

          updateProfile(profile)
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(
          'There was an error while polling the profile after submitting Sumsub KYC',
          error,
        )
      }
    }, POLLING_PROFILE_INTERVAL)
  }, [updateProfile])

  useEffect(() => {
    if (
      kycStatus === KycStatus.pendingProvider &&
      isPollingProfileRef.current === false
    ) {
      startProfilePolling()
    }

    return () => {
      // Stop profile polling on unmount
      isPollingProfileRef.current = false
    }
  }, [kycStatus, startProfilePolling])

  const onSumsubSubmitSuccess = useCallback<() => Promise<void>>(async () => {
    // 1) Fetch to get the latest profile before even closing the modal
    try {
      const profile = await api.profile()
      updateProfile(profile)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(
        'There was an error fetching the profile after submitting Sumsub KYC',
        error,
      )
    }

    // 2) Start polling the profile in the background
    startProfilePolling()

    // 3) Close the modal once everything is setup
    closeSumsubKycModal()

    // 4) Show snackbar message for reinforcement
    addAlert(t(`verifyIdentity.cards.sumsub.formSubmittedSuccessfully`), {
      variant: AlertVariant.success,
    })
  }, [closeSumsubKycModal, startProfilePolling, updateProfile, addAlert, t])

  const getButtonLabel = (): string => {
    if (isProvider === false) {
      return t(`verifyIdentity.cards.sumsub.button.start`)
    }

    if (kycStatus === KycStatus.inProgress) {
      return t(`verifyIdentity.cards.sumsub.button.resume`)
    }

    if (kycStatus === KycStatus.rejected) {
      return t(`verifyIdentity.cards.sumsub.button.rejected`)
    }

    if (kycStatus === KycStatus.pendingProvider) {
      return t(`verifyIdentity.cards.sumsub.button.pendingProvider`)
    }

    return t(`verifyIdentity.cards.sumsub.button.start`)
  }

  return (
    <>
      <KycCard
        vendor="sumsub"
        button={
          <StyledKycButton
            style={{
              textTransform: 'uppercase',
              fontSize: 12,
            }}
            onClick={handleCreateKYCSession}
          >
            {getButtonLabel()}
          </StyledKycButton>
        }
      />
      <SumsubKycModal
        isVisible={isSumsubKycModalOpen}
        onSuccess={onSumsubSubmitSuccess}
        onCancel={closeSumsubKycModal}
      />
    </>
  )
}

export default SumsubKycCard
