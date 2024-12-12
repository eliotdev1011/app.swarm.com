import {
  formatBigInt,
  prettifyBalance,
} from '@swarm/core/shared/utils/formatting'
import { recursiveRound } from '@swarm/core/shared/utils/math'
import Grid from '@swarm/ui/presentational/Grid'
import { useTranslation } from 'react-i18next'
import { Box, Text } from 'rimble-ui'
import styled from 'styled-components/macro'

const BoxValue = styled(Text)`
  font-weight: 700;
  font-size: 22px;
  line-height: 28px;
`
const BoxLabel = styled(Text.span)`
  color: ${({ theme }) => theme.colors.grey};
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
`
export interface PoolBoxesProps {
  liquidity: number
  swapFee: number
  volume: number
  myPoolShare: number
}

const PoolBoxes = ({
  liquidity,
  myPoolShare,
  swapFee,
  volume,
}: PoolBoxesProps) => {
  const { t } = useTranslation('poolDetails')

  return (
    <Grid
      gridTemplateColumns={['1fr 1fr', '1fr 1fr', '1fr 1fr 1fr 1fr']}
      gridGap={['48px', '32px']}
      mx="1"
      mt="2"
      mb="4"
    >
      <Box>
        <BoxValue title={`$${prettifyBalance(liquidity)}`}>
          ${formatBigInt(liquidity)}
        </BoxValue>
        <BoxLabel>{t('poolBoxes.liquidity')}</BoxLabel>
      </Box>
      <Box>
        <BoxValue title={`$${prettifyBalance(volume)}`}>
          ${formatBigInt(volume)}
        </BoxValue>
        <BoxLabel>{t('poolBoxes.volume')}</BoxLabel>
      </Box>
      <Box>
        <BoxValue>{recursiveRound(swapFee)}%</BoxValue>
        <BoxLabel>{t('poolBoxes.swapFee')}</BoxLabel>
      </Box>
      <Box>
        <BoxValue>{recursiveRound(myPoolShare * 100)}%</BoxValue>
        <BoxLabel>{t('poolBoxes.myPoolShare')}</BoxLabel>
      </Box>
    </Grid>
  )
}

export default PoolBoxes
