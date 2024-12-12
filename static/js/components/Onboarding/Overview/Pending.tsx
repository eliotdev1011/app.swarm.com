import { ExtractProps } from '@swarm/types/props'
import { useTranslation } from 'react-i18next'
import { Flex, Icon, Text } from 'rimble-ui'

const Pending = (props: ExtractProps<typeof Flex>) => {
  const { t } = useTranslation('onboarding')
  return (
    <Flex color="primary" alignItems="center" {...props}>
      <Icon name="AccessTime" mr={2} size="28px" />
      <Text.span lineHeight="button">
        {t('overview.steps.cards.3.pending')}
      </Text.span>
    </Flex>
  )
}

export default Pending
