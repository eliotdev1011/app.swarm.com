import { useCurrentBlockNumber } from '@swarm/core/hooks/data/useCurrentBlockNumber'
import useDeepTranslation from '@swarm/core/hooks/i18n/useDeepTranslation'
import { big } from '@swarm/core/shared/utils/helpers/big-helpers'
import { PoolExpanded } from '@swarm/types'
import { PoolTokenInfo } from '@swarm/types/tokens'
import StyledTable from '@swarm/ui/presentational/StyledTable'
import React, { useMemo } from 'react'
import styled from 'styled-components/macro'
import { layout, LayoutProps, textAlign, TextAlignProps } from 'styled-system'

import PoolBalanceRow from './PoolBalanceRow'

const Th = styled.th<LayoutProps & TextAlignProps>`
  ${layout}
  ${textAlign}
`

interface PoolBalancesTabProps
  extends Pick<
    PoolExpanded,
    | 'tokens'
    | 'addTokenTimeLockInBlocks'
    | 'newCRPoolToken'
    | 'crpoolGradualWeightsUpdate'
  > {
  myPoolShare: number
}

const PoolBalancesTab = ({
  tokens,
  myPoolShare,
  addTokenTimeLockInBlocks,
  newCRPoolToken,
  crpoolGradualWeightsUpdate,
}: PoolBalancesTabProps) => {
  const { t } = useDeepTranslation('poolDetails', [
    'poolTabs',
    'balances',
    'th',
  ])

  const currentBlockNumber = useCurrentBlockNumber()

  const remainingBlocksUntilAddTokenTimeLock =
    newCRPoolToken !== null && currentBlockNumber !== undefined
      ? parseInt(newCRPoolToken.commitBlock, 10) +
        parseInt(addTokenTimeLockInBlocks, 10) -
        currentBlockNumber
      : 0

  const tokensInfo = useMemo<PoolTokenInfo[]>(
    () =>
      tokens.map(
        ({
          address,
          name,
          symbol,
          poolBalance,
          exchangeRate,
          weight,
          targetWeight,
        }) => ({
          address,
          name,
          symbol,
          poolBalance,
          targetWeight,
          userBalance: big(poolBalance).times(myPoolShare).toNumber(),
          userAssetValue: big(poolBalance)
            .times(myPoolShare)
            .times(exchangeRate || 0)
            .toNumber(),
          weight: (weight || 0) * 100,
        }),
      ),
    [tokens, myPoolShare],
  )

  return (
    <StyledTable>
      <thead>
        <tr>
          <Th>{t('assets')}</Th>
          <Th width="120px" textAlign="right">
            {t('weight')}
          </Th>
          <Th width="120px" display={['none', 'table-cell']} textAlign="right">
            {t('poolBalance')}
          </Th>
          <Th width="120px" display={['none', 'table-cell']} textAlign="right">
            {t('myBalance')}
          </Th>
          <Th width="150px" display={['none', 'table-cell']} textAlign="right">
            {t('myAssetValue')}
          </Th>
        </tr>
      </thead>
      <tbody>
        {tokensInfo.map((tokenInfo) => {
          const remainingBlocksBeforeWeightsUpdateEndBlock =
            crpoolGradualWeightsUpdate !== null &&
            currentBlockNumber !== undefined
              ? parseInt(crpoolGradualWeightsUpdate.endBlock, 10) -
                currentBlockNumber
              : 0

          return (
            <PoolBalanceRow
              key={tokenInfo.address}
              {...tokenInfo}
              remainingBlocksBeforeWeightsUpdateEndBlock={
                remainingBlocksBeforeWeightsUpdateEndBlock
              }
            />
          )
        })}
        {newCRPoolToken !== null ? (
          <PoolBalanceRow
            key={newCRPoolToken.id}
            address={newCRPoolToken.id}
            name={newCRPoolToken.token.name}
            symbol={newCRPoolToken.token.symbol}
            weight={0}
            targetWeight={String(newCRPoolToken.weight)}
            userBalance={0}
            userAssetValue={0}
            remainingBlocksUntilAddTokenTimeLock={
              remainingBlocksUntilAddTokenTimeLock
            }
            isBeingAdded
          />
        ) : null}
      </tbody>
    </StyledTable>
  )
}

export default PoolBalancesTab
