import useQueryString from '@swarm/core/hooks/useQueryString'
import api from '@swarm/core/services/api'
import { RequestStatus } from '@swarm/core/shared/enums'
import { connect } from '@swarm/core/state/AppContext'
import { profileUpdated } from '@swarm/core/state/actions/users'
import { ProfileResponse } from '@swarm/types/api-responses'
import { AppState, DispatchWithThunk, UserProfile } from '@swarm/types/state'
import Content from '@swarm/ui/presentational/Content'
import Feedback, {
  FlashMessageVariant,
} from '@swarm/ui/presentational/Feedback'
import { useSnackbar } from '@swarm/ui/swarm/Snackbar'
import { AlertVariant } from '@swarm/ui/swarm/Snackbar/types'
import match from 'conditional-expression'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { Box, Button, Link, Loader, Text } from 'rimble-ui'

import OnboardingHeader from 'src/components/Onboarding/OnboardingHeader'

interface EmailVerificationLandingPageStateProps
  extends Record<string, unknown> {
  user: UserProfile
}
interface EmailVerificationLandingPageActions extends Record<string, unknown> {
  updateProfile: (profile: ProfileResponse) => void
}

const EmailVerificationLandPage = ({
  user,
  verify,
  updateProfile,
}: EmailVerificationLandingPageStateProps &
  EmailVerificationLandingPageActions) => {
  const { t } = useTranslation(['onboarding'])
  const query = useQueryString()
  const { addAlert } = useSnackbar()
  const history = useHistory()
  const [status, setStatus] = useState(RequestStatus.notStarted)

  const loading = status === RequestStatus.loading

  const goToOnboarding = useCallback(
    () => history.push('/onboarding'),
    [history],
  )
  const goToSwap = useCallback(() => history.push('/swap'), [history])

  useEffect(() => {
    if (status === RequestStatus.notStarted && query.email && query.code) {
      setStatus(RequestStatus.loading)
      api
        .verifyEmail(query.email, query.code)
        .then(async () => {
          try {
            const profile = await api.profile()
            updateProfile(profile)

            addAlert(t('verifyEmail.verifiedSuccess'), {
              variant: AlertVariant.success,
            })

            goToSwap()
          } catch {
            // do nothing
          }

          setStatus(RequestStatus.success)
        })
        .catch(() => {
          setStatus(RequestStatus.error)
        })
    }
  }, [
    verify,
    query.email,
    query.code,
    status,
    user.verificationStatus,
    history,
    updateProfile,
    addAlert,
    t,
    goToSwap,
  ])

  return (
    <Box
      width="100vw"
      minHeight="100vh"
      bg="background"
      display="flex"
      flexDirection="column"
    >
      <OnboardingHeader
        header={t('verifyEmail.header')}
        subheader={t('verifyEmail.subheader')}
      />
      <Content center bg="background">
        <Feedback
          title={t('verifyEmail.landingPage.header')}
          flashMessage={match(status)
            .equals(RequestStatus.success)
            .then(t('verifyEmail.landingPage.successMessage'))
            .equals(RequestStatus.error)
            .then(t('verifyEmail.landingPage.errorMessage'))
            .else(undefined)}
          flashMessageVariant={match(status)
            .equals(RequestStatus.success)
            .then(FlashMessageVariant.success)
            .equals(RequestStatus.error)
            .then(FlashMessageVariant.danger)
            .else(undefined)}
          body={match(status)
            .equals(RequestStatus.loading)
            .then(
              <Box display="flex" alignItems="center">
                <Loader mr={3} size="40px" />
                <Text>{t('verifyEmail.landingPage.details')}</Text>
              </Box>,
            )
            .equals(RequestStatus.success)
            .then(
              <>
                <Text>{t('verifyEmail.landingPage.successDetails')}</Text>
                <Link href="!#">
                  {t('verifyEmail.landingPage.whyShouldIWait')}
                </Link>
              </>,
            )
            .equals(RequestStatus.error)
            .then(<Text.p>{t('verifyEmail.landingPage.errorDetails')}</Text.p>)
            .else(null)}
          controls={
            <Button.Outline
              size="medium"
              px={3}
              mt={4}
              width="fit-content"
              color="primary"
              border="1.5px solid"
              borderColor="primary"
              disabled={loading}
              onClick={goToOnboarding}
            >
              {t(
                `verifyEmail.landingPage.${
                  status === RequestStatus.error
                    ? 'goToOnBoarding'
                    : 'goToPassport'
                }`,
              )}
            </Button.Outline>
          }
        />
      </Content>
    </Box>
  )
}

const mapStateToProps = ({ user }: AppState) => ({ user })

const mapDispatchToProps = (dispatch: DispatchWithThunk<AppState>) => ({
  updateProfile: (profile: ProfileResponse) =>
    dispatch(profileUpdated(profile)),
})

export default connect<
  Record<string, never>,
  EmailVerificationLandingPageStateProps,
  EmailVerificationLandingPageActions
>(
  mapStateToProps,
  mapDispatchToProps,
)(EmailVerificationLandPage)
