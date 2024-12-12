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

import {
  getBalanceUnderlyingBalance,
  getUnderlyingBalanceDollarsAmount,
} from 'src/shared/utils/lendBorrow'

interface Props {
  suppliedMarkets: Market[]
  canRedeem: boolean
  openRedeemDialog: (marketAddress: string) => void
}

export const SuppliedMarketsTable: React.FC<Props> = (props: Props) => {
  const { suppliedMarkets, canRedeem, openRedeemDialog } = props

  const { t } = useTranslation(['lendBorrow'])

  const marketsToDisplay = useMemo(() => {
    const suppliedMarketsWithBalanceUnderlyingDetails = suppliedMarkets.map(
      (market) => {
        const suppliedUnderlyingBalance = getBalanceUnderlyingBalance(
          market.balance,
          market.exchangeRate,
        )
        const suppliedUnderlyingBalanceDollarsTotal =
          getUnderlyingBalanceDollarsAmount(suppliedUnderlyingBalance, market)
        return {
          ...market,
          suppliedUnderlyingBalance,
          suppliedUnderlyingBalanceDollarsTotal,
        }
      },
    )

    return suppliedMarketsWithBalanceUnderlyingDetails.sort(
      (marketA, marketB) => {
        return marketB.suppliedUnderlyingBalanceDollarsTotal.cmp(
          marketA.suppliedUnderlyingBalanceDollarsTotal,
        )
      },
    )
  }, [suppliedMarkets])

  if (suppliedMarkets.length === 0) {
    return <Text fontSize={2}>{t('suppliedMarketsTable.emptyNotice')}</Text>
  }

  return (
    <StyledTable>
      <TableHead
        columns={[
          {
            id: 'market',
            label: t('suppliedMarketsTable.columnsLabels.market'),
            width: '30%',
          },
          {
            id: 'suppliedUnderlyingBalance',
            label: t(
              'suppliedMarketsTable.columnsLabels.suppliedUnderlyingBalance',
            ),
            justify: 'center',
            width: '30%',
          },
          {
            id: 'apy',
            label: t('suppliedMarketsTable.columnsLabels.apy'),
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
                      balance={market.suppliedUnderlyingBalance}
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
                      balance={market.suppliedUnderlyingBalanceDollarsTotal}
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
                    {market.supplyAPY.eq(0)
                      ? '-'
                      : `${market.supplyAPY.toFixed(2)}%`}
                  </Text.span>
                </Box>
              </td>
              <td>
                <Button
                  px={3}
                  height="36px"
                  disabled={canRedeem === false}
                  onClick={() => {
                    openRedeemDialog(market.address)
                  }}
                >
                  {t('suppliedMarketsTable.actions.redeem')}
                </Button>
              </td>
            </TableRow>
          )
        })}
      </tbody>
    </StyledTable>
  )
}
