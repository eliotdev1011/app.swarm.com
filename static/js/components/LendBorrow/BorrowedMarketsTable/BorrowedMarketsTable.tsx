import { DECIMALS_PRECISION } from '@swarm/core/shared/consts'
import { isStableCoin } from '@swarm/core/shared/utils/tokens/filters'
import type { Market } from '@swarm/types/lend-borrow'
import StyledTable from '@swarm/ui/presentational/StyledTable'
import TableHead from '@swarm/ui/presentational/Table/TableHead'
import TableRow from '@swarm/ui/presentational/Table/TableRow'
import Balance from '@swarm/ui/swarm/Balance'
import TokenIcon from '@swarm/ui/swarm/TokenIcon'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Button, Text } from 'rimble-ui'

import { REPAY_BORROW_MINIMUM_MEANINGFUL_DOLLARS_AMOUNT } from 'src/shared/consts'
import { getUnderlyingBalanceDollarsAmount } from 'src/shared/utils/lendBorrow'

interface Props {
  borrowedMarkets: Market[]
  canRepay: boolean
  openRepayDialog: (marketAddress: string) => void
}

export const BorrowedMarketsTable: React.FC<Props> = (props: Props) => {
  const { borrowedMarkets, canRepay, openRepayDialog } = props

  const { t } = useTranslation(['lendBorrow'])

  const marketsToDisplay = useMemo(() => {
    const borrowedMarketsWithBalanceUnderlyingDetails = borrowedMarkets.map(
      (market) => {
        const borrowedUnderlyingBalanceDollarsTotal =
          getUnderlyingBalanceDollarsAmount(
            market.borrowedUnderlyingBalance,
            market,
          )

        return {
          ...market,
          borrowedUnderlyingBalanceDollarsTotal,
        }
      },
    )

    return borrowedMarketsWithBalanceUnderlyingDetails
      .filter((market) => {
        return market.borrowedUnderlyingBalanceDollarsTotal.gte(
          REPAY_BORROW_MINIMUM_MEANINGFUL_DOLLARS_AMOUNT,
        )
      })
      .sort((marketA, marketB) => {
        return marketB.borrowedUnderlyingBalanceDollarsTotal.cmp(
          marketA.borrowedUnderlyingBalanceDollarsTotal,
        )
      })
  }, [borrowedMarkets])

  if (borrowedMarkets.length === 0) {
    return <Text fontSize={2}>{t('borrowedMarketsTable.emptyNotice')}</Text>
  }

  return (
    <StyledTable>
      <TableHead
        columns={[
          {
            id: 'market',
            label: t('borrowedMarketsTable.columnsLabels.market'),
            width: '30%',
          },
          {
            id: 'borrowedUnderlyingBalance',
            label: t(
              'borrowedMarketsTable.columnsLabels.borrowedUnderlyingBalance',
            ),
            justify: 'center',
            width: '30%',
          },
          {
            id: 'apy',
            label: t('borrowedMarketsTable.columnsLabels.apy'),
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
                  <Text.span fontSize={2}>
                    <Balance
                      balance={market.borrowedUnderlyingBalance}
                      base={
                        DECIMALS_PRECISION[
                          isStableCoin(market.underlyingSymbol)
                            ? 'STABLE_COINS'
                            : 'CRYPTO_CURRENCIES'
                        ].DISPLAY_BALANCE
                      }
                    />
                  </Text.span>
                  <Text.span fontSize={0} color="gray">
                    $
                    <Balance
                      balance={market.borrowedUnderlyingBalanceDollarsTotal}
                      base={DECIMALS_PRECISION.DOLLARS.DISPLAY_BALANCE}
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
                  disabled={canRepay === false}
                  onClick={() => {
                    openRepayDialog(market.address)
                  }}
                >
                  {t('borrowedMarketsTable.actions.repay')}
                </Button>
              </td>
            </TableRow>
          )
        })}
      </tbody>
    </StyledTable>
  )
}
