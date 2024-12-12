import { DECIMALS_PRECISION } from '@swarm/core/shared/consts'
import Balance from '@swarm/ui/swarm/Balance'
import Big from 'big.js'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Text } from 'rimble-ui'
import styled from 'styled-components/macro'

interface Props {
  borrowLimitPercentage: Big
  borrowLimitDollarsCollateral: Big
}

const Label = styled(Text)`
  color: ${({ theme }) => theme.colors.grey};
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
`

const LineContainer = styled(Box)`
  position: relative;
  width: 100%;
`
const Line = styled(Box)<{ scale: number }>`
  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  height: 4px;

  transform: scaleX(${({ scale }) => scale / 100});
  transform-origin: left center;
  transition: transform 0.3s ease-in;

  background-color: ${({ theme }) => theme.colors.background};
`

const HighlightLine = styled(Line)`
  background-color: ${({ theme }) => theme.colors.primary};
  z-index: ${({ theme }) => theme.zIndices.layerOne};
`

export const BorrowLimitStatus: React.FC<Props> = (props: Props) => {
  const { borrowLimitPercentage, borrowLimitDollarsCollateral } = props

  const { t } = useTranslation(['lendBorrow'])

  return (
    <Box
      width="100%"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
      alignItems="flex-start"
    >
      <Box
        width="100%"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="flex-end"
        marginBottom={1}
      >
        <Label>
          {t('accountStats.currentBorrowLimitPercentage', {
            percentage: borrowLimitPercentage.toFixed(2),
          })}
        </Label>
        <Label>
          $
          <Balance
            balance={borrowLimitDollarsCollateral}
            base={DECIMALS_PRECISION.DOLLARS.DISPLAY_BALANCE}
          />
        </Label>
      </Box>
      <LineContainer>
        <HighlightLine scale={borrowLimitPercentage.toNumber()} />
        <Line scale="100" />
      </LineContainer>
    </Box>
  )
}
