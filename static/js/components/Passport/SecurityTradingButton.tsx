import { Tier } from '@swarm/core/shared/enums'
import { SofStatus } from '@swarm/types/api-responses/public-profile.response'
import StatusBlock from '@swarm/ui/presentational/StatusBlock'
import SmartButton from '@swarm/ui/swarm/Buttons/SmartButton'
import match from 'conditional-expression'
import { useTranslation } from 'react-i18next'
import { Text } from 'rimble-ui'

import { useInvestSecurityContext } from '../Invest/InvestSecurityContext'

export const SecurityTradingButton = () => {
  const { sofStatus, checkUserSofStatus } = useInvestSecurityContext()
  const { t } = useTranslation('passport')

  const isNotStarted = sofStatus === SofStatus.NotStarted

  if (isNotStarted)
    return (
      <SmartButton
        requireTier={Tier.tier1}
        mt="4px"
        height="40px"
        onClick={checkUserSofStatus}
      >
        {t('myDetails.enable')}
      </SmartButton>
    )

  return (
    <StatusBlock
      iconSize="14"
      iconColor={match(sofStatus)
        .equals(SofStatus.Approved)
        .then('success')
        .equals(SofStatus.InProgress)
        .then('warning')
        .equals(SofStatus.PendingApproval)
        .then('warning')
        .else('danger')}
      content={
        <Text color="black" fontWeight={4} fontSize={2}>
          {match(sofStatus)
            .equals(SofStatus.Approved)
            .then(t('sofStatus.approved'))
            .equals(SofStatus.InProgress)
            .then(t('sofStatus.suspended'))
            .equals(SofStatus.PendingApproval)
            .then(t('sofStatus.suspended'))
            .else(t('sofStatus.rejected'))}
        </Text>
      }
    />
  )
}
