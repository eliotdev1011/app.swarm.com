import { Icon } from '@rimble/icons'
import config from '@swarm/core/config'
import useRequest from '@swarm/core/hooks/async/useRequest'
import useFeatureFlags, {
  FlaggedFeatureName,
} from '@swarm/core/hooks/data/useFeatureFlags'
import { useSmt } from '@swarm/core/hooks/data/useSmt'
import api from '@swarm/core/services/api'
import {
  prettifyBalance,
  truncateStringInTheMiddle,
} from '@swarm/core/shared/utils'
import { unifyAddress } from '@swarm/core/web3'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { Box, Button, Link, Text } from 'rimble-ui'
import styled from 'styled-components/macro'

import Tooltip from '@ui/presentational/Tooltip'
import FlaggedFeature from '@ui/swarm/FlaggedFeature'

import { useSnackbar } from '../../Snackbar'
import { AlertVariant } from '../../Snackbar/types'
import SvgIcon from '../../SvgIcon'

import { ISmtSupplyResponse } from './interfaces'

const { resources } = config

interface TokenInfoProps {
  releaseThisWeek: number
  onClosePopup: () => void
}

interface ProgressBarProps {
  value: number
}

const Container = styled.div`
  display: block;
`

const InfoHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 8px 0;
`

const InfoContent = styled.div`
  margin: 30px 0 40px 0;
`

const InfoContentItem = styled.div`
  display: flex;
  padding: 17px 0;
  justify-content: space-between;
  border-bottom: 1px solid ${(props) => props.theme.colors.greyBackground};
`

const InfoContentItemLabel = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  color: grey;
`

const InfoContentValue = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const InfoContentValueLabel = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  line-height: 26px;
  color: ${(props) => props.color || '#262626'};
`

const BalanceInfoLabel = styled.p`
  font-style: normal;
  font-weight: bold;
  font-size: 32px;
  line-height: 40px;
  color: #262626;
  margin: 5px 0 0 0;
`

const TokenId = styled.div`
  display: flex;
  max-width: 300px;
  margin-top: 5px;

  span {
    word-break: break-word;
    text-align: center;
    color: grey;
  }
`

const ReleaseDistributionsTitle = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid ${(props) => props.theme.colors.greyBackground};
`

const RewardsDistribution = styled.div`
  .labels {
    display: grid;
    grid-template-columns: 3fr 1fr;
    margin-bottom: 5px;
  }

  .process {
    display: grid;
    grid-template-columns: 3fr 1fr;

    .block {
      height: 42px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: ${(props) => props.theme.colors.greyBackground};
      cursor: pointer;
      border: 3px solid white;

      &:last-child {
        padding-right: 0;
      }

      span {
        font-size: 18px;
        font-weight: 700;
        color: #262626;
      }
    }
  }
`

const ProgressBarWrapper = styled.div`
  position: relative;
  margin-top: 35px;

  .step-labels {
    display: grid;
    grid-template-columns: 30.58% 13.96% 8.41% 47.05%;

    .step {
      display: flex;
      flex-direction: column;
      align-items: flex-end;

      &:last-child {
        .label {
          margin: 0;
        }
      }

      .label {
        margin-right: -5px;
        color: grey;
        font-size: 14px;
        font-weight: 600;
      }

      .bar {
        margin-top: 5px;
        width: 5px;
        height: 40px;
        background-color: white;
        z-index: ${({ theme }) => theme.zIndices.tokenInfoProgressBar};
      }
    }
  }
`

const ProgressBar = styled.div<ProgressBarProps>`
  position: absolute;
  bottom: 0;
  height: 40px;
  width: 100%;
  background-image: linear-gradient(
    to right,
    ${(props) => props.theme.colors.primary} ${(props) => props.value || 0}%,
    ${(props) => props.theme.colors.greyBackground}
      ${(props) => props.value || 0}%
  );
`

const RewardsIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: ${({ theme }) =>
    `linear-gradient(37.2deg, ${theme.colors['primary-lighter-variant']} 20.15%, ${theme.colors.primary} 87.15%)`};
`

const TokenInfo = ({ releaseThisWeek, onClosePopup }: TokenInfoProps) => {
  const { t } = useTranslation('pools')
  const history = useHistory()
  const { address: tokenId } = useSmt()
  const { addAlert } = useSnackbar()
  const { checkFeature } = useFeatureFlags()

  const { data } = useRequest<() => Promise<ISmtSupplyResponse>>(
    api.getSMTSupply,
  )

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(unifyAddress(text))
    addAlert(
      t('rewardsBalance.copiedToClipboard', {
        address: truncateStringInTheMiddle(text),
      }),
      {
        variant: AlertVariant.success,
      },
    )
  }

  const circulatingPercent = useMemo(() => {
    if (data) {
      return (
        (Number(data.attributes.circulating_supply) * 100) /
        Number(data.attributes.total_supply)
      )
    }
    return 0
  }, [data])

  const gotoSwap = () => {
    history.push(`/swap?tokenOut=${tokenId}`)
    onClosePopup()
  }

  return (
    <Container>
      <InfoHeader>
        <RewardsIcon>
          <SvgIcon name="RewardsWhite" width={58} height={43} />
        </RewardsIcon>
        <BalanceInfoLabel>{t('rewardsBalance.tokenInfo')}</BalanceInfoLabel>
        <TokenId>
          <Tooltip placement="top" message={t('rewardsBalance.copyAddress')}>
            <Button
              variant="plain"
              height="16px"
              icononly
              icon="ContentCopy"
              onClick={() => copyToClipboard(tokenId || '')}
            />
          </Tooltip>
          <Text.span>{tokenId || ''}</Text.span>
        </TokenId>
      </InfoHeader>
      <ProgressBarWrapper>
        <div className="step-labels">
          <div className="step">
            <span className="label">Y1</span>
            <span className="bar" />
          </div>
          <div className="step">
            <span className="label">Y2</span>
            <span className="bar" />
          </div>
          <div className="step">
            <span className="label">Y3</span>
            <span className="bar" />
          </div>
          <div className="step">
            <span className="label">max</span>
          </div>
        </div>
        <ProgressBar value={circulatingPercent} />
      </ProgressBarWrapper>
      <InfoContent>
        <InfoContentItem>
          <InfoContentItemLabel>
            {t('rewardsBalance.totalSupply')}
          </InfoContentItemLabel>
          <InfoContentValue>
            <InfoContentValueLabel>
              {prettifyBalance(Number(data?.attributes.total_supply || 0))}
            </InfoContentValueLabel>
          </InfoContentValue>
        </InfoContentItem>
        <InfoContentItem>
          <InfoContentItemLabel>
            {t('rewardsBalance.circulating')}
          </InfoContentItemLabel>
          <InfoContentValue>
            <InfoContentValueLabel>
              {prettifyBalance(
                Number(data?.attributes.circulating_supply || 0),
              )}
            </InfoContentValueLabel>
          </InfoContentValue>
        </InfoContentItem>
        <Box
          mt={4}
          mb={checkFeature(FlaggedFeatureName.liqudityProviders) ? 4 : 0}
        >
          <ReleaseDistributionsTitle>
            <Text.p color="grey" fontSize="19px" fontWeight={4} m={0}>
              {t('rewardsBalance.releaseDistributions')}
            </Text.p>
            <Tooltip
              placement="top"
              message={t('rewardsBalance.releaseDistributionsTooltip')}
            >
              <Button
                variant="plain"
                height="16px"
                icononly
                icon="Help"
                ml={2}
              />
            </Tooltip>
          </ReleaseDistributionsTitle>
          <InfoContentItem>
            <InfoContentItemLabel>
              {t('rewardsBalance.releaseThisWeek')}
            </InfoContentItemLabel>
            <InfoContentValue>
              <InfoContentValueLabel>
                {prettifyBalance(releaseThisWeek)}
              </InfoContentValueLabel>
            </InfoContentValue>
          </InfoContentItem>
          <Link
            href={resources.docs.token.smt.smtReleaseSchedule}
            color="primary"
            fontWeight={2}
            fontSize={2}
            textOverflow="ellipsis"
            display="inline-flex"
            alignItems="center"
            mt={3}
            target="_blank"
          >
            <Text.span>
              {t('rewardsBalance.decreasingReleaseSchedule')}
            </Text.span>
            <Icon name="Launch" size="20px" ml={1} />
          </Link>
        </Box>
        <FlaggedFeature name={FlaggedFeatureName.liqudityProviders}>
          <RewardsDistribution>
            <div className="labels">
              <Text.span color="grey">
                {t('rewardsBalance.liquidityProvider')}
              </Text.span>
              <Text.span color="grey">{t('rewardsBalance.trader')}</Text.span>
            </div>
            <div className="process">
              <div className="block">
                <span>75%</span>
              </div>
              <div className="block">
                <span>25%</span>
              </div>
            </div>
          </RewardsDistribution>
        </FlaggedFeature>
        <Link
          href={resources.docs.token.smt.smtReleaseSchedule}
          color="primary"
          fontWeight={2}
          fontSize={2}
          textOverflow="ellipsis"
          display="inline-flex"
          alignItems="center"
          mt={3}
          target="_blank"
        >
          <Text.span fontWeight={2}>
            {t('rewardsBalance.rewardsDistributionLogs')}
          </Text.span>
          <Icon name="Launch" size="20px" ml={1} />
        </Link>
      </InfoContent>
      <Box>
        <Button style={{ width: '100%' }} size="medium" onClick={gotoSwap}>
          {t('rewardsBalance.buySmt')}
        </Button>
      </Box>
    </Container>
  )
}

export default TokenInfo
