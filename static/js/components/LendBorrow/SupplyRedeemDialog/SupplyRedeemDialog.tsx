import useTransactionAlerts from '@swarm/core/hooks/i18n/useTransactionAlerts'
import { Market } from '@swarm/types/lend-borrow'
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

import type { AccountStatsChanges } from './SupplyRedeemDialog.types'
import { RedeemTab } from './components/RedeemTab'
import { SupplyTab } from './components/SupplyTab'

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
      id={`supply-redeem-dialog-tabpabel-${index}`}
      aria-labelledby={`supply-redeem-dialog-tab-${index}`}
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
    id: `supply-redeem-dialog-tab-${index}`,
    'aria-controls': `supply-redeem-dialog-tabpabel-${index}`,
  }
}

interface Props {
  market: Market | undefined
  activeTab: 'supply' | 'redeem'
  availableDollarsCollateral: Big
  canSupply: boolean
  canRedeem: boolean
  isOpen: boolean
  getSupplyAccountStatsChanges: (
    marketAddress: string,
    supplyUnderlyingAmount: string,
  ) => AccountStatsChanges
  getRedeemAccountStatsChanges: (
    marketAddress: string,
    redeemUnderlyingAmount: string,
  ) => AccountStatsChanges
  openSupply: (marketAddress: string) => void
  openRedeem: (marketAddress: string) => void
  close: () => void
}

export const SupplyRedeemDialog: React.FC<Props> = (props: Props) => {
  const {
    market,
    activeTab,
    availableDollarsCollateral,
    canSupply,
    canRedeem,
    isOpen,
    getSupplyAccountStatsChanges,
    getRedeemAccountStatsChanges,
    openSupply,
    openRedeem,
    close,
  } = props

  const { addError } = useSnackbar()
  const { track } = useTransactionAlerts()
  const { t } = useTranslation(['lendBorrow'])

  const tabValue = activeTab === 'supply' ? 0 : 1

  const handleTabChange = (event: unknown, newValue: number) => {
    if (newValue === 0 && market !== undefined) {
      openSupply(market.address)
    }
    if (newValue === 1 && market !== undefined) {
      openRedeem(market.address)
    }
  }

  const [supplyUnderlyingAmount, setSupplyUnderlyingAmount] =
    React.useState<string>('')
  const [redeemUnderlyingAmount, setRedeemUnderlyingAmount] =
    React.useState<string>('')

  const [hasJustEnteredAndEnabledMarket, setHasJustEnteredAndEnabledMarket] =
    React.useState<boolean>(false)

  useEffect(() => {
    if (isOpen) {
      setSupplyUnderlyingAmount('')
      setRedeemUnderlyingAmount('')
      setHasJustEnteredAndEnabledMarket(false)
    }
  }, [isOpen])

  const {
    state: enterMarketState,
    startConfirmation: startEnterMarketConfirmation,
    startExecution: startEnterMarketExecution,
    stop: stopEnterMarket,
  } = useTwoStepTransactionFlag()

  const {
    state: enableMarketState,
    startConfirmation: startEnableMarketConfirmation,
    startExecution: startEnableMarketExecution,
    stop: stopEnableMarket,
  } = useTwoStepTransactionFlag()

  const {
    state: supplyMarketState,
    startConfirmation: startSupplyMarketConfirmation,
    startExecution: startSupplyMarketExecution,
    stop: stopMarketSupplying,
  } = useTwoStepTransactionFlag()

  const {
    state: redeemMarketState,
    startConfirmation: startRedeemMarketConfirmation,
    startExecution: startRedeemMarketExecution,
    stop: stopMarketRedeem,
  } = useTwoStepTransactionFlag()

  const enterAndEnableMarket = async () => {
    if (market === undefined) {
      return
    }

    try {
      let hasJustEnteredMarket = false
      let hasJustEnabledMarket = false

      if (market.isEntered === false) {
        startEnterMarketConfirmation()

        const enterMarketTransaction = await market.enterMarket()
        if (enterMarketTransaction === undefined) {
          throw new Error('ENTER_MARKET_FAILS')
        }

        startEnterMarketExecution()

        await track(enterMarketTransaction, {
          confirm: {
            secondaryMessage: t('supplyRedeemDialog.enterMarketSuccess', {
              underlyingSymbol: market.underlyingSymbol,
            }),
          },
        })

        await market.refreshMarket()

        stopEnterMarket()

        hasJustEnteredMarket = true
      }

      if (market.isEnabled === false) {
        startEnableMarketConfirmation()

        const approveTransaction = await market.enableMarket()
        if (approveTransaction === undefined) {
          throw new Error('APPROVE_FAILS')
        }

        startEnableMarketExecution()

        await track(approveTransaction, {
          confirm: {
            secondaryMessage: t('supplyRedeemDialog.enableMarketSuccess', {
              underlyingSymbol: market.underlyingSymbol,
            }),
          },
        })

        await market.refreshMarket()

        stopEnableMarket()

        hasJustEnabledMarket = true
      }

      if (hasJustEnteredMarket && hasJustEnabledMarket) {
        setHasJustEnteredAndEnabledMarket(true)
      }
    } catch {
      stopEnterMarket()
      stopEnableMarket()

      addError(t(`supplyRedeemDialog.enterAndEnableMarketError`))
    }
  }

  const supplyMarket = async () => {
    if (market === undefined) {
      return
    }

    startSupplyMarketConfirmation()
    try {
      const amount = ethers.utils.parseUnits(
        supplyUnderlyingAmount,
        market.underlyingDecimals,
      )

      const supplyMarketTransaction = await market.supplyMarket(amount)
      if (supplyMarketTransaction === undefined) {
        throw new Error('SUPPLY_MARKET_FAILS')
      }

      startSupplyMarketExecution()

      await track(supplyMarketTransaction, {
        confirm: {
          secondaryMessage: t('supplyRedeemDialog.supplyMarketSuccess', {
            underlyingAmount: supplyUnderlyingAmount,
            underlyingSymbol: market.underlyingSymbol,
          }),
        },
      })

      await market.refreshMarket()

      close()
    } catch {
      addError(t(`supplyRedeemDialog.supplyMarketError`))
    } finally {
      stopMarketSupplying()
    }
  }

  const redeemMarket = async () => {
    if (market === undefined) {
      return
    }

    startRedeemMarketConfirmation()
    try {
      const amount = ethers.utils.parseUnits(
        redeemUnderlyingAmount,
        market.underlyingDecimals,
      )

      const redeemMarketTransaction = await market.redeemMarket(amount)
      if (redeemMarketTransaction === undefined) {
        throw new Error('REDEEM_MARKET_FAILS')
      }

      startRedeemMarketExecution()

      await track(redeemMarketTransaction, {
        confirm: {
          secondaryMessage: t('supplyRedeemDialog.redeemMarketSuccess', {
            underlyingAmount: redeemUnderlyingAmount,
            underlyingSymbol: market.underlyingSymbol,
          }),
        },
      })

      await market.refreshMarket()

      close()
    } catch {
      addError(t(`supplyRedeemDialog.redeemMarketError`))
    } finally {
      stopMarketRedeem()
    }
  }

  return (
    <Dialog
      isOpen={isOpen && market !== undefined}
      width={['100%', '420px']}
      maxWidth="420px"
      maxHeight="90%"
      title={
        activeTab === 'supply'
          ? t('supplyRedeemDialog.supplyTitle', {
              underlyingSymbol: market?.underlyingSymbol,
            })
          : t('supplyRedeemDialog.redeemTitle', {
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
                aria-label={t('supplyRedeemDialog.tabs.ariaLabel')}
              >
                <StyledTab
                  label={t('supplyRedeemDialog.tabs.items.supply')}
                  {...a11yProps(0)}
                />
                <StyledTab
                  label={t('supplyRedeemDialog.tabs.items.redeem')}
                  {...a11yProps(1)}
                />
              </StyledTabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              <SupplyTab
                market={market}
                supplyUnderlyingAmount={supplyUnderlyingAmount}
                enterMarketState={enterMarketState}
                enableMarketState={enableMarketState}
                supplyMarketState={supplyMarketState}
                hasJustEnteredAndEnabledMarket={hasJustEnteredAndEnabledMarket}
                hasPermissionToSupply={canSupply}
                setSupplyUnderlyingAmount={setSupplyUnderlyingAmount}
                getSupplyAccountStatsChanges={getSupplyAccountStatsChanges}
                enterAndEnableMarket={enterAndEnableMarket}
                supplyMarket={supplyMarket}
              />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <RedeemTab
                market={market}
                redeemUnderlyingAmount={redeemUnderlyingAmount}
                availableDollarsCollateral={availableDollarsCollateral}
                redeemMarketState={redeemMarketState}
                hasPermissionToRedeem={canRedeem}
                setRedeemUnderlyingAmount={setRedeemUnderlyingAmount}
                getRedeemAccountStatsChanges={getRedeemAccountStatsChanges}
                redeemMarket={redeemMarket}
              />
            </TabPanel>
          </>
        ) : null}
      </Box>
    </Dialog>
  )
}
