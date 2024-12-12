import { useFeatureFlagsContext } from '@core/state/FeatureFlagsContext'

export enum FlaggedFeatureName {
  swapSmtDiscount = 'swap-smt-discount',
  yotiDocScan = 'yoti-docscan',
  yotiApp = 'yoti-app',
  yesKyc = 'yes-kyc',
  stockTokens = 'stock-tokens',
  lendBorrowPage = 'lend-borrow-page',
  walletTxHistory = 'wallet-tx-history',
  smartPools = 'smart-pools',
  smartPoolsManagement = 'smart-pools-management',
  smartPoolsCreation = 'smart-pools-creation',
  eth2snRedeem = 'eth2sn-redeem',
  bonds = 'bonds',
  indexTokens = 'index-tokens',
  securityTokensVerification = 'security-tokens-verification',
  timelockPeriod = 'timelock-period',
  loyaltyLevelBanner = 'loyalty-level-banner',
  smtRewardsBadge = 'smt-rewards-badge',
  smartOrderRouter = 'smart-order-router',
  faucet = 'faucet',
  tenderlySimulation = 'tenderly-simulation',
  swapService = 'swap-service',
  allPools = 'all-pools',
  addLiqudity = 'add-liquidity',
  createPool = 'create-pool',
  completePassportBanner = 'complete-passport-banner',
  liqudityProviders = 'liqudity-providers',
}

const useFeatureFlags = () => {
  const { featureFlags = [], loading } = useFeatureFlagsContext()

  const checkFeature = (feature: FlaggedFeatureName) => {
    if (loading) return false
    const findFlag = featureFlags.find((item) => item.flag === feature)
    const enabled = findFlag && !findFlag.disabled
    return !!enabled
  }

  const ifFeature = <T, F = null>(
    featureName: FlaggedFeatureName,
    content: T,
    fallback: F,
  ) => {
    return checkFeature(featureName) ? content : fallback
  }

  return {
    checkFeature,
    featureFlags,
    ifFeature,
    loading,
  }
}

export default useFeatureFlags
