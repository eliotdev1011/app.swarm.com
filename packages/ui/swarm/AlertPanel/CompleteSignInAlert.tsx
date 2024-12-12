import config from '@swarm/core/config'
import { ExtractProps } from '@swarm/types/props'
import { useTranslation } from 'react-i18next'
import { Button, Flash, Text } from 'rimble-ui'

import VerifyAddressButton from '../Buttons/VerifyAddressButton'
import SvgIcon from '../SvgIcon'

import Alert from './Alert'
import AlertLink from './AlertLink'

const { passportLinkingYourWallet } = config.resources.docs.coreConcepts

interface CompleteSignInAlertProps extends ExtractProps<typeof Flash> {
  title?: string
  content?: string
}

const CompleteSignInAlert = ({
  title,
  content,
  ...props
}: CompleteSignInAlertProps) => {
  const { t } = useTranslation(['alerts'])

  return (
    <Alert
      title={title ?? t('signIn.title')}
      controls={
        <>
          <VerifyAddressButton
            render={(verify) => (
              <Button
                onClick={verify}
                size="medium"
                px={3}
                mr="24px"
                fontWeight={4}
                lineHeight="20px"
              >
                <Text.span mr={2}>
                  <SvgIcon
                    name="Passport"
                    height="18px"
                    style={{ paddingTop: '1px' }}
                  />
                </Text.span>

                {t('signIn.button')}
              </Button>
            )}
          />
          <AlertLink href={passportLinkingYourWallet} target="_blank">
            {t('signIn.link')}
          </AlertLink>
        </>
      }
      {...props}
    >
      {content ?? t('signIn.content')}
    </Alert>
  )
}

export default CompleteSignInAlert
