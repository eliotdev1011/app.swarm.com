import TableHead from '@swarm/ui/presentational/Table/TableHead'
import { useTranslation } from 'react-i18next'

const BondsHead = () => {
  const { t } = useTranslation('wallets')
  return (
    <TableHead
      columns={[
        { id: 'asset', label: t('bonds.asset'), width: '40%' },
        {
          id: 'native',
          label: t('bonds.native'),
          justify: 'flex-end',
          width: '25%',
        },
        { id: 'actions', justify: 'flex-end', width: '35%' },
      ]}
    />
  )
}

export default BondsHead
