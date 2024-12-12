import { Close, Done } from '@rimble/icons'
import useRequest from '@swarm/core/hooks/async/useRequest'
import api from '@swarm/core/services/api'
import { Tier } from '@swarm/core/shared/enums'
import { download } from '@swarm/core/shared/utils/dom'
import { useTier } from '@swarm/core/state/hooks'
import StyledButton from '@swarm/ui/presentational/StyledButton'
import LinkButton from '@swarm/ui/swarm/Buttons/LinkButton'
import SecondaryButton from '@swarm/ui/swarm/Buttons/SecondaryButton'
import { Color } from '@swarm/ui/theme'
import match from 'conditional-expression'
import { format, parseISO } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { Box, Flex, Text } from 'rimble-ui'

import Completed from './Completed'
import OverviewCardsContainer from './OverviewCardsContainer'
import Pending from './Pending'
import StepDuration from './StepDuration'
import Tier2Card from './Tier2Card'

interface Tier2YesProps {
  openStep: (step: number) => void
  step: number
}

const Tier2Yes = ({ openStep, step }: Tier2YesProps) => {
  const { t } = useTranslation(['onboarding'])
  const tier = useTier()

  const { data, loading: paymentInfoLoading } = useRequest(api.getPaymentInfo)

  const fundsSent = data?.attributes?.status === 'sent'

  const handleDownloadSignedPdfClick = async () => {
    const info = await api.getSignedDocInfo()

    download(t('signToS.pdfName'), info.attributes.download_url)
  }

  return (
    <>
      <Text.p color="grey" m="0">
        {match(step)
          .atLeast(8)
          .then(
            match(tier)
              .equals(Tier.tier2)
              .then(t('overview.unlimitedTrading.accountApproved'))
              .equals(Tier.tier99)
              .then(t('overview.unlimitedTrading.accountNotApproved'))
              .else(undefined),
          )
          .else(t('overview.unlimitedTrading.content'))}
      </Text.p>
      <OverviewCardsContainer>
        <Tier2Card
          title={match(step)
            .atLeast(6)
            .then(t('overview.steps.cards.5.yes.verified'))
            .else(t('overview.steps.cards.5.yes.title'))}
          description={match(step)
            .atLeast(6)
            .then(undefined)
            .else(
              fundsSent
                ? t('overview.steps.cards.5.yes.fundsSent', {
                    date: format(
                      parseISO(data?.attributes?.sent_at),
                      'hh:mm aa MM/dd/yyyy',
                    ),
                  })
                : t('overview.steps.cards.5.yes.description'),
            )}
          icon={match(step)
            .atLeast(6)
            .then(<Done color="white" />)
            .else(undefined)}
          isActive={step === 5}
          step={step}
          stepCompleted={step > 5}
        >
          {match(step)
            .atLeast(6)
            .then(<Completed />)
            .else(
              <Flex alignItems="center" mt="24px">
                {fundsSent && <Pending mr={2} />}
                <StyledButton
                  onClick={() => openStep(5)}
                  style={{ width: `${fundsSent ? 'fit-content' : '100%'}` }}
                  disabled={step === 5 && paymentInfoLoading}
                >
                  {fundsSent
                    ? t('overview.steps.cards.5.yes.viewDetails')
                    : t('overview.steps.cards.5.yes.button')}
                </StyledButton>
              </Flex>,
            )}
        </Tier2Card>
        <Tier2Card
          title={match(step)
            .atLeast(7)
            .then(t('overview.steps.cards.6.completed'))
            .else(t('overview.steps.cards.6.title'))}
          description={match(step)
            .atLeast(7)
            .then(undefined)
            .equals(6)
            .then(t('overview.steps.cards.6.finalizeDescription'))
            .else(t('overview.steps.cards.6.description'))}
          icon={match(step)
            .atLeast(7)
            .then(<Done color="white" />)
            .else(undefined)}
          isActive={step === 6}
          step={step}
          stepCompleted={step > 6}
        >
          {match(step)
            .atLeast(7)
            .then(
              <SecondaryButton
                size="medium"
                mt="24px"
                style={{ width: 'fit-content' }}
                onClick={handleDownloadSignedPdfClick}
              >
                {t('overview.steps.cards.6.download')}
              </SecondaryButton>,
            )
            .equals(6)
            .then(
              <StyledButton mt="24px" onClick={() => openStep(6)}>
                {t('overview.steps.cards.6.button')}
              </StyledButton>,
            )
            .else(
              <StepDuration legend={t('overview.steps.cards.6.duration')} />,
            )}
        </Tier2Card>
        <Tier2Card
          title={match(step)
            .atLeast(8)
            .then(
              match(tier)
                .equals(Tier.tier2)
                .then(t('overview.steps.cards.7.approved'))
                .equals(Tier.tier99)
                .then(t('overview.steps.cards.7.notApproved'))
                .else(undefined),
            )
            .else(t('overview.steps.cards.7.title'))}
          description={match(step)
            .atLeast(8)
            .then(undefined)
            .equals(7)
            .then(t('overview.steps.cards.7.pendingDescription'))
            .else(t('overview.steps.cards.7.description'))}
          icon={match(step)
            .atLeast(8)
            .then(
              match(tier)
                .equals(Tier.tier2)
                .then(<Done color="white" />)
                .equals(Tier.tier99)
                .then(<Close color="white" size={30} />)
                .else(undefined),
            )
            .else(undefined)}
          isActive={step === 7}
          iconColor={match(tier)
            .equals(Tier.tier2)
            .then(Color.primary)
            .equals(Tier.tier99)
            .then(Color.dangerDark)
            .else(undefined)}
          step={step}
        >
          {match(step)
            .atLeast(8)
            .then(
              <Box>
                <Text color="grey">
                  {match(tier)
                    .equals(Tier.tier2)
                    .then(t('overview.steps.cards.7.approvedDescription'))
                    .equals(Tier.tier99)
                    .then(t('overview.steps.cards.7.notApprovedDescription'))
                    .else(undefined)}
                </Text>
                {match(tier)
                  .equals(Tier.tier2)
                  .then(
                    <LinkButton
                      mt={3}
                      label={t('startTrading')}
                      pathname="/swap"
                    />,
                  )
                  .equals(Tier.tier99)
                  .then(
                    <LinkButton
                      mt={3}
                      label={t('goToPools')}
                      pathname="/pools"
                    />,
                  )
                  .else(undefined)}
              </Box>,
            )
            .equals(7)
            .then(<Pending />)
            .else(
              <StepDuration legend={t('overview.steps.cards.7.duration')} />,
            )}
        </Tier2Card>
      </OverviewCardsContainer>
    </>
  )
}

export default Tier2Yes
