import { DECIMALS_PRECISION } from '@swarm/core/shared/consts'
import { isStableCoin } from '@swarm/core/shared/utils/tokens/filters'
import type { Market } from '@swarm/types/lend-borrow'
import StyledTable from '@swarm/ui/presentational/StyledTable'
import TableHead from '@swarm/ui/presentational/Table/TableHead'
import TableRow from '@swarm/ui/presentational/Table/TableRow'
import Balance from '@swarm/ui/swarm/Balance'
import TokenIcon from '@swarm/ui/swarm/TokenIcon'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Button, Text } from 'rimble-ui'

import { ShowZeroBalanceMarketsCheckbox } from 'src/components/LendBorrow/ShowZeroBalanceMarketsCheckbox'

function sortZeroUnderlyingBalancesLast(
  marketA: Market,
  marketB: Market,
): number {
  if (marketA.underlyingBalance.eq(0) && marketB.underlyingBalance.eq(0)) {
    return 0
  }
  if (marketA.underlyingBalance.eq(0)) {
    return 1
  }
  if (marketB.underlyingBalance.eq(0)) {
    return -1
  }
  return 0
}

interface Props {
  marketsToSupply: Market[]
  canSupply: boolean
  openSupplyDialog: (marketAddress: string) => void
}

export const MarketsToSupplyTable: React.FC<Props> = (props: Props) => {
  const { marketsToSupply, canSupply, openSupplyDialog } = props

  const { t } = useTranslation(['lendBorrow'])

  const [showZeroBalanceMarkets, setShowZeroBalanceMarkets] =
    useState<boolean>(false)

  const marketsToDisplay = useMemo(() => {
    if (showZeroBalanceMarkets) {
      return marketsToSupply.sort(sortZeroUnderlyingBalancesLast)
    }

    return marketsToSupply.filter((market) => {
      return market.underlyingBalance.gt(0)
    })
  }, [marketsToSupply, showZeroBalanceMarkets])

  return (
    <>
      <ShowZeroBalanceMarketsCheckbox
        isChecked={showZeroBalanceMarkets}
        setIsChecked={setShowZeroBalanceMarkets}
      />

      <Box height="16px" />

      <StyledTable>
        <TableHead
          columns={[
            {
              id: 'market',
              label: t('marketsToSupplyTable.columnsLabels.market'),
              width: '30%',
            },
            {
              id: 'walletBalance',
              label: t('marketsToSupplyTable.columnsLabels.walletBalance'),
              justify: 'center',
              width: '30%',
            },
            {
              id: 'apy',
              label: t('marketsToSupplyTable.columnsLabels.apy'),
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
                        market.underlyingBalance.eq(0) ? 'grey' : undefined
                      }
                    >
                      <Balance
                        balance={market.underlyingBalance}
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
                    disabled={
                      market.underlyingBalance.eq(0) || canSupply === false
                    }
                    onClick={() => {
                      openSupplyDialog(market.address)
                    }}
                  >
                    {t('marketsToSupplyTable.actions.supply')}
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
