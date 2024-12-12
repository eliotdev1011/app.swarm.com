import TableHead from '@swarm/ui/presentational/Table/TableHead'
import TextWithTooltip from '@swarm/ui/presentational/Text/TextWithTooltip'
import { useTranslation } from 'react-i18next'

const ProxyTokensHead = () => {
  const { t } = useTranslation('wallets')
  return (
    <TableHead
      columns={[
        { id: 'assets', label: t('proxyTokens.assets'), width: '55%' },
        {
          id: 'balance',
          label: (
            <TextWithTooltip tooltip={t('proxyTokens.tooltip')}>
              {t('proxyTokens.balance')}
            </TextWithTooltip>
          ),
          justify: 'flex-end',
          width: '15%',
        },
        { id: 'actions', justify: 'flex-end', width: '30%' },
      ]}
    />
  )
}

export default ProxyTokensHead
