import config from '@swarm/core/config'
import useScript from '@swarm/core/hooks/dom/useScript'
import YotiButtonInit from '@swarm/core/shared/utils/yoti/init'
import { connect } from '@swarm/core/state/AppContext'
import { yotiTokenSent } from '@swarm/core/state/actions/users'
import { Yoti } from '@swarm/types/declarations'
import { AppState, DispatchWithThunk } from '@swarm/types/state'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Box } from 'rimble-ui'

import KycCard from './KycCard'

let yotiInitiated = false

const { scriptStatusUrl, clientSdkId, scenarioId } = config.yoti

interface YotiCardActions extends Record<string, unknown> {
  sendYotiToken: (token: string, done: () => void) => void
}

const YotiAppCard = ({ sendYotiToken }: YotiCardActions) => {
  const { t } = useTranslation(['onboarding'])
  const scriptStatus = useScript(scriptStatusUrl)
  const yotiButtonRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let yotiInstance: Yoti

    if (
      scriptStatus === 'ready' &&
      !yotiInitiated &&
      yotiButtonRef.current?.id
    ) {
      yotiInstance = YotiButtonInit(
        yotiButtonRef.current.id,
        {
          label: t(`verifyIdentity.cards.yoti.button`),
          align: 'center', // "left" | "right"
          width: 'full', // "auto" | "full"
        },
        scenarioId,
        clientSdkId,
        sendYotiToken,
        () => {
          yotiInitiated = true
        },
      )
    }

    return () => {
      if (yotiInstance) {
        yotiInstance.destroy()
      }
      yotiInitiated = false
    }
  }, [sendYotiToken, scriptStatus, t])

  return (
    <KycCard
      vendor="yoti"
      button={<Box height="42px" ref={yotiButtonRef} id="yoti-button" />}
    />
  )
}

const mapDispatchToProps = (dispatch: DispatchWithThunk<AppState>) => ({
  sendYotiToken: (token: string) => dispatch(yotiTokenSent(token)),
})

export default connect<
  Record<string, never>,
  Record<string, never>,
  YotiCardActions
>(
  null,
  mapDispatchToProps,
)(YotiAppCard)
