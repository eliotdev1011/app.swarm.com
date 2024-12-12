import useDeepTranslation from '@swarm/core/hooks/i18n/useDeepTranslation'
import { truncateStringInTheMiddle } from '@swarm/core/shared/utils'
import {
  formatBigInt,
  prettifyBalance,
} from '@swarm/core/shared/utils/formatting'
import { PoolExpanded } from '@swarm/types'
import Blockie from '@swarm/ui/presentational/Blockie'
import Grid from '@swarm/ui/presentational/Grid'
import ExplorerLink from '@swarm/ui/swarm/Link/ExplorerLink'
import { format, fromUnixTime } from 'date-fns'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Flex, Text } from 'rimble-ui'
import styled from 'styled-components/macro'

const StyledLabel = styled(Text)`
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.grey};

  margin-bottom: 4px;
`

const StyledText = styled(Text)`
  word-break: break-all;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  display: flex;
  flex-wrap: wrap;
  color: ${({ theme }) => theme.colors.black};
`

const StyledExplorerLink = styled(ExplorerLink)`
  text-decoration: none !important;
  color: ${({ theme }) => theme.colors['near-black']};
  word-break: break-all;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  align-items: center;
  display: flex;

  &:hover,
  &:active,
  &:focus,
  &.active {
    opacity: 1;
    color: ${({ theme }) => theme.colors.grey};
  }
`

type PoolAboutTabProps = PoolExpanded

const PoolAboutTab = ({
  controller,
  crp,
  crpController,
  cap,
  rights,
  minimumWeightChangeBlockPeriod,
  addTokenTimeLockInBlocks,
  createTime,
  publicSwap,
  totalShares,
  totalSwapFee,
  totalSwapVolume,
  tokens,
  tx,
  liquidityPoolToken,
}: PoolAboutTabProps) => {
  const { t } = useDeepTranslation('poolDetails', ['poolTabs', 'about'])
  const { t: tPoolDetails } = useTranslation('poolDetails')

  const controllerAddress = crp ? crpController : controller

  return (
    <Grid
      gridTemplateColumns={['1fr', '1fr 1fr 1fr']}
      gridGap={['16px', '32px']}
      mt="8px"
    >
      <Box>
        <StyledLabel>{t('poolType')}</StyledLabel>
        <StyledText>
          {tPoolDetails(`poolTypes.${crp ? 'smart' : 'shared'}`)}
        </StyledText>
      </Box>
      <Box>
        <StyledLabel>{t('controller')}</StyledLabel>
        <Flex>
          <Blockie address={controllerAddress} mr="8px" />
          <StyledExplorerLink type="address" hash={controllerAddress} />
        </Flex>
      </Box>
      <Box>
        <StyledLabel>{t('creationDate')}</StyledLabel>
        <StyledExplorerLink
          type="tx"
          hash={tx}
          label={useMemo(
            () => format(fromUnixTime(createTime), 'MMM dd, yyyy hh:mm aa'),
            [createTime],
          )}
        />
      </Box>
      <Box>
        <StyledLabel>{t('sptAsset')}</StyledLabel>
        <StyledExplorerLink
          type="token"
          hash={liquidityPoolToken.id}
          label={truncateStringInTheMiddle(liquidityPoolToken.id)}
        />
      </Box>
      <Box>
        <StyledLabel>{t('sptTotalSupply')}</StyledLabel>
        <StyledText title={prettifyBalance(totalShares)}>
          {formatBigInt(totalShares)}{' '}
          {tPoolDetails('poolTabs.about.sptCap', {
            cap: cap === null ? t('unlimited') : formatBigInt(cap),
          })}
        </StyledText>
      </Box>
      <Box>
        <StyledLabel>{t('assetInfo')}</StyledLabel>
        <StyledText>
          <Flex
            justifyContent="flex-start"
            alignItems="baseline"
            style={{ gap: '14px' }}
          >
            {tokens.map(({ id, symbol }) => (
              <StyledExplorerLink
                key={id}
                type="address"
                hash={id}
                label={symbol}
              />
            ))}
          </Flex>
        </StyledText>
      </Box>
      <Box>
        <StyledLabel>{t('publicSwap')}</StyledLabel>
        <StyledText>{publicSwap ? 'Enabled' : 'Disabled'}</StyledText>
      </Box>
      <Box>
        <StyledLabel>{t('totalSwapVolume')}</StyledLabel>
        <StyledText title={prettifyBalance(totalSwapVolume)}>
          $ {formatBigInt(totalSwapVolume)}
        </StyledText>
      </Box>
      <Box>
        <StyledLabel>{t('totalSwapFee')}</StyledLabel>
        <StyledText title={prettifyBalance(totalSwapFee)}>
          $ {formatBigInt(totalSwapFee)}
        </StyledText>
      </Box>
      {crp ? (
        <Box>
          <StyledLabel>{t('rights')}</StyledLabel>
          <StyledText
            flexDirection="column"
            justifyContent="flex-start"
            alignItems="flex-start"
            textAlign="left"
          >
            {rights.length > 0
              ? rights.map((right) => {
                  return (
                    <span key={right}>
                      {tPoolDetails(`smartPoolRights.${right}`)}
                    </span>
                  )
                })
              : t('none')}
          </StyledText>
        </Box>
      ) : null}
      {crp ? (
        <Box>
          <StyledLabel>{t('minimumGradualUpdateDuration')}</StyledLabel>
          <StyledText>
            {minimumWeightChangeBlockPeriod} {t('blocks')}
          </StyledText>
        </Box>
      ) : null}
      {crp ? (
        <Box>
          <StyledLabel>{t('addTokenTimeLock')}</StyledLabel>
          <StyledText>
            {addTokenTimeLockInBlocks} {t('blocks')}
          </StyledText>
        </Box>
      ) : null}
    </Grid>
  )
}

export default PoolAboutTab
