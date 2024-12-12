import { FlashMessageVariant } from '@swarm/ui/presentational/Feedback'
import { useTranslation } from 'react-i18next'
import { Redirect } from 'react-router'
import { Flash, Text } from 'rimble-ui'

import { ROUTES } from 'src/routes'

function OnboardVouchersUserMessage({
  visible,
  availableStep,
}: {
  visible: boolean
  availableStep: number
}) {
  const { t } = useTranslation('vouchers')

  if (!visible) {
    return null
  }

  if (availableStep >= 5) {
    return <Redirect to={ROUTES.VOUCHERS_LIST} />
  }

  return (
    <Flash variant={FlashMessageVariant.success}>
      <Text>{t('onboarding.message')}</Text>
    </Flash>
  )
}

export default OnboardVouchersUserMessage
