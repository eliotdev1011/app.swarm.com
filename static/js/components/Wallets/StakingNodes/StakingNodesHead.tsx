import TableHead from '@swarm/ui/presentational/Table/TableHead'
import { useTranslation } from 'react-i18next'

const StakingNodesHead = () => {
  const { t } = useTranslation('wallets')
  return (
    <TableHead
      columns={[
        { id: 'asset', label: t('stakingNodes.asset'), width: '36%' },
        {
          id: 'native',
          label: t('stakingNodes.native'),
          justify: 'flex-end',
          width: '13%',
        },
        {
          id: 'pooled',
          label: t('stakingNodes.pooled'),
          justify: 'flex-end',
          width: '13%',
        },
        {
          id: 'earnings',
          label: t('stakingNodes.earnings'),
          justify: 'flex-end',
          width: '13%',
        },
        { id: 'actions', justify: 'flex-end', width: '25%' },
      ]}
    />
  )
}

export default StakingNodesHead
