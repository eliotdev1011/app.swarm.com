import Divider from '@ui/presentational/Divider'
import Grid from '@ui/presentational/Grid'
import Tooltip from '@ui/presentational/Tooltip'
import { Color } from '@ui/theme'
import { useTranslation } from 'react-i18next'
import { Box, Button, Flex, Text } from 'rimble-ui'
import styled from 'styled-components/macro'

import { LoyaltyLevelItem } from './Item'
import { ILoyaltyLevel } from './interfaces'
import useLoyaltyLevel from './useLoyaltyLevel'

const TitleLabel = styled.p`
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  line-height: 28px;
  color: ${Color.grey};
  margin: 0 8px 0 0;
`

interface LoyaltyLevelsTitleProps {
  level: ILoyaltyLevel
}

const LoyaltyLevelsTitle = ({ level }: LoyaltyLevelsTitleProps) => {
  const { t } = useTranslation('pools')

  return (
    <Flex>
      <Box width={1 / 2}>
        <Flex style={{ alignItems: 'center' }}>
          <TitleLabel>{t('rewardsBalance.loyaltyLevel.title')}</TitleLabel>
          <Tooltip
            placement="top"
            message={t('rewardsBalance.loyaltyLevelTooltip')}
          >
            <Button variant="plain" height="16px" icononly icon="Help" />
          </Tooltip>
        </Flex>
      </Box>
      <Box width={1 / 2} style={{ textAlign: 'right' }}>
        <Text fontWeight="bold" fontSize="3" color={Color.black}>
          {level.label}
        </Text>
      </Box>
    </Flex>
  )
}

export interface LoyaltyLevelsProps {
  onClose: () => void
}

const LoyaltyLevels = ({ onClose }: LoyaltyLevelsProps) => {
  const {
    loading,
    loyaltyLevels,
    loyaltyLevel,
    currentLoyaltyLevelIndex,
  } = useLoyaltyLevel()

  if (!loyaltyLevel) {
    return <></>
  }

  return (
    <>
      <LoyaltyLevelsTitle level={loyaltyLevel} />
      <Divider />
      <Grid gridTemplateColumns="1fr 1fr 1fr 1fr" gridGap={[3, 3, 3]}>
        {loyaltyLevels.map((level, index) => {
          return (
            <LoyaltyLevelItem
              onClose={onClose}
              key={`loyalty-${level.id}`}
              unlocked={index < currentLoyaltyLevelIndex}
              level={level}
              loading={loading}
            />
          )
        })}
      </Grid>
    </>
  )
}

export default LoyaltyLevels
