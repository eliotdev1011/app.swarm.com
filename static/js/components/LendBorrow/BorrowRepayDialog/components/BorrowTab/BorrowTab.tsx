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
import { getMaxBorrowableUnderlyingBalance } from 'src/shared/utils/lendBorrow'

import type { AccountStatsChanges } from '../../BorrowRepayDialog.types'

interface Props {
  market: Market
  borrowUnderlyingAmount: string
  availableDollarsCollateral: Big
  borrowMarketState: 'idle' | 'confirming' | 'executing'
  hasPermissionToBorrow: boolean
  setBorrowUnderlyingAmount: (underlyingAmount: string) => void
  getBorrowAccountStatsChanges: (
    marketAddress: string,
    borrowUnderlyingAmount: string,
  ) => AccountStatsChanges
  borrowMarket: () => void
}

export const BorrowTab: React.FC<Props> = (props: Props) => {
  const {
    market,
    borrowUnderlyingAmount,
    availableDollarsCollateral,
    borrowMarketState,
    hasPermissionToBorrow,
    setBorrowUnderlyingAmount,
    getBorrowAccountStatsChanges,
    borrowMarket,
  } = props

  const { t } = useTranslation(['lendBorrow'])

  const [isAcknowledgeChecked, setIsAcknowledgeChecked] =
    useState<boolean>(false)

  const getBorrowActionButtonLabel = (): string => {
    if (borrowMarketState === 'confirming') {
      return t('borrowTab.actionsStates.confirmBorrowTransaction')
    }
    if (borrowMarketState === 'executing') {
      return t('borrowTab.actionsStates.executingBorrowTransaction')
    }

    return t('borrowTab.actions.borrow', {
      underlyingSymbol: market.underlyingSymbol,
    })
  }

  const canBorrow = availableDollarsCollateral.gt(0) && hasPermissionToBorrow

  const borrowAccountStatsChange =
    borrowUnderlyingAmount !== ''
      ? getBorrowAccountStatsChanges(market.address, borrowUnderlyingAmount)
      : getBorrowAccountStatsChanges(market.address, '0')

  const maxBorrowableUnderlyingBalance = getMaxBorrowableUnderlyingBalance(
    market,
    availableDollarsCollateral,
  )

  const hasLiquidationDanger =
    borrowAccountStatsChange.hypothetical.borrowLimitPercentage.gte(
      DANGER_THRESHOLD_BORROW_LIMIT_PERCENTAGE,
    )

  return (
    <Box>
      <MaxInput
        value={borrowUnderlyingAmount}
        inputProps={{
          placeholder: t('borrowTab.inputPlaceholder'),
        }}
        prefix={`${maxBorrowableUnderlyingBalance.toFixed(
          DECIMALS_PRECISION[
            isStableCoin(market.underlyingSymbol)
              ? 'STABLE_COINS'
              : 'CRYPTO_CURRENCIES'
          ].DISPLAY_BALANCE,
        )} ${market.underlyingSymbol}`}
        min={0}
        max={maxBorrowableUnderlyingBalance.toFixed(
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
          setBorrowUnderlyingAmount(stringValue)
        }}
      />

      <DialogTransactionOverview
        items={[
          {
            label: t('borrowTab.walletBalance'),
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
                    borrowUnderlyingAmount === ''
                      ? market.underlyingSymbol
                      : undefined
                  }
                />

                {borrowUnderlyingAmount !== '' ? (
                  <>
                    {' '}
                    &rarr;{' '}
                    <Balance
                      balance={market.underlyingBalance.add(
                        borrowUnderlyingAmount,
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
            label: t('borrowTab.borrowBalance'),
            value: (
              <>
                <Balance
                  balance={market.borrowedUnderlyingBalance}
                  base={
                    DECIMALS_PRECISION[
                      isStableCoin(market.underlyingSymbol)
                        ? 'STABLE_COINS'
                        : 'CRYPTO_CURRENCIES'
                    ].DISPLAY_BALANCE
                  }
                  symbol={
                    borrowUnderlyingAmount === ''
                      ? market.underlyingSymbol
                      : undefined
                  }
                />

                {borrowUnderlyingAmount !== '' ? (
                  <>
                    {' '}
                    &rarr;{' '}
                    <Balance
                      balance={market.borrowedUnderlyingBalance.add(
                        borrowUnderlyingAmount,
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
            label: t('borrowTab.borrowLimitPercentage'),
            value: (
              <>
                {borrowAccountStatsChange.previous.borrowLimitPercentage.toFixed(
                  2,
                )}
                %
                {borrowUnderlyingAmount !== '' ? (
                  <>
                    {' '}
                    &rarr;{' '}
                    <Text.span
                      fontSize="inherit"
                      color={hasLiquidationDanger ? 'danger' : 'inherit'}
                    >
                      {borrowAccountStatsChange.hypothetical.borrowLimitPercentage.toFixed(
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
          noticeText={t('borrowTab.liquidationDangerNotice.notice')}
          acknowledgeText={t('borrowTab.liquidationDangerNotice.acknowledge')}
          isAcknowledgeChecked={isAcknowledgeChecked}
          setIsAcknowledgeChecked={setIsAcknowledgeChecked}
          marginTop={24}
        />
      ) : null}

      <Box height="40px" />

      <DialogActionButton
        disabled={
          canBorrow === false ||
          big(borrowUnderlyingAmount).eq(0) ||
          (hasLiquidationDanger && isAcknowledgeChecked === false)
        }
        isLoading={
          borrowMarketState === 'confirming' ||
          borrowMarketState === 'executing'
        }
        onClick={borrowMarket}
      >
        {getBorrowActionButtonLabel()}
      </DialogActionButton>
    </Box>
  )
}
