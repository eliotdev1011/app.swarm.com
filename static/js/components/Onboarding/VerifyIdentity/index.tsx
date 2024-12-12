import { FlaggedFeatureName } from '@swarm/core/hooks/data/useFeatureFlags'
import { KycProvider, KycStatus } from '@swarm/core/shared/enums'
import { connect } from '@swarm/core/state/AppContext'
import { profileUpdated } from '@swarm/core/state/actions/users'
import { ProfileResponse } from '@swarm/types/api-responses'
import { AppState, DispatchWithThunk } from '@swarm/types/state'
import Content from '@swarm/ui/presentational/Content'
import { FlashMessageVariant } from '@swarm/ui/presentational/Feedback'
import FlaggedFeature from '@swarm/ui/swarm/FlaggedFeature'
import match from 'conditional-expression'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Flex, Heading } from 'rimble-ui'

import OnboardingHeader from 'src/components/Onboarding/OnboardingHeader'
import VerifyIdentityFAQ from 'src/components/Onboarding/VerifyIdentity/VerifyIdentityFAQ'

import KycFeedback from './KycFeedback'
import SumsubKycCard from './SumsubKycCard'
import YesKycCard from './YesKycCard'
import YotiAppCard from './YotiAppCard'
import YotiDocScanCard from './YotiDocScanCard'

interface VerifyIdentityProps extends Record<string, unknown> {
  onNext: () => void
  onClose: () => void
  isVouchersUserOnboarding: boolean
}

interface VerifyIdentityStateProps extends Record<string, unknown> {
  status: KycStatus
  provider: KycProvider
  docScanOutcomeReason: string
}

interface VerifyIdentityActionsProps extends Record<string, unknown> {
  updateProfile: (profile: ProfileResponse) => void
}

const VerifyIdentity = ({
  status,
  provider,
  docScanOutcomeReason,
  onNext,
  onClose,
  isVouchersUserOnboarding,
  updateProfile,
}: VerifyIdentityStateProps &
  VerifyIdentityProps &
  VerifyIdentityActionsProps) => {
  const { t } = useTranslation(['onboarding'])
  const [currentContent, setCurrentContent] = useState(status)

  useEffect(() => {
    if (status === KycStatus.approved) {
      onNext()
    }
  }, [onNext, status])

  useEffect(() => {
    setCurrentContent(status)
  }, [status])

  const restart = () => {
    setCurrentContent(KycStatus.notStarted)
  }

  return (
    <Flex
      width="100vw"
      minHeight="100vh"
      bg="background"
      flexDirection="column"
    >
      <OnboardingHeader
        header={t('verifyIdentity.header')}
        subheader={t('verifyIdentity.subheader')}
        button={t('verifyIdentity.headerButton')}
        onButtonClick={onClose}
        buttonIcon="NavigateBefore"
      />
      <Content centerH bg="background">
        <Box maxWidth="788px">
          {match(currentContent)
            .equals(KycStatus.pending)
            .then(
              <KycFeedback
                onClose={onClose}
                onSubmit={onClose}
                variant={FlashMessageVariant.warning}
              />,
            )
            .equals(KycStatus.rejected)
            .then(
              <KycFeedback
                onClose={onClose}
                onSubmit={restart}
                reason={docScanOutcomeReason}
                variant={FlashMessageVariant.danger}
              />,
            )
            .equals(KycStatus.failed)
            .then(
              <KycFeedback
                onClose={onClose}
                onSubmit={restart}
                variant={FlashMessageVariant.danger}
              />,
            )
            .else(
              <>
                <Heading as="h2" fontSize={3} fontWeight={5}>
                  {t('verifyIdentity.title')}
                </Heading>
                <Flex
                  justifyContent="flex-start"
                  flexDirection={['column', 'row']}
                  style={{ gap: '16px' }}
                >
                  <FlaggedFeature name={FlaggedFeatureName.yotiDocScan}>
                    <YotiDocScanCard />
                  </FlaggedFeature>
                  <SumsubKycCard
                    kycStatus={status}
                    isProvider={provider === KycProvider.sumsub}
                    updateProfile={updateProfile}
                  />
                  <FlaggedFeature name={FlaggedFeatureName.yotiApp}>
                    <YotiAppCard />
                  </FlaggedFeature>
                  <FlaggedFeature name={FlaggedFeatureName.yesKyc}>
                    {/* {When Vouchers app users onboarding to redeem their crypto, only Yoti should be available for them as KYC provider.} */}
                    {!isVouchersUserOnboarding && <YesKycCard />}
                  </FlaggedFeature>
                </Flex>
                <VerifyIdentityFAQ />
              </>,
            )}
        </Box>
      </Content>
    </Flex>
  )
}

const mapStateToProps = ({
  user: { kycStatus, kycProvider, docScanOutcomeReason },
}: AppState): VerifyIdentityStateProps => ({
  status: kycStatus,
  provider: kycProvider,
  docScanOutcomeReason,
})

const mapDispatchToProps = (dispatch: DispatchWithThunk<AppState>) => ({
  updateProfile: (profile: ProfileResponse) =>
    dispatch(profileUpdated(profile)),
})

export default connect<VerifyIdentityProps, VerifyIdentityStateProps>(
  mapStateToProps,
  mapDispatchToProps,
)(VerifyIdentity)
