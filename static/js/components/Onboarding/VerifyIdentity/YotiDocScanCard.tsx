import { connect } from '@swarm/core/state/AppContext'
import { initYotiDocScan } from '@swarm/core/state/actions/users'
import { AppState, DispatchWithThunk } from '@swarm/types/state'
import { useTranslation } from 'react-i18next'

import KycCard from './KycCard'
import StyledKycButton from './StyledKycButton'

interface YotiDocScanActions extends Record<string, unknown> {
  init: () => void
}

const YotiDocScanCard = ({ init }: YotiDocScanActions) => {
  const { t } = useTranslation(['onboarding'])

  return (
    <KycCard
      vendor="docScan"
      button={
        <StyledKycButton
          style={{
            textTransform: 'uppercase',
            fontSize: 12,
          }}
          onClick={init}
        >
          {t(`verifyIdentity.cards.docScan.button`)}
        </StyledKycButton>
      }
    />
  )
}

const mapDispatchToProps = (dispatch: DispatchWithThunk<AppState>) => ({
  init: () => dispatch(initYotiDocScan()),
})

export default connect<
  Record<string, never>,
  Record<string, never>,
  YotiDocScanActions
>(
  null,
  mapDispatchToProps,
)(YotiDocScanCard)
