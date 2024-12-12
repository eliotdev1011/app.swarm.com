import config, { getAppConfig } from '@swarm/core/config'
import { SupportedNetworkId } from '@swarm/core/shared/enums/supported-network-id'
import { switchNetwork } from '@swarm/core/web3'
import { ExtractProps } from '@swarm/types/props'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Flash } from 'rimble-ui'

import Alert from './Alert'
import AlertLink from './AlertLink'

const { resources } = config
const { faq } = resources.docs.gettingStarted

const ChangeNetworkAlert = (props: ExtractProps<typeof Flash>) => {
  const { t } = useTranslation(['alerts'])
  const desiredNetworkId = getAppConfig().supportedChainIds[0]

  const changeNetwork = useCallback(
    () => switchNetwork(desiredNetworkId),
    [desiredNetworkId],
  )

  return (
    <Alert
      title={t('changeNetwork.title')}
      controls={
        <Button
          onClick={changeNetwork}
          size="medium"
          px={3}
          mr="24px"
          fontWeight={4}
        >
          {t('changeNetwork.button')}
        </Button>
      }
      {...props}
    >
      {t('changeNetwork.content', {
        desiredNetwork: SupportedNetworkId[desiredNetworkId],
      })}
      <br />
      <AlertLink href={faq} target="_blank">
        {t('changeNetwork.link')}
      </AlertLink>
      {t('changeNetwork.sub-content')}
    </Alert>
  )
}

export default ChangeNetworkAlert
