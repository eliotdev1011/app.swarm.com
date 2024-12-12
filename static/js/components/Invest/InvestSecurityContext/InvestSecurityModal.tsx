/* eslint-disable @typescript-eslint/no-use-before-define */
import { BasicModalProps } from '@swarm/core/hooks/state/usePopupState'
import { useToggle } from '@swarm/core/hooks/state/useToggle'
import useVerify from '@swarm/core/hooks/useVerify'
import api from '@swarm/core/services/api'
import { GENERIC_ERROR } from '@swarm/core/services/error-handler'
import { jwtLocalStorage } from '@swarm/core/shared/localStorage/jwtLocalStorage'
import repeat from '@swarm/core/shared/utils/helpers/repeat'
import { useAccount } from '@swarm/core/web3'
import { SofStatus } from '@swarm/types/api-responses/public-profile.response'
import Dialog from '@swarm/ui/presentational/Dialog'
import { useSnackbar } from '@swarm/ui/swarm/Snackbar'
import { AlertVariant } from '@swarm/ui/swarm/Snackbar/types'
import { Formik, useFormikContext } from 'formik'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box } from 'rimble-ui'

import ConfirmModal from './ConfirmModal'
import ISForm from './ISForm'
import SoFForm from './SoFForm'
import { initialValues } from './funds.formik'
import { ISSchema, SoFSchema } from './schemas'

interface InvestSecurityModalProps extends BasicModalProps {
  step: number
}

const InvestSecurityStepModal = ({
  isOpen,
  onClose,
  step,
}: InvestSecurityModalProps) => {
  const { resetForm } = useFormikContext()
  const boxRef = useRef<HTMLElement>()

  useEffect(() => {
    if (!isOpen) {
      resetForm()
    }
  }, [isOpen, resetForm])

  useEffect(() => {
    boxRef.current?.scrollTo(0, 0)
  }, [step])

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      width={['100%', '550px']}
      minHeight="400px"
      maxHeight={['90%', '80%']}
      height="auto"
      withoutPortal
    >
      <Box
        ref={boxRef}
        maxHeight="inherit"
        overflowY="auto"
        padding="16px"
        margin="-16px"
      >
        {step === 0 && <ISForm />}
        {step === 1 && <SoFForm />}
      </Box>
    </Dialog>
  )
}

const InvestSecurityModal = ({ onClose, isOpen }: BasicModalProps) => {
  const { t } = useTranslation(['invest', 'alerts'])
  const { reportError, addAlert } = useSnackbar()
  const { verify } = useVerify()
  const authToken = jwtLocalStorage.get()
  const account = useAccount()

  const [step, setStep] = useState(0)

  const nextStep = useCallback(() => {
    setStep((currStep) => currStep + 1)
  }, [])

  const startPublicProfilePolling = useCallback(async () => {
    if (!account) return
    await repeat(
      async (stop) => {
        try {
          const profile = await api.publicProfile(account)
          const isApproved =
            profile.attributes.sof_status === SofStatus.Approved

          if (isApproved) {
            addAlert(t('alerts:securitiesGranted'), {
              variant: AlertVariant.success,
            })
            stop()
          }
        } catch (e) {
          stop()
          addAlert('An error happened while trying to verify you', {
            variant: AlertVariant.error,
          })
        }
      },
      7000,
      85,
    )
  }, [account, addAlert, t])

  const {
    isOn: isConfirmModalOpen,
    on: openConfirmModal,
    off: closeConfirmModal,
  } = useToggle()

  const validationSchema = step === 0 ? ISSchema : SoFSchema

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={async (values, actions) => {
          if (step === 0) {
            nextStep()
            return
          }

          try {
            if (!account) return
            actions.setSubmitting(true)
            if (!authToken) {
              await verify()
            }

            const profile = await api.publicProfile(account)
            const isNotStarted =
              profile.attributes.sof_status === SofStatus.NotStarted

            if (isNotStarted) {
              await api.sofVerification(values)
            }

            setStep(0)
            onClose?.()
            openConfirmModal()
            startPublicProfilePolling()
          } catch {
            reportError(GENERIC_ERROR.description)
          } finally {
            actions.setSubmitting(false)
          }
        }}
        validationSchema={validationSchema}
        validateOnChange={false}
      >
        <InvestSecurityStepModal
          isOpen={isOpen}
          onClose={() => {
            setStep(0)
            onClose?.()
          }}
          step={step}
        />
      </Formik>
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={closeConfirmModal}
        title={t('confirmationModal.title')}
        description={t('confirmationModal.description')}
      />
    </>
  )
}

export default InvestSecurityModal
