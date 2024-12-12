import useRequest from '@swarm/core/hooks/async/useRequest'
import api from '@swarm/core/services/api'
import { VerificationStatus } from '@swarm/core/shared/enums'
import { download } from '@swarm/core/shared/utils/dom'
import { connect } from '@swarm/core/state/AppContext'
import { initYesSignDocFlow } from '@swarm/core/state/actions/users'
import { AppState, DispatchWithThunk } from '@swarm/types/state'
import Content from '@swarm/ui/presentational/Content'
import SecondaryButton from '@swarm/ui/swarm/Buttons/SecondaryButton'
import SmartButton from '@swarm/ui/swarm/Buttons/SmartButton'
import { useSnackbar } from '@swarm/ui/swarm/Snackbar'
import { AlertVariant } from '@swarm/ui/swarm/Snackbar/types'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Card, Loader } from 'rimble-ui'

import OnboardingHeader from 'src/components/Onboarding/OnboardingHeader'

interface CompleteRegistrationProps {
  onNext: () => void
}
interface CompleteRegistrationStateProps extends Record<string, unknown> {
  verified: boolean
}
interface CompleteRegistrationActions extends Record<string, unknown> {
  signDoc: (url: string) => void
}

const CompleteRegistration = ({
  onNext,
  signDoc,
  verified = false,
}: CompleteRegistrationProps &
  CompleteRegistrationStateProps &
  CompleteRegistrationActions) => {
  const { t } = useTranslation(['onboarding'])
  const { data, loading } = useRequest(api.getToS)
  const { addAlert } = useSnackbar()

  const handleDownload = async () => {
    const newData = await api.getToS()
    download(t('signToS.pdfName'), newData?.attributes?.pdf_link)
  }

  const handleSign = async () => {
    const tosData = await api.getToS()

    const url = tosData?.attributes?.yes_link

    if (url) {
      await signDoc(url)
    }
  }

  useEffect(() => {
    if (verified) {
      onNext?.()
      addAlert(t('signToS.successMessage'), { variant: AlertVariant.success })
    }
  }, [addAlert, onNext, t, verified])

  return (
    <Box
      width="100vw"
      minHeight="100vh"
      bg="background"
      display="flex"
      flexDirection="column"
    >
      <OnboardingHeader
        header={t('signToS.header')}
        subheader={t('signToS.subHeader')}
        button={t('signToS.headerButton')}
      />
      <Content centerH bg="background">
        <Card
          width={['100%', '788px']}
          p={4}
          borderRadius={1}
          display="flex"
          justifyItems="stretch"
          alignItems="stretch"
        >
          {loading ? (
            <Loader m="auto" size="100px" />
          ) : (
            <iframe
              style={{ flex: '1 1 auto', border: 'none' }}
              title="tos"
              srcDoc={data?.attributes?.pdf_html}
            />
          )}
        </Card>
        {!loading && (
          <Card width={['100%', '788px']} p={4} borderRadius={1} mt={4}>
            <SmartButton mr={3} size="medium" onClick={handleSign}>
              {t('signToS.signButton')}
            </SmartButton>
            <SecondaryButton size="medium" onClick={handleDownload}>
              {t('signToS.downloadButton')}
            </SecondaryButton>
          </Card>
        )}
      </Content>
    </Box>
  )
}

const mapStateToProps = ({ user: { verificationStatus } }: AppState) => ({
  verified: verificationStatus === VerificationStatus.DocSignVerified,
})

const mapDispatchToProps = (dispatch: DispatchWithThunk<AppState>) => ({
  signDoc: async (url: string) => initYesSignDocFlow(url)(dispatch),
})

export default connect<
  CompleteRegistrationProps,
  CompleteRegistrationStateProps,
  CompleteRegistrationActions
>(
  mapStateToProps,
  mapDispatchToProps,
)(CompleteRegistration)
