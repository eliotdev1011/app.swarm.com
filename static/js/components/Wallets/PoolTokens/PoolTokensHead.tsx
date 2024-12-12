import TableHead from '@swarm/ui/presentational/Table/TableHead'
import { useTranslation } from 'react-i18next'

import { getCurrentBrandName } from 'src/shared/utils/brand'

const PoolTokensHead = () => {
  const { t } = useTranslation('wallets')

  return (
    <TableHead
      columns={[
        { id: 'asset', label: t('poolTokens.asset'), width: '55%' },
        {
          id: 'pooled',
          label: t('poolTokens.pooled', { brand: getCurrentBrandName() }),
          justify: 'flex-end',
          width: '15%',
        },
        { id: 'actions', justify: 'flex-end', width: '30%' },
      ]}
    />
  )
}

export default PoolTokensHead
