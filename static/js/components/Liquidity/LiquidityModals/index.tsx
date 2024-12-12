import { FlaggedFeatureName } from '@swarm/core/hooks/data/useFeatureFlags'
import { PoolExpanded } from '@swarm/types'
import { LiquidityActionType } from '@swarm/types/props'
import FlaggedFeature from '@swarm/ui/swarm/FlaggedFeature'
import match from 'conditional-expression'

import AddLiquidityModal from 'src/components/Liquidity/LiquidityModals/AddLiquidityModal'
import RemoveLiquidityModal from 'src/components/Liquidity/LiquidityModals/RemoveLiquidityModal'
import usePoolDetails from 'src/hooks/pool/usePoolDetails'

interface LiquidityModalsProps {
  openModal: LiquidityActionType | ''
  onClose: (modal: 'add' | 'remove') => void
  reload?: () => void
  loading?: boolean
  pool: string | PoolExpanded
}

const LiquidityModals = ({
  openModal,
  onClose,
  loading = false,
  reload,
  pool,
}: LiquidityModalsProps) => {
  const {
    pool: loadedPool,
    loading: loadedPoolLoading,
    refetch,
  } = usePoolDetails(openModal && typeof pool === 'string' ? pool : undefined)

  const concretePool = (
    typeof pool === 'string' ? loadedPool : pool
  ) as PoolExpanded

  const concreteReload = () => {
    refetch()
    reload?.()
  }

  return (
    !!concretePool &&
    match(openModal)
      .equals('add')
      .then(
        <FlaggedFeature name={FlaggedFeatureName.addLiqudity}>
          <AddLiquidityModal
            isOpen
            onClose={() => onClose('add')}
            pool={concretePool}
            reload={concreteReload}
            loading={loading || loadedPoolLoading || !concretePool}
          />
        </FlaggedFeature>,
      )
      .equals('remove')
      .then(
        <RemoveLiquidityModal
          isOpen
          onClose={() => onClose('remove')}
          pool={concretePool}
          reload={concreteReload}
          loading={loading || loadedPoolLoading || !concretePool}
        />,
      )
      .else(null)
  )
}

export default LiquidityModals
