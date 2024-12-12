import { DECIMALS_PRECISION } from '@swarm/core/shared/consts'
import Balance from '@swarm/ui/swarm/Balance'
import Big from 'big.js'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Text } from 'rimble-ui'
import styled from 'styled-components/macro'

import { BorrowLimitStatus } from './components/BorrowLimitStatus'

interface Props {
  netAPY: Big
  suppliedMarketsDollarsTotal: Big
  borrowedMarketsDollarsDebt: Big
  borrowLimitDollarsCollateral: Big
  borrowLimitPercentage: Big
}

const DualLinesContainer = styled(Box)<{
  horizontalAlign?: 'start' | 'center' | 'end'
}>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: ${({ horizontalAlign }) => {
    if (horizontalAlign === 'center') {
      return 'center'
    }
    if (horizontalAlign === 'end') {
      return 'flex-end'
    }
    return 'flex-start'
  }};
`

const DualLinesLabel = styled(Text.span)<{
  isBig?: boolean
}>`
  color: ${({ theme }) => theme.colors.grey};
  font-weight: 600;
  font-size: ${({ isBig }) => (isBig === true ? '18px' : '14px')};
  line-height: ${({ isBig }) => (isBig === true ? '22px' : '20px')};
  margin-bottom: ${({ isBig }) => (isBig === true ? '4px' : '0px')};
`

const DualLinesValue = styled(Text)<{ isBig?: boolean }>`
  font-weight: 700;
  font-size: ${({ isBig }) => (isBig === true ? '30px' : '22px')};
  line-height: ${({ isBig }) => (isBig === true ? '36px' : '28px')};
`

export const AccountStats: React.FC<Props> = (props: Props) => {
  const {
    netAPY,
    suppliedMarketsDollarsTotal,
    borrowedMarketsDollarsDebt,
    borrowLimitDollarsCollateral,
    borrowLimitPercentage,
  } = props

  const { t } = useTranslation(['lendBorrow'])

  return (
    <Box
      width="100%"
      padding="20px 32px 26px"
      backgroundColor="white"
      borderRadius="4px"
    >
      <Box
        width="100%"
        display="flex"
        flexDirection="row"
        justifyContent="flex-start"
        alignItems="center"
      >
        <DualLinesContainer flex="1" horizontalAlign="start">
          <DualLinesLabel isBig>{t('accountStats.netAPY')}</DualLinesLabel>
          <DualLinesValue isBig>{netAPY.toFixed(2)}%</DualLinesValue>
        </DualLinesContainer>
        <Box
          flexShrink="0"
          display="flex"
          flexDirection="row"
          justifyContent="flex-end"
          alignItems="flex-start"
        >
          <DualLinesContainer horizontalAlign="end">
            <DualLinesLabel>{t('accountStats.supplyBalance')}</DualLinesLabel>
            <DualLinesValue>
              $
              <Balance
                balance={suppliedMarketsDollarsTotal}
                base={DECIMALS_PRECISION.DOLLARS.DISPLAY_BALANCE}
              />
            </DualLinesValue>
          </DualLinesContainer>

          <Box width="44px" />

          <DualLinesContainer horizontalAlign="end">
            <DualLinesLabel>{t('accountStats.borrowBalance')}</DualLinesLabel>
            <DualLinesValue>
              $
              <Balance
                balance={borrowedMarketsDollarsDebt}
                base={DECIMALS_PRECISION.DOLLARS.DISPLAY_BALANCE}
              />
            </DualLinesValue>
          </DualLinesContainer>
        </Box>
      </Box>

      <Box height="24px" />

      <BorrowLimitStatus
        borrowLimitPercentage={borrowLimitPercentage}
        borrowLimitDollarsCollateral={borrowLimitDollarsCollateral}
      />
    </Box>
  )
}
