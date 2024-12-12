import { connect } from '@swarm/core/state/AppContext'
import { initYesFlow } from '@swarm/core/state/actions/users'
import { AppState, DispatchWithThunk } from '@swarm/types/state'
import { useTranslation } from 'react-i18next'

import KycCard from './KycCard'
import StyledKycButton from './StyledKycButton'

interface YesKycCardActions extends Record<string, unknown> {
  init: () => void
}

const YesKycCard = ({ init }: YesKycCardActions) => {
  const { t } = useTranslation(['onboarding'])

  return (
    <KycCard
      vendor="yes"
      button={
        <StyledKycButton onClick={init}>
          {t(`verifyIdentity.cards.yes.button`)}
        </StyledKycButton>
      }
    />
  )
}

const mapDispatchToProps = (
  dispatch: DispatchWithThunk<AppState>,
): YesKycCardActions => ({
  init: () => dispatch(initYesFlow()),
})

export default connect<
  Record<string, never>,
  Record<string, never>,
  YesKycCardActions
>(
  null,
  mapDispatchToProps,
)(YesKycCard)
