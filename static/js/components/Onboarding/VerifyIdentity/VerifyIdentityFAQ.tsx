import config from '@swarm/core/config'
import Alert from '@swarm/ui/swarm/AlertPanel/Alert'
import AlertLink from '@swarm/ui/swarm/AlertPanel/AlertLink'
import { useTranslation } from 'react-i18next'

const { coreConcepts } = config.resources.docs

const VerifyIdentityFAQ = () => {
  const { t } = useTranslation(['onboarding'])

  return (
    <Alert
      title={t('verifyIdentity.faq.title')}
      controls={
        <AlertLink href={coreConcepts.passport} target="_blank">
          {t('verifyIdentity.faq.link')}
        </AlertLink>
      }
      mt="48px"
    >
      {t('verifyIdentity.faq.description')}
    </Alert>
  )
}

export default VerifyIdentityFAQ
