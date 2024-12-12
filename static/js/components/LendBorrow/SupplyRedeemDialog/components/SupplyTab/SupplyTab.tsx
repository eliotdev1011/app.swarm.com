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
  getMaxSuppliableUnderlyingBalance,
  matchIsSuppliableMarket,
} from 'src/shared/utils/lendBorrow'

import type { AccountStatsChanges } from '../../SupplyRedeemDialog.types'

interface Props {
  market: Market
  supplyUnderlyingAmount: string
  enterMarketState: 'idle' | 'confirming' | 'executing'
  enableMarketState: 'idle' | 'confirming' | 'executing'
  supplyMarketState: 'idle' | 'confirming' | 'executing'
  hasJustEnteredAndEnabledMarket: boolean
  hasPermissionToSupply: boolean
  setSupplyUnderlyingAmount: (underlyingAmount: string) => void
  getSupplyAccountStatsChanges: (
    marketAddress: string,
    supplyUnderlyingAmount: string,
  ) => AccountStatsChanges
  enterAndEnableMarket: () => void
  supplyMarket: () => void
}

export const SupplyTab: React.FC<Props> = (props: Props) => {
  const {
    market,
    supplyUnderlyingAmount,
    enterMarketState,
    enableMarketState,
    supplyMarketState,
    hasJustEnteredAndEnabledMarket,
    hasPermissionToSupply,
    setSupplyUnderlyingAmount,
    getSupplyAccountStatsChanges,
    enterAndEnableMarket,
    supplyMarket,
  } = props

  const { t } = useTranslation(['lendBorrow'])

  const getEnterAndEnableMarketActionButtonLabel = (): string => {
    if (enterMarketState === 'confirming') {
      return t('supplyTab.actionsStates.confirmEnterTransaction')
    }

    if (enterMarketState === 'executing') {
      return t('supplyTab.actionsStates.executingEnterTransaction')
    }

    if (enableMarketState === 'confirming') {
      return t('supplyTab.actionsStates.confirmEnableTransaction')
    }

    if (enableMarketState === 'executing') {
      return t('supplyTab.actionsStates.executingEnableTransaction')
    }

    if (market.isEntered) {
      return t('supplyTab.actions.enable', {
        underlyingSymbol: market.underlyingSymbol,
      })
    }

    return t('supplyTab.actions.enterAndEnable', {
      underlyingSymbol: market.underlyingSymbol,
    })
  }

  const getSupplyActionButtonLabel = (): string => {
    if (supplyMarketState === 'confirming') {
      return t('supplyTab.actionsStates.confirmSupplyTransaction')
    }
    if (supplyMarketState === 'executing') {
      return t('supplyTab.actionsStates.executingSupplyTransaction')
    }

    return t('supplyTab.actions.supply', {
      underlyingSymbol: market.underlyingSymbol,
    })
  }

  const canSupply = matchIsSuppliableMarket(market) && hasPermissionToSupply

  const supplyAccountStatsChange =
    supplyUnderlyingAmount !== ''
      ? getSupplyAccountStatsChanges(market.address, supplyUnderlyingAmount)
      : getSupplyAccountStatsChanges(market.address, '0')

  const maxSuppliableUnderlyingBalance =
    getMaxSuppliableUnderlyingBalance(market)

  return (
    <Box>
      <MaxInput
        value={supplyUnderlyingAmount}
        inputProps={{
          placeholder: t('supplyTab.inputPlaceholder'),
        }}
        prefix={`${maxSuppliableUnderlyingBalance.toFixed(
          DECIMALS_PRECISION[
            isStableCoin(market.underlyingSymbol)
              ? 'STABLE_COINS'
              : 'CRYPTO_CURRENCIES'
          ].DISPLAY_BALANCE,
        )} ${market.underlyingSymbol}`}
        min={0}
        max={maxSuppliableUnderlyingBalance.toFixed(
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
          setSupplyUnderlyingAmount(stringValue)
        }}
      />

      <DialogTransactionOverview
        items={[
          {
            label: t('supplyTab.walletBalance'),
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
                    supplyUnderlyingAmount === ''
                      ? market.underlyingSymbol
                      : undefined
                  }
                />

                {supplyUnderlyingAmount !== '' ? (
                  <>
                    {' '}
                    &rarr;{' '}
                    <Balance
                      balance={market.underlyingBalance.sub(
                        supplyUnderlyingAmount,
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
            label: t('supplyTab.supplyBalance'),
            value: (
              <>
                $
                <Balance
                  balance={
                    supplyAccountStatsChange.previous
                      .suppliedMarketsDollarsTotal
                  }
                  base={DECIMALS_PRECISION.DOLLARS.DISPLAY_BALANCE}
                />
                {supplyUnderlyingAmount !== '' ? (
                  <>
                    {' '}
                    &rarr; $
                    <Balance
                      balance={
                        supplyAccountStatsChange.hypothetical
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
            label: t('supplyTab.borrowLimitPercentage'),
            value: (
              <>
                {supplyAccountStatsChange.previous.borrowLimitPercentage.toFixed(
                  2,
                )}
                %
                {supplyUnderlyingAmount !== '' ? (
                  <>
                    {' '}
                    &rarr;{' '}
                    {supplyAccountStatsChange.hypothetical.borrowLimitPercentage.toFixed(
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

      {canSupply === false || hasJustEnteredAndEnabledMarket ? (
        <>
          <InformationalTooltip
            label={t('supplyTab.whyEnterAndEnable')}
            tooltip={t('supplyTab.whyEnterAndEnableTooltip')}
          />

          <DialogActionButton
            marginTop="8px"
            marginBottom="8px"
            disabled={
              hasJustEnteredAndEnabledMarket ||
              big(supplyUnderlyingAmount).eq(0)
            }
            isLoading={
              enterMarketState === 'confirming' ||
              enterMarketState === 'executing' ||
              enableMarketState === 'confirming' ||
              enableMarketState === 'executing'
            }
            onClick={enterAndEnableMarket}
          >
            {getEnterAndEnableMarketActionButtonLabel()}
          </DialogActionButton>
        </>
      ) : null}

      <DialogActionButton
        disabled={canSupply === false || big(supplyUnderlyingAmount).eq(0)}
        isLoading={
          supplyMarketState === 'confirming' ||
          supplyMarketState === 'executing'
        }
        onClick={supplyMarket}
      >
        {getSupplyActionButtonLabel()}
      </DialogActionButton>
    </Box>
  )
}
