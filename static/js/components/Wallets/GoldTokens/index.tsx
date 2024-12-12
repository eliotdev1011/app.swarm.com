import { useNetwork } from '@swarm/core/web3'
import Section from '@swarm/ui/presentational/Section'
import { useTranslation } from 'react-i18next'
import { Box } from 'rimble-ui'
import { MarginProps } from 'styled-system'

import { XGoldContextProvider } from './XGoldContext'
import XGoldNftsTable from './XGoldNftsTable'
import XGoldTokensTable from './XGoldTokensTable'

const GoldTokens = (props: MarginProps) => {
  const { networkName } = useNetwork()
  const { t } = useTranslation('wallets')

  return (
    <XGoldContextProvider>
      <Section
        title={t('goldTokens.header', { network: networkName })}
        {...props}
      >
        <Box mt={[3, '24px']}>
          <XGoldTokensTable />
        </Box>
        <Box mt={[3, '24px']}>
          <XGoldNftsTable />
        </Box>
      </Section>
    </XGoldContextProvider>
  )
}

export default GoldTokens
