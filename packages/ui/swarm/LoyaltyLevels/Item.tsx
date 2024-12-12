import { useSmt } from '@swarm/core/hooks/data/useSmt'
import { formatBigInt } from '@swarm/core/shared/utils/formatting'
import SectionBadge from '@ui/presentational/SectionBadge'
import SymbolChip from '@ui/presentational/SymbolChip'
import { Color } from '@ui/theme'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { Box, Flex, Loader, Text } from 'rimble-ui'
import styled from 'styled-components/macro'

import { ILoyaltyLevel } from './interfaces'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px;
  width: 100%;
  background: #ffffff;
  box-shadow: 0px 2px 2px rgba(152, 162, 179, 0.15),
    0px 12px 24px rgba(152, 162, 179, 0.15);
  border-radius: 8px;
  color: ${Color.grey};
`

const TitleLabel = styled.p`
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  line-height: 32px;
  margin: 8px 0 0 0;
`

const BottomSection = styled.div<{ isUpgrade: boolean }>`
  display: flex;
  width: -webkit-fill-available;
  height: -webkit-fill-available;
  justify-content: center;
  align-items: center;
  border-top: 1px solid ${Color.border};
  padding: 12px;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  cursor: ${(props) => (props.isUpgrade ? 'pointer' : 'unset')};
  background-color: ${(props) => (props.isUpgrade ? Color.primary : 'none')};
`

interface BottomLabelProps {
  unlocked: boolean | false
  level: ILoyaltyLevel
  onClose: () => void
}

const BottomLabel = ({ level, unlocked, onClose }: BottomLabelProps) => {
  const { t } = useTranslation('pools')
  const history = useHistory()
  const { address: tokenId } = useSmt()

  const onUpgrade = useCallback(() => {
    onClose()

    if (tokenId) {
      const params = new URLSearchParams(
        history.location.pathname.includes('/swap')
          ? history.location.search
          : undefined,
      )

      params.set('tokenOut', tokenId)

      if (level.forecast) {
        params.set('amountOut', level.forecast)
      }

      history.push({
        pathname: '/swap',
        search: params.toString(),
      })
    }
  }, [level, tokenId, history, onClose])

  if (unlocked) {
    return (
      <Text fontWeight="4" fontSize="1">
        {t('rewardsBalance.loyaltyLevel.unlocked').toUpperCase()}
      </Text>
    )
  }

  if (level.current) {
    return (
      <Text fontWeight="4" fontSize="1" color={Color.primary}>
        {t('rewardsBalance.loyaltyLevel.current').toUpperCase()}
      </Text>
    )
  }

  return (
    <Box onClick={onUpgrade}>
      <Flex style={{ justifyContent: 'center' }}>
        <Text
          fontWeight="4"
          color={Color.background}
          style={{ marginRight: 6 }}
        >
          {level.forecast === '0' ? '---' : formatBigInt(level.forecast)}
        </Text>
        <SymbolChip>
          <Text fontWeight="3" fontSize="0" color={Color.primary}>
            {t('rewardsBalance.smt')}
          </Text>
        </SymbolChip>
      </Flex>
      <Text fontWeight="4" fontSize="1" color={Color.background}>
        {t('rewardsBalance.loyaltyLevel.toUpgrade').toUpperCase()}
      </Text>
    </Box>
  )
}

interface BoostLabelProps {
  level: ILoyaltyLevel
}

const BoostLabel = ({ level }: BoostLabelProps) => {
  const { t } = useTranslation('pools')
  const label =
    level.id === 'standard'
      ? level.boostPercents
      : `${level.boostPercents} ${t('rewardsBalance.loyaltyLevel.boost')}`

  return (
    <Text
      fontWeight="5"
      fontSize="2"
      lineHeight="2"
      style={{ padding: '16px 0', color: Color.black }}
    >
      {label}
    </Text>
  )
}

export interface LoyaltyLevelSSProps {
  loading: boolean | false
  unlocked: boolean | false
  level: ILoyaltyLevel
  onClose: () => void
}

const LoyaltyLevelItem = ({
  level,
  loading,
  onClose,
  unlocked,
}: LoyaltyLevelSSProps) => {
  const border = level.current ? `2px solid ${Color.primary}` : 'none'

  return (
    <>
      {loading ? (
        <Text.span fontWeight={2} color="grey" textAlign="center">
          <Loader size="30px" m="auto" />
        </Text.span>
      ) : (
        <Container style={{ border }}>
          <SectionBadge style={{ background: level.color }} />
          <TitleLabel style={{ color: level.color }}>{level.label}</TitleLabel>
          <BoostLabel level={level} />
          <BottomSection isUpgrade={!level.current}>
            <BottomLabel level={level} unlocked={unlocked} onClose={onClose} />
          </BottomSection>
        </Container>
      )}
    </>
  )
}

export { LoyaltyLevelItem }
