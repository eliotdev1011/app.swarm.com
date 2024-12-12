import config from '@swarm/core/config'
import { useTranslation } from 'react-i18next'
import { Icon, Link, Text } from 'rimble-ui'

import { XGoldInfoDisclamerWrapper } from './styled-components'

const disclamerLink = config.resources.docs.terms.disclaimer

const XGoldInfoPopupDisclamer = () => {
  const { t } = useTranslation('wallets')

  return (
    <XGoldInfoDisclamerWrapper>
      <Icon size="15px" name="SpeakerNotes" color="orange-dark" />
      <Text.span color="text" fontSize="12px" ml="10px">
        {t('goldTokens.bundles.disclaimer.main')}
        <Link
          href={disclamerLink}
          target="_blank"
          color="text"
          fontWeight={3}
          fontSize={0}
          lineHeight="copy"
          hoverColor="orange-dark"
        >
          {t('goldTokens.bundles.disclaimer.here')}
        </Link>
        .
      </Text.span>
    </XGoldInfoDisclamerWrapper>
  )
}

export default XGoldInfoPopupDisclamer
