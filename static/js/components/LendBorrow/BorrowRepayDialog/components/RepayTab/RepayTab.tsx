import { DECIMALS_PRECISION } from '@swarm/core/shared/consts'
import { big } from '@swarm/core/shared/utils/helpers/big-helpers'
import { isStableCoin } from '@swarm/core/shared/utils/tokens/filters'
import { getInputPrecision } from '@swarm/core/shared/utils/tokens/precision'
import { Market } from '@swarm/types/lend-borrow'
import Balance from '@swarm/ui/swarm/Balance'
import MaxInput from '@swarm/ui/swarm/MaxInput'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Box } from 'rimble-ui'

import { DialogActionButton } from 'src/components/LendBorrow/DialogActionButton'
import { DialogTransactionOverview } from 'src/components/LendBorrow/DialogTransactionOverview'
import { InformationalTooltip } from 'src/components/LendBorrow/InformationalTooltip'
import {
  getMaxRepayableUnderlyingBalance,
  matchIsBorrowedMarket,
} from 'src/shared/utils/lendBorrow'

import type { AccountStatsChanges } from '../../BorrowRepayDialog.types'

interface Props {
  market: Market
  repayUnderlyingAmount: string
  enableMarketState: 'idle' | 'confirming' | 'executing'
  repayMarketState: 'idle' | 'confirming' | 'executing'
  hasJustEnabledMarket: boolean
  hasPermissionToRepay: boolean
  setRepayUnderlyingAmount: (underlyingAmount: string) => void
  getRepayAccountStatsChanges: (
    marketAddress: string,
    repayUnderlyingAmount: string,
  ) => AccountStatsChanges
  enableMarket: () => void
  repayMarket: () => void
}

export const RepayTab: React.FC<Props> = (props: Props) => {
  const {
    market,
    repayUnderlyingAmount,
    enableMarketState,
    repayMarketState,
    hasJustEnabledMarket,
    hasPermissionToRepay,
    setRepayUnderlyingAmount,
    getRepayAccountStatsChanges,
    enableMarket,
    repayMarket,
  } = props

  const { t } = useTranslation(['lendBorrow'])

  const getEnableMarketActionButtonLabel = (): string => {
    if (enableMarketState === 'confirming') {
      return t('repayTab.actionsStates.confirmEnableTransaction')
    }

    if (enableMarketState === 'executing') {
      return t('repayTab.actionsStates.executingEnableTransaction')
    }

    return t('repayTab.actions.enable', {
      underlyingSymbol: market.underlyingSymbol,
    })
  }

  const getRepayActionButtonLabel = (): string => {
    if (repayMarketState === 'confirming') {
      return t('repayTab.actionsStates.confirmRepayTransaction')
    }
    if (repayMarketState === 'executing') {
      return t('repayTab.actionsStates.executingRepayTransaction')
    }

    return t('repayTab.actions.repay', {
      underlyingSymbol: market.underlyingSymbol,
    })
  }

  const canRepay =
    matchIsBorrowedMarket(market) && market.isEnabled && hasPermissionToRepay

  const repayAccountStatsChange =
    repayUnderlyingAmount !== ''
      ? getRepayAccountStatsChanges(market.address, repayUnderlyingAmount)
      : getRepayAccountStatsChanges(market.address, '0')

  const maxRepayableUnderlyingBalance = getMaxRepayableUnderlyingBalance(market)

  return (
    <Box>
      <MaxInput
        value={repayUnderlyingAmount}
        inputProps={{
          placeholder: t('repayTab.inputPlaceholder'),
        }}
        prefix={`${maxRepayableUnderlyingBalance.toFixed(
          DECIMALS_PRECISION[
            isStableCoin(market.underlyingSymbol)
              ? 'STABLE_COINS'
              : 'CRYPTO_CURRENCIES'
          ].DISPLAY_BALANCE,
        )} ${market.underlyingSymbol}`}
        min={0}
        max={maxRepayableUnderlyingBalance.toFixed(
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
          setRepayUnderlyingAmount(stringValue)
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
                    repayUnderlyingAmount === ''
                      ? market.underlyingSymbol
                      : undefined
                  }
                />

                {repayUnderlyingAmount !== '' ? (
                  <>
                    {' '}
                    &rarr;{' '}
                    <Balance
                      balance={market.underlyingBalance.sub(
                        repayUnderlyingAmount,
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
                    repayUnderlyingAmount === ''
                      ? market.underlyingSymbol
                      : undefined
                  }
                />

                {repayUnderlyingAmount !== '' ? (
                  <>
                    {' '}
                    &rarr;{' '}
                    <Balance
                      balance={market.borrowedUnderlyingBalance.sub(
                        repayUnderlyingAmount,
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
                {repayAccountStatsChange.previous.borrowLimitPercentage.toFixed(
                  2,
                )}
                %
                {repayUnderlyingAmount !== '' ? (
                  <>
                    {' '}
                    &rarr;{' '}
                    {repayAccountStatsChange.hypothetical.borrowLimitPercentage.toFixed(
                      2,
                    )}
                    %
                  </>
                ) : null}
              </>
            ),
          },
        ]}
      />

      <Box height="40px" />

      {canRepay === false || hasJustEnabledMarket ? (
        <>
          <InformationalTooltip
            label={t('repayTab.whyEnable')}
            tooltip={t('repayTab.whyEnableTooltip')}
          />
          <DialogActionButton
            marginTop="8px"
            marginBottom="8px"
            disabled={hasJustEnabledMarket || big(repayUnderlyingAmount).eq(0)}
            isLoading={
              enableMarketState === 'confirming' ||
              enableMarketState === 'executing'
            }
            onClick={enableMarket}
          >
            {getEnableMarketActionButtonLabel()}
          </DialogActionButton>
        </>
      ) : null}

      <DialogActionButton
        disabled={canRepay === false || big(repayUnderlyingAmount).eq(0)}
        isLoading={
          repayMarketState === 'confirming' || repayMarketState === 'executing'
        }
        onClick={repayMarket}
      >
        {getRepayActionButtonLabel()}
      </DialogActionButton>
    </Box>
  )
}
