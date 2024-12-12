import TableHead from '@swarm/ui/presentational/Table/TableHead'
import { useTranslation } from 'react-i18next'

const XGoldTokensHead = () => {
  const { t } = useTranslation('wallets', { keyPrefix: 'goldTokens' })

  return (
    <TableHead
      columns={[
        { id: 'gold', label: t('bundles.tokens'), width: '40%' },
        {
          id: 'available',
          label: t('bundles.available'),
          justify: 'flex-end',
        },
        {
          id: 'dotc',
          label: t('bundles.inDotc'),
          justify: 'flex-end',
        },
        { id: 'actions', justify: 'flex-end' },
      ]}
    />
  )
}

export default XGoldTokensHead
