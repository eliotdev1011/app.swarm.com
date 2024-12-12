import { DECIMALS_PRECISION } from '@swarm/core/shared/consts'
import { big } from '@swarm/core/shared/utils/helpers/big-helpers'
import { isStableCoin } from '@swarm/core/shared/utils/tokens/filters'
import { getInputPrecision } from '@swarm/core/shared/utils/tokens/precision'
import { Market } from '@swarm/types/lend-borrow'
import Balance from '@swarm/ui/swarm/Balance'
import MaxInput from '@swarm/ui/swarm/MaxInput'
import Big from 'big.js'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Text } from 'rimble-ui'

import { DialogActionButton } from 'src/components/LendBorrow/DialogActionButton'
import { DialogLiquidationDangerNotice } from 'src/components/LendBorrow/DialogLiquidationDangerNotice'
import { DialogTransactionOverview } from 'src/components/LendBorrow/DialogTransactionOverview'
import { DANGER_THRESHOLD_BORROW_LIMIT_PERCENTAGE } from 'src/shared/consts'
import {
  getMaxRedeemableUnderlyingBalance,
  matchIsSuppliedMarket,
} from 'src/shared/utils/lendBorrow'

import type { AccountStatsChanges } from '../../SupplyRedeemDialog.types'

interface Props {
  market: Market
  redeemUnderlyingAmount: string
  availableDollarsCollateral: Big
  redeemMarketState: 'idle' | 'confirming' | 'executing'
  hasPermissionToRedeem: boolean
  setRedeemUnderlyingAmount: (underlyingAmount: string) => void
  getRedeemAccountStatsChanges: (
    marketAddress: string,
    redeemUnderlyingAmount: string,
  ) => AccountStatsChanges
  redeemMarket: () => void
}

export const RedeemTab: React.FC<Props> = (props: Props) => {
  const {
    market,
    redeemUnderlyingAmount,
    availableDollarsCollateral,
    redeemMarketState,
    hasPermissionToRedeem,
    setRedeemUnderlyingAmount,
    getRedeemAccountStatsChanges,
    redeemMarket,
  } = props

  const { t } = useTranslation(['lendBorrow'])

  const [isAcknowledgeChecked, setIsAcknowledgeChecked] =
    useState<boolean>(false)

  const getRedeemActionButtonLabel = (): string => {
    if (redeemMarketState === 'confirming') {
      return t('redeemTab.actionsStates.confirmRedeemTransaction')
    }
    if (redeemMarketState === 'executing') {
      return t('redeemTab.actionsStates.executingRedeemTransaction')
    }

    return t('redeemTab.actions.redeem', {
      underlyingSymbol: market.underlyingSymbol,
    })
  }

  const canRedeem = matchIsSuppliedMarket(market) && hasPermissionToRedeem

  const redeemAccountStatsChange =
    redeemUnderlyingAmount !== ''
      ? getRedeemAccountStatsChanges(market.address, redeemUnderlyingAmount)
      : getRedeemAccountStatsChanges(market.address, '0')

  const maxRedeemableUnderlyingBalance = getMaxRedeemableUnderlyingBalance(
    market,
    availableDollarsCollateral,
  )

  const hasLiquidationDanger =
    redeemAccountStatsChange.hypothetical.borrowLimitPercentage.gte(
      DANGER_THRESHOLD_BORROW_LIMIT_PERCENTAGE,
    )

  return (
    <Box>
      <MaxInput
        value={redeemUnderlyingAmount}
        inputProps={{
          placeholder: t('redeemTab.inputPlaceholder'),
        }}
        prefix={`${maxRedeemableUnderlyingBalance.toFixed(
          DECIMALS_PRECISION[
            isStableCoin(market.underlyingSymbol)
              ? 'STABLE_COINS'
              : 'CRYPTO_CURRENCIES'
          ].DISPLAY_BALANCE,
        )} ${market.underlyingSymbol}`}
        min={0}
        max={maxRedeemableUnderlyingBalance.toFixed(
          DECIMALS_PRECISION[
            isStableCoin(market.underlyingSymbol)
              ? 'STABLE_COINS'
              : 'CRYPTO_CURRENCIES'
          ].INPUT,
        )}
        decimalScale={getInputPrecision(market)}
        height="48px"
        marginTop="24px"
        marginBottom="24px"
        onChange={(value: number, stringValue: string) => {
          setRedeemUnderlyingAmount(stringValue)
        }}
      />

      <DialogTransactionOverview
        items={[
          {
            label: t('redeemTab.walletBalance'),
            value: (
              <>
                <Balance
                  balance={market.underlyingBalance}
                  base={
                    DECIMALS_PRECISION[
                      isStableCoin(market.underlyingSymbol)
                        ? 'STABLE_COINS'
                        : 'CRYPTO_CURRENCIES'
                    ].DISPLAY_BALANCE
                  }
                  symbol={
                    redeemUnderlyingAmount === ''
                      ? market.underlyingSymbol
                      : undefined
                  }
                />

                {redeemUnderlyingAmount !== '' ? (
                  <>
                    {' '}
                    &rarr;{' '}
                    <Balance
                      balance={market.underlyingBalance.add(
                        redeemUnderlyingAmount,
                      )}
                      base={
                        DECIMALS_PRECISION[
                          isStableCoin(market.underlyingSymbol)
                            ? 'STABLE_COINS'
                            : 'CRYPTO_CURRENCIES'
                        ].DISPLAY_BALANCE
                      }
                      symbol={market.underlyingSymbol}
                    />
                  </>
                ) : null}
              </>
            ),
          },
          {
            label: t('redeemTab.supplyBalance'),
            value: (
              <>
                $
                <Balance
                  balance={
                    redeemAccountStatsChange.previous
                      .suppliedMarketsDollarsTotal
                  }
                  base={DECIMALS_PRECISION.DOLLARS.DISPLAY_BALANCE}
                />
                {redeemUnderlyingAmount !== '' ? (
                  <>
                    {' '}
                    &rarr; $
                    <Balance
                      balance={
                        redeemAccountStatsChange.hypothetical
                          .suppliedMarketsDollarsTotal
                      }
                      base={DECIMALS_PRECISION.DOLLARS.DISPLAY_BALANCE}
                    />
                  </>
                ) : null}
              </>
            ),
          },
          {
            label: t('redeemTab.borrowLimitPercentage'),
            value: (
              <>
                {redeemAccountStatsChange.previous.borrowLimitPercentage.toFixed(
                  2,
                )}
                %
                {redeemUnderlyingAmount !== '' ? (
                  <>
                    {' '}
                    &rarr;{' '}
                    <Text.span
                      fontSize="inherit"
                      color={hasLiquidationDanger ? 'danger' : 'inherit'}
                    >
                      {redeemAccountStatsChange.hypothetical.borrowLimitPercentage.toFixed(
                        2,
                      )}
                      %
                    </Text.span>
                  </>
                ) : null}
              </>
            ),
          },
        ]}
      />

      {hasLiquidationDanger ? (
        <DialogLiquidationDangerNotice
          noticeText={t('redeemTab.liquidationDangerNotice.notice')}
          acknowledgeText={t('redeemTab.liquidationDangerNotice.acknowledge')}
          isAcknowledgeChecked={isAcknowledgeChecked}
          setIsAcknowledgeChecked={setIsAcknowledgeChecked}
          marginTop={24}
        />
      ) : null}

      <Box height="40px" />

      <DialogActionButton
        disabled={
          canRedeem === false ||
          big(redeemUnderlyingAmount).eq(0) ||
          (hasLiquidationDanger && isAcknowledgeChecked === false)
        }
        isLoading={
          redeemMarketState === 'confirming' ||
          redeemMarketState === 'executing'
        }
        onClick={redeemMarket}
      >
        {getRedeemActionButtonLabel()}
      </DialogActionButton>
    </Box>
  )
}
