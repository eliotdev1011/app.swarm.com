import { useCpk } from '@swarm/core/contracts/cpk'
import useDeepTranslation from '@swarm/core/hooks/i18n/useDeepTranslation'
import { big } from '@swarm/core/shared/utils/helpers/big-helpers'
import { isSameEthereumAddress } from '@swarm/core/web3'
import { PoolExpanded } from '@swarm/types'
import { NativeToken } from '@swarm/types/tokens'
import { StyledTabs } from '@swarm/ui/presentational/StyledTabs'
import StyledTab from '@swarm/ui/swarm/StyledTab'
import match from 'conditional-expression'
import { ChangeEvent, useCallback, useMemo, useState } from 'react'
import { Box } from 'rimble-ui'
import styled from 'styled-components/macro'

import PoolAboutTab from './PoolAboutTab'
import PoolBalancesTab from './PoolBalancesTab'
import PoolHoldersTab from './PoolHoldersTab'
import { PoolManageTab } from './PoolManageTab'
import PoolSwapsTab from './PoolSwapsTab'

export interface PoolTabsProps {
  pool: PoolExpanded
  liquidity: number
  poolToken: NativeToken
  myPoolShare: number
  refreshPool: () => void
}

const TabPanel = styled(Box)`
  border-top: 1px solid ${({ theme }) => theme.colors['light-gray']};
`

const PoolTabs = ({
  pool,
  poolToken,
  myPoolShare,
  liquidity,
  refreshPool,
}: PoolTabsProps) => {
  const cpk = useCpk()
  const { t } = useDeepTranslation('poolDetails', ['poolTabs', 'th'])
  const [currentPoolTabIndex, setCurrentPoolTabIndex] = useState(0)
  const {
    tokens,
    id,
    totalShares,
    holdersCount,
    swapsCount,
    addTokenTimeLockInBlocks,
    newCRPoolToken,
    crpoolGradualWeightsUpdate,
    crp,
    crpController,
  } = pool

  const swapsNumber = useMemo(() => big(swapsCount).toNumber(), [swapsCount])

  const holdersNumber = useMemo(
    () => big(holdersCount).toNumber(),
    [holdersCount],
  )

  const handleSwitchTab = useCallback(
    (event: ChangeEvent<unknown>, index: number) => {
      if (index !== currentPoolTabIndex) {
        setCurrentPoolTabIndex(index)
      }
    },
    [currentPoolTabIndex],
  )

  const isSmartPoolController =
    crp &&
    cpk !== null &&
    cpk !== undefined &&
    cpk.address !== undefined &&
    isSameEthereumAddress(cpk.address, crpController)

  return (
    <Box mt="24px">
      <StyledTabs
        value={currentPoolTabIndex}
        onChange={handleSwitchTab}
        aria-label="pool tabs"
      >
        <StyledTab label={t('balances')} amountIn={tokens.length} value={0} />
        {swapsNumber && (
          <StyledTab label={t('swaps')} amountIn={swapsNumber} value={1} />
        )}
        {holdersNumber && (
          <StyledTab label={t('holders')} amountIn={holdersNumber} value={2} />
        )}
        <StyledTab label={t('about')} value={3} />
        {isSmartPoolController && <StyledTab label={t('manage')} value={4} />}
      </StyledTabs>
      <TabPanel role="tabpanel" pt="16px">
        {match(currentPoolTabIndex)
          .equals(0)
          .then(
            <PoolBalancesTab
              myPoolShare={myPoolShare}
              tokens={tokens}
              addTokenTimeLockInBlocks={addTokenTimeLockInBlocks}
              newCRPoolToken={newCRPoolToken}
              crpoolGradualWeightsUpdate={crpoolGradualWeightsUpdate}
            />,
          )
          .equals(1)
          .then(<PoolSwapsTab poolAddress={id} />)
          .equals(2)
          .then(
            <PoolHoldersTab
              poolAddress={id}
              liquidity={liquidity}
              totalShares={big(totalShares).toNumber()}
              poolToken={poolToken}
            />,
          )
          .equals(3)
          .then(<PoolAboutTab {...pool} />)
          .equals(4)
          .then(<PoolManageTab pool={pool} refreshPool={refreshPool} />)
          .else(null)}
      </TabPanel>
    </Box>
  )
}

export default PoolTabs
