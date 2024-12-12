import api from '@swarm/core/services/api'
import edgeTag from '@swarm/core/services/edgeTag'
import { VerificationStatus } from '@swarm/core/shared/enums'
import { useYotiDocScanSessionIdLocalStorage } from '@swarm/core/shared/localStorage'
import { getVerificationStep } from '@swarm/core/shared/utils'
import { connect } from '@swarm/core/state/AppContext'
import { docScanSessionResults } from '@swarm/core/state/actions/users'
import { useIsLoggedIn } from '@swarm/core/state/hooks'
import { useAccount, useConnectWallet } from '@swarm/core/web3'
import { AppState, DispatchWithThunk } from '@swarm/types/state'
import { useSnackbar } from '@swarm/ui/swarm/Snackbar'
import { AlertVariant } from '@swarm/ui/swarm/Snackbar/types'
import match from 'conditional-expression'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useCookies } from 'react-cookie'
import { useTranslation } from 'react-i18next'
import { useHistory, useLocation } from 'react-router'
import { BooleanParam, StringParam, useQueryParam } from 'use-query-params'

import CompleteRegistration from 'src/components/Onboarding/CompleteRegistration'
import Overview from 'src/components/Onboarding/Overview'
import VerifyBank from 'src/components/Onboarding/VerifyBank'
import VerifyIdentity from 'src/components/Onboarding/VerifyIdentity'
import OnboardVouchersUserMessage from 'src/components/Vouchers/OnboardVouchersUserMessage'

const DOCSCAN_STATUS_QUERY_PARAM = 'docscan'
const IS_COMING_FROM_WIDGET_QUERY_PARAM = 'is_coming_from_widget'

interface OnboardingDerivedProps extends Record<string, unknown> {
  currentStep: number
  sessionResults: (sessionID: string) => void
}

const OnBoardingPage = ({
  currentStep,
  sessionResults,
}: OnboardingDerivedProps) => {
  const { t } = useTranslation(['alerts'])
  const account = useAccount()
  const connectWallet = useConnectWallet()
  const { addAlert } = useSnackbar()
  const availableStep = !account ? 1 : currentStep
  const [stepOpen, setStepOpen] = useState<number | null>(null)
  const { search } = useLocation()
  const isUserLoggedIn = useIsLoggedIn()
  const [cookies] = useCookies([edgeTag.COOKIES_USER_ID_KEY])
  const isVouchersUserOnboarding = search.includes(
    'vouchers_user_redeeming_voucher=true',
  )

  const { value: sessionID } = useYotiDocScanSessionIdLocalStorage()
  const history = useHistory()

  const [docsanStatus] = useQueryParam(DOCSCAN_STATUS_QUERY_PARAM, StringParam)

  const [isComingFromWidget] = useQueryParam(
    IS_COMING_FROM_WIDGET_QUERY_PARAM,
    BooleanParam,
  )

  useEffect(() => {
    switch (docsanStatus) {
      case 'success':
        if (sessionID !== null) {
          sessionResults(sessionID)
        }
        break
      case 'error':
        addAlert(t('docScan.error'), {
          variant: AlertVariant.error,
        })
        break
      default:
        break
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docsanStatus, sessionID])

  useEffect(() => {
    window.onpopstate = () => {
      if (stepOpen) {
        setStepOpen(null)
      }
    }
    return () => {
      window.onpopstate = null
    }
  }, [stepOpen])

  const openStep = useCallback(
    async (step: number) => {
      if (step === 1) {
        if (await connectWallet()) {
          setStepOpen(currentStep)
        }
      } else {
        history.push(history.location)
        setStepOpen(step)
      }
    },
    [connectWallet, currentStep, history],
  )

  const nextStep = useCallback(() => {
    if (stepOpen === 1) {
      setStepOpen(2)
    } else if (availableStep < 5) {
      setStepOpen(availableStep)
    } else {
      setStepOpen(null)
    }
  }, [availableStep, stepOpen])

  const closeStep = useCallback(() => {
    setStepOpen(null)
  }, [])

  // Communicate to widget that the onboarding has been completed
  useEffect(() => {
    if (currentStep < 5 || isComingFromWidget === false) {
      return
    }

    const parentWindow = window.opener
    if (parentWindow !== null) {
      parentWindow.postMessage('onboardingCompleted', '*')
    }
  }, [currentStep, isComingFromWidget])

  // Handle the case where a tier1 o tier2 verified user signs the onboarding message on step 2
  const lastCurrentStepRef = useRef<number>(currentStep)
  useEffect(() => {
    if (lastCurrentStepRef.current === 2 && currentStep >= 5) {
      history.push('/swap')
      return
    }

    lastCurrentStepRef.current = currentStep
  }, [currentStep, history])

  useEffect(() => {
    edgeTag.tagStartOnboarding()
  }, [])

  useEffect(() => {
    const edgeTagUserId = cookies?.[edgeTag.COOKIES_USER_ID_KEY]
    if (isUserLoggedIn && edgeTagUserId) {
      api.sendEdgetagUserId(edgeTagUserId)
    }
  }, [cookies, isUserLoggedIn])

  return (
    <>
      <OnboardVouchersUserMessage
        visible={isVouchersUserOnboarding}
        availableStep={availableStep}
      />
      {match(stepOpen)
        .equals(3)
        .then(
          <VerifyIdentity
            isVouchersUserOnboarding={isVouchersUserOnboarding}
            onNext={nextStep}
            onClose={closeStep}
          />,
        )
        .equals(5)
        .then(<VerifyBank onClose={closeStep} />)
        .equals(6)
        .then(<CompleteRegistration onNext={nextStep} />)
        .else(
          <Overview
            step={availableStep}
            openStep={openStep}
            onNext={nextStep}
          />,
        )}
    </>
  )
}
const mapDispatchToProps = (dispatch: DispatchWithThunk<AppState>) => ({
  sessionResults: (sessionId: string) =>
    dispatch(docScanSessionResults(sessionId)),
})

const mapStateToProps = ({ user }: AppState) => {
  const { verificationStatus } = user || {
    verificationStatus: VerificationStatus.notVerified,
  }

  return {
    currentStep: getVerificationStep(verificationStatus),
  }
}

export default connect<OnboardingDerivedProps>(
  mapStateToProps,
  mapDispatchToProps,
)(OnBoardingPage)
