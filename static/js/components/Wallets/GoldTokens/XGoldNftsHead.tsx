import TableHead from '@swarm/ui/presentational/Table/TableHead'
import { useTranslation } from 'react-i18next'

const XGoldNftsHead = () => {
  const { t } = useTranslation('wallets', { keyPrefix: 'goldTokens' })

  return (
    <TableHead
      columns={[
        { id: 'gold', label: t('nfts.nfts'), width: '40%' },
        {
          id: 'available',
          label: t('nfts.available'),
          justify: 'flex-end',
        },
        {
          id: 'dotc',
          label: t('nfts.inDotc'),
          justify: 'flex-end',
        },
        { id: 'actions', justify: 'flex-end' },
      ]}
    />
  )
}

export default XGoldNftsHead
