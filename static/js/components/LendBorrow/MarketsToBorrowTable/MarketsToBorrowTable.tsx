import { DECIMALS_PRECISION } from '@swarm/core/shared/consts'
import { isStableCoin } from '@swarm/core/shared/utils/tokens/filters'
import type { Market } from '@swarm/types/lend-borrow'
import StyledTable from '@swarm/ui/presentational/StyledTable'
import TableHead from '@swarm/ui/presentational/Table/TableHead'
import TableRow from '@swarm/ui/presentational/Table/TableRow'
import Balance from '@swarm/ui/swarm/Balance'
import TokenIcon from '@swarm/ui/swarm/TokenIcon'
import Big from 'big.js'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Button, Text } from 'rimble-ui'

import { ShowNoLiquidityMarketsCheckbox } from 'src/components/LendBorrow/ShowNoLiquidityMarketsCheckbox'
import { getMaxBorrowableUnderlyingBalance } from 'src/shared/utils/lendBorrow'

function sortZeroMaxBorrowableUnderlyingBalancesLast(
  marketA: { maxBorrowableUnderlyingBalance: Big },
  marketB: { maxBorrowableUnderlyingBalance: Big },
): number {
  if (
    marketA.maxBorrowableUnderlyingBalance.eq(0) &&
    marketB.maxBorrowableUnderlyingBalance.eq(0)
  ) {
    return 0
  }
  if (marketA.maxBorrowableUnderlyingBalance.eq(0)) {
    return 1
  }
  if (marketB.maxBorrowableUnderlyingBalance.eq(0)) {
    return -1
  }
  return 0
}

interface Props {
  marketsToBorrow: Market[]
  availableDollarsCollateral: Big
  canBorrow: boolean
  openBorrowDialog: (marketAddress: string) => void
}

export const MarketsToBorrowTable: React.FC<Props> = (props: Props) => {
  const {
    marketsToBorrow,
    availableDollarsCollateral,
    canBorrow,
    openBorrowDialog,
  } = props

  const { t } = useTranslation(['lendBorrow'])

  const [showNoLiquidityMarkets, setShowNoLiquidityMarkets] =
    React.useState<boolean>(false)

  const marketsToDisplay = useMemo(() => {
    const marketsToBorrowWithMaxBorrowableUnderlyingBalance =
      marketsToBorrow.map((market) => {
        return {
          ...market,
          maxBorrowableUnderlyingBalance: getMaxBorrowableUnderlyingBalance(
            market,
            availableDollarsCollateral,
          ),
        }
      })

    if (showNoLiquidityMarkets) {
      return marketsToBorrowWithMaxBorrowableUnderlyingBalance.sort(
        sortZeroMaxBorrowableUnderlyingBalancesLast,
      )
    }

    return marketsToBorrowWithMaxBorrowableUnderlyingBalance.filter(
      (market) => {
        return market.maxBorrowableUnderlyingBalance.gt(0)
      },
    )
  }, [marketsToBorrow, availableDollarsCollateral, showNoLiquidityMarkets])

  return (
    <>
      <ShowNoLiquidityMarketsCheckbox
        isChecked={showNoLiquidityMarkets}
        setIsChecked={setShowNoLiquidityMarkets}
      />

      <Box height="16px" />

      <StyledTable>
        <TableHead
          columns={[
            {
              id: 'market',
              label: t('marketsToBorrowTable.columnsLabels.market'),
              width: '30%',
            },
            {
              id: 'maxBorrowableUnderlyingBalance',
              label: t(
                'marketsToBorrowTable.columnsLabels.maxBorrowableUnderlyingBalance',
              ),
              justify: 'center',
              width: '30%',
            },
            {
              id: 'apy',
              label: t('marketsToBorrowTable.columnsLabels.apy'),
              justify: 'center',
              width: '25%',
            },
            { id: 'actions', justify: 'flex-end', width: '30%' },
          ]}
        />
        <tbody>
          {marketsToDisplay.map((market) => {
            return (
              <TableRow key={market.address}>
                <td>
                  <Box
                    display="flex"
                    flexDirection="row"
                    justifyContent="flex-start"
                    alignItems="center"
                  >
                    <TokenIcon
                      symbol={market.underlyingSymbol}
                      width="32px"
                      height="32px"
                      marginRight="10px"
                    />
                    <Text.span flex="1" fontSize={2} fontWeight={4}>
                      {market.underlyingSymbol}
                    </Text.span>
                  </Box>
                </td>
                <td>
                  <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Text.span
                      fontSize={2}
                      color={
                        market.maxBorrowableUnderlyingBalance.eq(0)
                          ? 'grey'
                          : undefined
                      }
                    >
                      <Balance
                        balance={market.maxBorrowableUnderlyingBalance}
                        base={
                          DECIMALS_PRECISION[
                            isStableCoin(market.underlyingSymbol)
                              ? 'STABLE_COINS'
                              : 'CRYPTO_CURRENCIES'
                          ].DISPLAY_BALANCE
                        }
                      />
                    </Text.span>
                  </Box>
                </td>
                <td>
                  <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Text.span fontSize={2}>
                      {market.borrowAPY.eq(0)
                        ? '-'
                        : `${market.borrowAPY.toFixed(2)}%`}
                    </Text.span>
                  </Box>
                </td>
                <td>
                  <Button
                    px={3}
                    height="36px"
                    disabled={
                      market.maxBorrowableUnderlyingBalance.eq(0) ||
                      canBorrow === false
                    }
                    onClick={() => {
                      openBorrowDialog(market.address)
                    }}
                  >
                    {t('marketsToBorrowTable.actions.borrow')}
                  </Button>
                </td>
              </TableRow>
            )
          })}
        </tbody>
      </StyledTable>
    </>
  )
}
