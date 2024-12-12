import { FlaggedFeatureName } from '@swarm/core/hooks/data/useFeatureFlags'
import NetworkFeature, {
  NetworkFeatureName,
} from '@swarm/core/services/networkFeatures'
import { Tier } from '@swarm/core/shared/enums'
import { useTier } from '@swarm/core/state/hooks'
import Content from '@swarm/ui/presentational/Content'
import AlertPanel from '@swarm/ui/swarm/AlertPanel'
import FlaggedFeature from '@swarm/ui/swarm/FlaggedFeature'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box } from 'rimble-ui'

import HeaderActions from 'src/components/HeaderActions'
import Layout from 'src/components/Layout'
import AssetTokens from 'src/components/Wallets/AssetTokens'
import Bonds from 'src/components/Wallets/Bonds'
import BrandTokens from 'src/components/Wallets/BrandTokens'
import GoldTokens from 'src/components/Wallets/GoldTokens'
import IndexTokens from 'src/components/Wallets/IndexTokens'
import PoolTokens from 'src/components/Wallets/PoolTokens'
import ProxyTokens from 'src/components/Wallets/ProxyTokens'
import StakingNodes from 'src/components/Wallets/StakingNodes'
import StockTokens from 'src/components/Wallets/StockTokens'
import WalletSelector from 'src/components/Wallets/WalletSelector'
import { WalletsContextProvider } from 'src/components/Wallets/WalletsContext'

const Wallets = () => {
  const { t } = useTranslation('wallets')
  const [showPopup, setShowPopup] = useState(false)
  const tier = useTier()

  return (
    <Layout
      header={t('header')}
      scrollable
      headerActions={
        <HeaderActions
          addLiquidity
          showPopup={showPopup}
          setShowPopup={setShowPopup}
        />
      }
    >
      <Content bg="background">
        <AlertPanel promptSignIn={tier === Tier.tier2} page="wallet" />
        <WalletsContextProvider>
          <WalletSelector />
          <Box width="100%">
            {NetworkFeature.ifSupported(
              NetworkFeatureName.xGoldToken,
              <GoldTokens mt={[3, 4]} />,
            )}
            <AssetTokens mt={[3, 4]} />
            <StakingNodes mt={[3, 4]} />
            <BrandTokens mt={[3, 4]} />
            <FlaggedFeature name={FlaggedFeatureName.stockTokens}>
              <StockTokens mt={[3, 4]} />
            </FlaggedFeature>
            <FlaggedFeature name={FlaggedFeatureName.bonds}>
              <Bonds mt={[3, 4]} />
            </FlaggedFeature>
            <FlaggedFeature name={FlaggedFeatureName.indexTokens}>
              <IndexTokens mt={[3, 4]} />
            </FlaggedFeature>
            <PoolTokens mt={[3, 4]} />
            <ProxyTokens mt={[3, 4]} />
            {/* <FlaggedFeature name={FlaggedFeatureName.walletTxHistory}>
              <TransactionHistory mt={[3, 4]} />
            </FlaggedFeature> */}
          </Box>
        </WalletsContextProvider>
      </Content>
    </Layout>
  )
}

export default Wallets
