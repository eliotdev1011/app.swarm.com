import useTransactionAlerts from '@swarm/core/hooks/i18n/useTransactionAlerts'
import type { Market } from '@swarm/types/lend-borrow'
import Dialog from '@swarm/ui/presentational/Dialog'
import { StyledTabs } from '@swarm/ui/presentational/StyledTabs'
import { useSnackbar } from '@swarm/ui/swarm/Snackbar'
import StyledTab from '@swarm/ui/swarm/StyledTab'
import Big from 'big.js'
import { ethers } from 'ethers'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Text } from 'rimble-ui'

import { useTwoStepTransactionFlag } from 'src/hooks/lendBorrow/useTwoStepTransactionFlag'

import type { AccountStatsChanges } from './BorrowRepayDialog.types'
import { BorrowTab } from './components/BorrowTab'
import { RepayTab } from './components/RepayTab'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`borrow-repay-dialog-tabpabel-${index}`}
      aria-labelledby={`borrow-repay-dialog-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Text>{children}</Text>
        </Box>
      )}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `borrow-repay-dialog-tab-${index}`,
    'aria-controls': `borrow-repay-dialog-tabpabel-${index}`,
  }
}

interface Props {
  market: Market | undefined
  activeTab: 'borrow' | 'repay'
  availableDollarsCollateral: Big
  canBorrow: boolean
  canRepay: boolean
  isOpen: boolean
  getBorrowAccountStatsChanges: (
    marketAddress: string,
    borrowUnderlyingAmount: string,
  ) => AccountStatsChanges
  getRepayAccountStatsChanges: (
    marketAddress: string,
    repayUnderlyingAmount: string,
  ) => AccountStatsChanges
  openBorrow: (marketAddress: string) => void
  openRepay: (marketAddress: string) => void
  close: () => void
}

export const BorrowRepayDialog: React.FC<Props> = (props: Props) => {
  const {
    market,
    activeTab,
    availableDollarsCollateral,
    canBorrow,
    canRepay,
    isOpen,
    getBorrowAccountStatsChanges,
    getRepayAccountStatsChanges,
    openBorrow,
    openRepay,
    close,
  } = props

  const { addError } = useSnackbar()
  const { track } = useTransactionAlerts()
  const { t } = useTranslation(['lendBorrow'])

  const tabValue = activeTab === 'borrow' ? 0 : 1

  const handleTabChange = (event: unknown, newValue: number) => {
    if (newValue === 0 && market !== undefined) {
      openBorrow(market.address)
    }
    if (newValue === 1 && market !== undefined) {
      openRepay(market.address)
    }
  }

  const [borrowUnderlyingAmount, setBorrowUnderlyingAmount] =
    React.useState<string>('')
  const [repayUnderlyingAmount, setRepayUnderlyingAmount] =
    React.useState<string>('')

  const [hasJustEnabledMarket, setHasJustEnabledMarket] =
    React.useState<boolean>(false)

  useEffect(() => {
    if (isOpen) {
      setBorrowUnderlyingAmount('')
      setRepayUnderlyingAmount('')
      setHasJustEnabledMarket(false)
    }
  }, [isOpen])

  const {
    state: borrowMarketState,
    startConfirmation: startBorrowMarketConfirmation,
    startExecution: startBorrowMarketExecution,
    stop: stopMarketBorrow,
  } = useTwoStepTransactionFlag()

  const {
    state: enableMarketState,
    startConfirmation: startEnableMarketConfirmation,
    startExecution: startEnableMarketExecution,
    stop: stopEnableMarket,
  } = useTwoStepTransactionFlag()

  const {
    state: repayMarketState,
    startConfirmation: startRepayMarketConfirmation,
    startExecution: startRepayMarketExecution,
    stop: stopMarketRepay,
  } = useTwoStepTransactionFlag()

  const borrowMarket = async () => {
    if (market === undefined) {
      return
    }

    startBorrowMarketConfirmation()
    try {
      const amount = ethers.utils.parseUnits(
        borrowUnderlyingAmount,
        market.underlyingDecimals,
      )

      const borrowMarketTransaction = await market.borrowMarket(amount)
      if (borrowMarketTransaction === undefined) {
        throw new Error('BORROW_MARKET_FAILS')
      }

      startBorrowMarketExecution()

      await track(borrowMarketTransaction, {
        confirm: {
          secondaryMessage: t('borrowRepayDialog.borrowMarketSuccess', {
            underlyingAmount: borrowUnderlyingAmount,
            underlyingSymbol: market.underlyingSymbol,
          }),
        },
      })

      await market.refreshMarket()

      close()
    } catch {
      addError(t(`borrowRepayDialog.borrowMarketError`))
    } finally {
      stopMarketBorrow()
    }
  }

  const enableMarket = async () => {
    if (market === undefined || market.isEnabled) {
      return
    }

    startEnableMarketConfirmation()
    try {
      const approveTransaction = await market.enableMarket()
      if (approveTransaction === undefined) {
        throw new Error('APPROVE_FAILS')
      }

      startEnableMarketExecution()

      await track(approveTransaction, {
        confirm: {
          secondaryMessage: t('borrowRepayDialog.enableMarketSuccess', {
            underlyingSymbol: market.underlyingSymbol,
          }),
        },
      })

      await market.refreshMarket()

      setHasJustEnabledMarket(true)
    } catch {
      addError(t(`borrowRepayDialog.enableMarketError`))
    } finally {
      stopEnableMarket()
    }
  }

  const repayMarket = async () => {
    if (market === undefined) {
      return
    }

    startRepayMarketConfirmation()
    try {
      const amount = ethers.utils.parseUnits(
        repayUnderlyingAmount,
        market.underlyingDecimals,
      )

      const repayBorrowMarketTransaction = await market.repayBorrowMarket(
        amount,
      )
      if (repayBorrowMarketTransaction === undefined) {
        throw new Error('REPAY_BORROW_MARKET_FAILS')
      }

      startRepayMarketExecution()

      await track(repayBorrowMarketTransaction, {
        confirm: {
          secondaryMessage: t('borrowRepayDialog.repayMarketSuccess', {
            underlyingAmount: repayUnderlyingAmount,
            underlyingSymbol: market.underlyingSymbol,
          }),
        },
      })

      await market.refreshMarket()

      close()
    } catch {
      addError(t(`borrowRepayDialog.repayBorrowMarketError`))
    } finally {
      stopMarketRepay()
    }
  }

  return (
    <Dialog
      isOpen={isOpen && market !== undefined}
      width={['100%', '420px']}
      maxWidth="420px"
      maxHeight="90%"
      title={
        activeTab === 'borrow'
          ? t('borrowRepayDialog.borrowTitle', {
              underlyingSymbol: market?.underlyingSymbol,
            })
          : t('borrowRepayDialog.repayTitle', {
              underlyingSymbol: market?.underlyingSymbol,
            })
      }
      onClose={close}
    >
      <Box width="100%">
        {market !== undefined ? (
          <>
            <Box marginBottom={4} marginTop={-3}>
              <StyledTabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label={t('borrowRepayDialog.tabs.ariaLabel')}
              >
                <StyledTab
                  label={t('borrowRepayDialog.tabs.items.borrow')}
                  {...a11yProps(0)}
                />
                <StyledTab
                  label={t('borrowRepayDialog.tabs.items.repay')}
                  {...a11yProps(1)}
                />
              </StyledTabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              <BorrowTab
                market={market}
                borrowUnderlyingAmount={borrowUnderlyingAmount}
                availableDollarsCollateral={availableDollarsCollateral}
                borrowMarketState={borrowMarketState}
                hasPermissionToBorrow={canBorrow}
                setBorrowUnderlyingAmount={setBorrowUnderlyingAmount}
                getBorrowAccountStatsChanges={getBorrowAccountStatsChanges}
                borrowMarket={borrowMarket}
              />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <RepayTab
                market={market}
                repayUnderlyingAmount={repayUnderlyingAmount}
                enableMarketState={enableMarketState}
                repayMarketState={repayMarketState}
                hasJustEnabledMarket={hasJustEnabledMarket}
                hasPermissionToRepay={canRepay}
                setRepayUnderlyingAmount={setRepayUnderlyingAmount}
                getRepayAccountStatsChanges={getRepayAccountStatsChanges}
                enableMarket={enableMarket}
                repayMarket={repayMarket}
              />
            </TabPanel>
          </>
        ) : null}
      </Box>
    </Dialog>
  )
}
