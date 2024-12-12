import useAsyncState from '@swarm/core/hooks/async/useAsyncState'
import { connect } from '@swarm/core/state/AppContext'
import { resendConfirmationEmail } from '@swarm/core/state/actions/users'
import { AppState, DispatchWithThunk } from '@swarm/types/state'
import { useTranslation } from 'react-i18next'

import { useSnackbar } from '../Snackbar'
import { AlertVariant } from '../Snackbar/types'

import SecondaryButton from './SecondaryButton'

interface VerifyEmailActions extends Record<string, unknown> {
  resendEmail: () => void
}

const ResendEmailButton = ({ resendEmail, ...rest }: VerifyEmailActions) => {
  const { t } = useTranslation('onboarding')
  const { addAlert } = useSnackbar()
  const [canResend, setCanResend] = useAsyncState(true)

  const handleResendButton = () => {
    if (canResend) {
      setCanResend(false)
      resendEmail()

      setTimeout(() => {
        setCanResend(true)
      }, 60000)

      addAlert(t('email.resent'), { variant: AlertVariant.success })
    } else {
      addAlert(t('email.pleaseWait'), { variant: AlertVariant.warning })
    }
  }

  return <SecondaryButton onClick={handleResendButton} {...rest} />
}

const mapDispatchToProps = (dispatch: DispatchWithThunk<AppState>) => ({
  resendEmail: () => dispatch(resendConfirmationEmail()),
})

export default connect<
  Record<string, never>,
  Record<string, never>,
  VerifyEmailActions
>(
  null,
  mapDispatchToProps,
)(ResendEmailButton)
