import { getCurrentConfig } from '@swarm/core/observables/configForNetwork'
import Content from '@swarm/ui/presentational/Content'
import Section from '@swarm/ui/presentational/Section'
import AlertPanel from '@swarm/ui/swarm/AlertPanel'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Flex } from 'rimble-ui'

import HeaderActions from 'src/components/HeaderActions'
import Layout from 'src/components/Layout'
import { AccountStats } from 'src/components/LendBorrow/AccountStats'
import {
  BorrowRepayDialog,
  useBorrowRepayDialog,
} from 'src/components/LendBorrow/BorrowRepayDialog'
import { BorrowedMarketsTable } from 'src/components/LendBorrow/BorrowedMarketsTable'
import { MarketsToBorrowTable } from 'src/components/LendBorrow/MarketsToBorrowTable'
import { MarketsToSupplyTable } from 'src/components/LendBorrow/MarketsToSupplyTable'
import { SuppliedMarketsTable } from 'src/components/LendBorrow/SuppliedMarketsTable'
import {
  SupplyRedeemDialog,
  useSupplyRedeemDialog,
} from 'src/components/LendBorrow/SupplyRedeemDialog'
import { useComptroller } from 'src/hooks/lendBorrow/comptroller/useComptroller'
import { useLendBorrowPermissions } from 'src/hooks/lendBorrow/useLendBorrowPermissions'
import {
  getAccountLendBorrowStats,
  getHypotheticalAccountLendBorrowStats,
} from 'src/shared/utils/lendBorrow'

const { comptrollerAddress } = getCurrentConfig()

const LendBorrowPage = () => {
  const { t } = useTranslation(['lendBorrow'])

  const { canSupply, canRedeem, canBorrow, canRepay } =
    useLendBorrowPermissions()

  const {
    allMarkets,
    suppliedMarkets,
    borrowedMarkets,
    marketsToSupply,
    marketsToBorrow,
  } = useComptroller(comptrollerAddress)

  const {
    suppliedMarketsDollarsTotal,
    borrowedMarketsDollarsDebt,
    availableDollarsCollateral,
    borrowLimitDollarsCollateral,
    borrowLimitPercentage,
    netAPY,
  } = useMemo(() => {
    if (allMarkets === undefined) {
      return getAccountLendBorrowStats([])
    }
    return getAccountLendBorrowStats(allMarkets)
  }, [allMarkets])

  const {
    market: supplyRedeemDialogMarket,
    activeType: supplyRedeemDialogActiveType,
    isOpen: isSupplyRedeemDialogOpen,
    openSupply: openSupplyDialog,
    openRedeem: openRedeemDialog,
    close: closeSupplyRedeemDialog,
  } = useSupplyRedeemDialog(allMarkets)

  const {
    market: borrowRepayDialogMarket,
    activeType: borrowRepayDialogActiveType,
    isOpen: isBorrowRepayDialogOpen,
    openBorrow: openBorrowDialog,
    openRepay: openRepayDialog,
    close: closeBorrowRedeemDialog,
  } = useBorrowRepayDialog(allMarkets)

  return (
    <Layout header={t('header')} scrollable headerActions={<HeaderActions />}>
      <Content bg="background">
        <Box width="100%" maxWidth="640px" margin="0 auto">
          <AlertPanel />

          <AccountStats
            netAPY={netAPY}
            suppliedMarketsDollarsTotal={suppliedMarketsDollarsTotal}
            borrowedMarketsDollarsDebt={borrowedMarketsDollarsDebt}
            borrowLimitDollarsCollateral={borrowLimitDollarsCollateral}
            borrowLimitPercentage={borrowLimitPercentage}
          />
        </Box>

        <Box height="40px" />

        {suppliedMarkets === undefined ||
        borrowedMarkets === undefined ? null : (
          <Flex
            width="100%"
            flexDirection="row"
            justifyContent="flex-start"
            alignItems="stretch"
          >
            <div style={{ flex: 1 }}>
              <Section title={t('sectionTitles.yourSupplies')}>
                <Box height="32px" />
                <SuppliedMarketsTable
                  suppliedMarkets={suppliedMarkets}
                  canRedeem={canRedeem}
                  openRedeemDialog={openRedeemDialog}
                />
              </Section>
            </div>
            <Box flexShrink="0" width="24px" />
            <div style={{ flex: 1 }}>
              <Section title={t('sectionTitles.yourBorrows')}>
                <Box height="32px" />
                <BorrowedMarketsTable
                  borrowedMarkets={borrowedMarkets}
                  canRepay={canRepay}
                  openRepayDialog={openRepayDialog}
                />
              </Section>
            </div>
          </Flex>
        )}

        <Box height="32px" />

        {marketsToSupply === undefined ||
        marketsToBorrow === undefined ? null : (
          <Flex
            width="100%"
            flexDirection="row"
            justifyContent="flex-start"
            alignItems="stretch"
          >
            <div style={{ flex: 1 }}>
              <Section title={t('sectionTitles.assetsToSupply')}>
                <Box height="32px" />
                <MarketsToSupplyTable
                  marketsToSupply={marketsToSupply}
                  canSupply={canSupply}
                  openSupplyDialog={openSupplyDialog}
                />
              </Section>
            </div>
            <Box flexShrink="0" width="24px" />
            <div style={{ flex: 1 }}>
              <Section title={t('sectionTitles.assetsToBorrow')}>
                <Box height="32px" />
                <MarketsToBorrowTable
                  marketsToBorrow={marketsToBorrow}
                  availableDollarsCollateral={availableDollarsCollateral}
                  canBorrow={canBorrow}
                  openBorrowDialog={openBorrowDialog}
                />
              </Section>
            </div>
          </Flex>
        )}
      </Content>

      <SupplyRedeemDialog
        market={supplyRedeemDialogMarket}
        activeTab={supplyRedeemDialogActiveType}
        availableDollarsCollateral={availableDollarsCollateral}
        canSupply={canSupply}
        canRedeem={canRedeem}
        isOpen={isSupplyRedeemDialogOpen}
        getSupplyAccountStatsChanges={(
          marketAddress: string,
          supplyUnderlyingAmount: string,
        ) => {
          if (allMarkets === undefined) {
            return getHypotheticalAccountLendBorrowStats([], [])
          }
          return getHypotheticalAccountLendBorrowStats(allMarkets, [
            {
              type: 'supply',
              address: marketAddress,
              underlyingAmount: supplyUnderlyingAmount,
            },
          ])
        }}
        getRedeemAccountStatsChanges={(
          marketAddress: string,
          redeemUnderlyingAmount: string,
        ) => {
          if (allMarkets === undefined) {
            return getHypotheticalAccountLendBorrowStats([], [])
          }
          return getHypotheticalAccountLendBorrowStats(allMarkets, [
            {
              type: 'redeem',
              address: marketAddress,
              underlyingAmount: redeemUnderlyingAmount,
            },
          ])
        }}
        openSupply={openSupplyDialog}
        openRedeem={openRedeemDialog}
        close={closeSupplyRedeemDialog}
      />
      <BorrowRepayDialog
        market={borrowRepayDialogMarket}
        activeTab={borrowRepayDialogActiveType}
        availableDollarsCollateral={availableDollarsCollateral}
        canBorrow={canBorrow}
        canRepay={canRepay}
        isOpen={isBorrowRepayDialogOpen}
        getBorrowAccountStatsChanges={(
          marketAddress: string,
          borrowUnderlyingAmount: string,
        ) => {
          if (allMarkets === undefined) {
            return getHypotheticalAccountLendBorrowStats([], [])
          }
          return getHypotheticalAccountLendBorrowStats(allMarkets, [
            {
              type: 'borrow',
              address: marketAddress,
              underlyingAmount: borrowUnderlyingAmount,
            },
          ])
        }}
        getRepayAccountStatsChanges={(
          marketAddress: string,
          repayUnderlyingAmount: string,
        ) => {
          if (allMarkets === undefined) {
            return getHypotheticalAccountLendBorrowStats([], [])
          }
          return getHypotheticalAccountLendBorrowStats(allMarkets, [
            {
              type: 'repay',
              address: marketAddress,
              underlyingAmount: repayUnderlyingAmount,
            },
          ])
        }}
        openBorrow={openBorrowDialog}
        openRepay={openRepayDialog}
        close={closeBorrowRedeemDialog}
      />
    </Layout>
  )
}

export default LendBorrowPage
