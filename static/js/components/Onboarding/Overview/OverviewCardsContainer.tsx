import { Tier } from '@swarm/core/shared/enums'
import { useTier } from '@swarm/core/state/hooks'
import LinkButton from '@swarm/ui/swarm/Buttons/LinkButton'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Flex, Icon } from 'rimble-ui'
import styled from 'styled-components/macro'

const StyledWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 8px;
  margin-top: 24px;

  @media (min-width: ${({ theme }) => theme.breakpoints[0]}) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints[2]}) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-gap: 16px;
  }
`

interface OverviewCardsContainerProps {
  expanded?: boolean
  children: React.ReactNode
  onExpand?: () => void
}

const Completed = () => {
  const { t } = useTranslation(['onboarding'])
  return (
    <Flex lineHeight="button" color="black" fontWeight={500}>
      <Icon name="CheckCircle" alignItems="center" mr={1} />{' '}
      {t('overview.steps.completed')}
    </Flex>
  )
}

const OverviewCardsContainer = ({
  expanded = true,
  onExpand,
  children,
}: OverviewCardsContainerProps) => {
  const { t } = useTranslation(['onboarding'])
  const tier = useTier()

  return expanded ? (
    <StyledWrapper>{children}</StyledWrapper>
  ) : (
    <Flex alignItems="center" mt={4}>
      <Completed />
      <Button.Text onClick={onExpand}>{t('viewDetails')}</Button.Text>
      {tier === Tier.tier1 && (
        <LinkButton label={t('startTrading')} pathname="/swap" />
      )}
    </Flex>
  )
}

export default OverviewCardsContainer
