import useDeepMemo from '@swarm/core/hooks/memo/useDeepMemo'
import { useTier } from '@swarm/core/state/hooks'
import { useAccount } from '@swarm/core/web3'
import { FORBIDDEN_TIERS } from '@swarm/core/shared/consts'
import { useTranslation } from 'react-i18next'

import FlashToast from '../Snackbar/FlashToast'
import { AlertVariant } from '../Snackbar/types'

const TransactionForbidden = () => {
  const account = useAccount()
  const { t } = useTranslation('alerts')
  const tier = useTier()
  const display = useDeepMemo(() => FORBIDDEN_TIERS.includes(tier), [
    account,
    tier,
  ])

  return (
    <FlashToast
      display={display}
      message={t('transactionForbidden')}
      variant={AlertVariant.warning}
    />
  )
}

export default TransactionForbidden
