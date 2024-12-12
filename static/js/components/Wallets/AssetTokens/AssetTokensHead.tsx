import TableHead from '@swarm/ui/presentational/Table/TableHead'
import { useTranslation } from 'react-i18next'

// import { getCurrentBrandName } from 'src/shared/utils/brand'

const AssetsHead = () => {
  const { t } = useTranslation('wallets')
  return (
    <TableHead
      columns={[
        { id: 'asset', label: t('assetTokens.asset'), width: '40%' },
        {
          id: 'native',
          label: t('assetTokens.native'),
          justify: 'flex-end',
          width: '15%',
        },
        // {
        //   id: 'pooled',
        //   label: t('assetTokens.pooled', { brand: getCurrentBrandName() }),
        //   justify: 'flex-end',
        //   width: '15%',
        // },
        { id: 'actions', justify: 'flex-end', width: '30%' },
      ]}
    />
  )
}

export default AssetsHead
