import useFragmentState from '@swarm/core/hooks/state/useFragmentState'
import { calculateVolume } from '@swarm/core/shared/utils/calculations'
import { big, ZERO } from '@swarm/core/shared/utils/helpers/big-helpers'
import { useReadyState } from '@swarm/core/web3'
import { PoolExpanded } from '@swarm/types'
import { LiquidityActionType } from '@swarm/types/props'
import { NativeToken } from '@swarm/types/tokens'
import Divider from '@swarm/ui/presentational/Divider'
import SvgIcon from '@swarm/ui/swarm/SvgIcon'
import { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Card, Flex, Text } from 'rimble-ui'

import LiquidityModals from 'src/components/Liquidity/LiquidityModals'
import useHasExtraRewards from 'src/hooks/pool/useHasExtraRewards'
import { calculateMarketCap } from 'src/shared/utils/pool'

import PoolBoxes, { PoolBoxesProps } from './PoolBoxes'
import PoolCharts from './PoolCharts'
import PoolHead from './PoolHead'
import PoolTabs from './PoolTabs'

interface PoolDetailsProps {
  pool: PoolExpanded
  poolToken: NativeToken
  reload: () => void
  loading?: boolean
}

const PoolDetails = ({
  pool,
  reload,
  poolToken,
  loading = false,
}: PoolDetailsProps) => {
  const { t } = useTranslation('pools')
  const [liquidityModalOpen, setLiquidityModalOpen] = useFragmentState<
    LiquidityActionType | ''
  >('')

  const ready = useReadyState()

  const {
    totalShares = 0,
    swapFee = 0,
    id: poolAddress,
    totalSwapVolume = '0',
    swaps = [],
    userShare,
  } = pool || {}

  const hasExtraRewards = useHasExtraRewards()

  const bigTotalShares = useMemo(() => big(totalShares), [totalShares])

  const myPoolShare = useMemo(
    () =>
      (bigTotalShares.eq(0) || !userShare
        ? ZERO
        : userShare.div(bigTotalShares)
      ).toNumber(),
    [userShare, bigTotalShares],
  )

  const calculatedLiquidity = useMemo(
    () => calculateMarketCap(pool) || 0,
    [pool],
  )

  const liquidityMultiplier = big(pool.liquidity).gt(0)
    ? big(calculatedLiquidity).div(pool.liquidity)
    : big(1)

  const bigVolume = useMemo(
    () => calculateVolume(totalSwapVolume, swaps).mul(liquidityMultiplier),
    [liquidityMultiplier, swaps, totalSwapVolume],
  )

  const poolBoxesProps: PoolBoxesProps = useMemo(
    () => ({
      swapFee: big(swapFee).times(100).toNumber(),
      liquidity: calculatedLiquidity,
      volume: bigVolume.toNumber(),
      myPoolShare,
    }),
    [bigVolume, calculatedLiquidity, myPoolShare, swapFee],
  )

  const handleAddLiquidityClick = useCallback(
    () => setLiquidityModalOpen('add'),
    [setLiquidityModalOpen],
  )

  const handleLiquidityModalClose = useCallback(
    () => setLiquidityModalOpen(''),
    [setLiquidityModalOpen],
  )

  const handleRemoveLiquidityClick = useCallback(
    () => setLiquidityModalOpen('remove'),
    [setLiquidityModalOpen],
  )

  useEffect(() => {
    if (
      (pool.isAnyAssetPaused && liquidityModalOpen === 'add') ||
      !pool.active
    ) {
      handleLiquidityModalClose()
    }
  }, [
    handleLiquidityModalClose,
    liquidityModalOpen,
    pool.active,
    pool.isAnyAssetPaused,
  ])

  return (
    <>
      <Box
        width="100%"
        bg="background"
        display="flex"
        flexDirection="column"
        alignItems="center"
        p={[3, 3, 4]}
        flexGrow={1}
      >
        <Card
          border="0"
          width="100%"
          p={4}
          borderRadius={1}
          overflow="hidden"
          display="flex"
          flexDirection="column"
          justifyContent="stretch"
        >
          <PoolHead
            poolToken={poolToken}
            isAddLiquidityDisabled={!!pool.isAnyAssetPaused}
            extraRewards={hasExtraRewards(pool)}
            isSmartPool={pool.crp}
            isAddingToken={pool.newCRPoolToken !== null}
            isChangingWeights={pool.crpoolGradualWeightsUpdate !== null}
            onAddLiquidityClick={handleAddLiquidityClick}
            onRemoveLiquidityClick={handleRemoveLiquidityClick}
          />
          {(!!pool.isAnyAssetPaused || !pool.active) && (
            <>
              <Divider my="16px" />
              <Flex justifyContent="center" alignItems="center">
                <SvgIcon name="Warning" />
                <Text.span color="warning" pl={1}>
                  {t(pool.active ? 'suspendedSoonWarning' : 'suspendedWarning')}{' '}
                  {!pool.active && myPoolShare > 0 && t('contactSupport')}
                </Text.span>
              </Flex>
            </>
          )}
          <Divider my="16px" />
          <PoolBoxes {...poolBoxesProps} />
          {poolAddress && (
            <PoolCharts
              poolAddress={poolAddress}
              liquidityMultiplier={liquidityMultiplier}
            />
          )}
          <PoolTabs
            pool={pool}
            poolToken={poolToken}
            myPoolShare={myPoolShare}
            liquidity={calculatedLiquidity}
            refreshPool={reload}
          />
        </Card>
      </Box>
      <LiquidityModals
        pool={pool}
        openModal={liquidityModalOpen}
        reload={reload}
        loading={loading || !ready}
        onClose={handleLiquidityModalClose}
      />
    </>
  )
}

export default PoolDetails
