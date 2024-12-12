import { Close, Done } from '@rimble/icons'
import { Tier } from '@swarm/core/shared/enums'
import { selectTier } from '@swarm/core/state/selectors/user'
import useSelector from '@swarm/core/state/useSelector'
import LinkButton from '@swarm/ui/swarm/Buttons/LinkButton'
import match from 'conditional-expression'
import { useTranslation } from 'react-i18next'
import { Box, Button, Text } from 'rimble-ui'

import OverviewCardsContainer from './OverviewCardsContainer'
import Tier2Card from './Tier2Card'

const Tier2YotiDocScan = () => {
  const { t } = useTranslation(['onboarding'])
  const tier = useSelector(selectTier)

  return (
    <>
      <Text.p color="grey" m="0">
        {match(tier)
          .equals(Tier.tier1)
          .then(t('overview.unlimitedTrading.noActionRequired'))
          .equals(Tier.tier2)
          .then(t('overview.unlimitedTrading.accountApproved'))
          .equals(Tier.tier99)
          .then(t('overview.unlimitedTrading.accountNotApproved'))
          .else(undefined)}
      </Text.p>
      <OverviewCardsContainer>
        <Tier2Card
          icon={match(tier)
            .equals(Tier.tier2)
            .then(<Done color="white" />)
            .equals(Tier.tier99)
            .then(<Close color="white" />)
            .else(undefined)}
          iconColor={match(tier)
            .equals(Tier.tier2)
            .then('primary')
            .equals(Tier.tier99)
            .then('danger')
            .else(undefined)}
          title={match(tier)
            .equals(Tier.tier2)
            .then(t('overview.steps.cards.5.accountApproved'))
            .equals(Tier.tier99)
            .then(t('overview.steps.cards.5.accountNotApproved'))
            .else(t('overview.steps.cards.5.finalApproval'))}
          description={match(tier)
            .equals(Tier.tier1)
            .then(t('overview.steps.cards.5.pendingDescription'))
            .else(undefined)}
          isActive={tier !== Tier.tier2 && tier !== Tier.tier99}
          hideIndicator={tier === Tier.tier2 || tier === Tier.tier99}
        >
          {match(tier)
            .equals(Tier.tier2)
            .then(
              <Box>
                <Text color="grey" whiteSpace="pre-line">
                  {t('overview.steps.cards.5.approvedDescription')}
                </Text>
                <LinkButton mt={3} label={t('startTrading')} pathname="/swap" />
              </Box>,
            )
            .equals(Tier.tier99)
            .then(
              <Text color="grey" whiteSpace="pre-line">
                {t('overview.steps.cards.5.rejectionDescription')}
              </Text>,
            )
            .else(
              <Box>
                <Button
                  size="medium"
                  mt="24px"
                  contrastColor="grey"
                  mainColor="#E9EAF2"
                  disabled
                >
                  {t('overview.steps.cards.5.approvalPending')}
                </Button>
              </Box>,
            )}
        </Tier2Card>
      </OverviewCardsContainer>
    </>
  )
}

export default Tier2YotiDocScan
