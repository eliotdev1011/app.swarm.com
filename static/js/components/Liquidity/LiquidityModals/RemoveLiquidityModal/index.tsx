import config from '@swarm/core/config'
import {
  calcAmountInByPoolAmountOut,
  calcMaxPoolInBySingleOut,
} from '@swarm/core/shared/utils/calculations/pool-calc'
import { prettifyBalance } from '@swarm/core/shared/utils/formatting'
import {
  big,
  min,
  normalize,
} from '@swarm/core/shared/utils/helpers/big-helpers'
import { LiquidityModalProps } from '@swarm/types/props'
import { ExtendedPoolToken, PoolToken } from '@swarm/types/tokens'
import Dialog from '@swarm/ui/presentational/Dialog'
import SvgIcon from '@swarm/ui/swarm/SvgIcon'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Button, Flex, Loader, Text } from 'rimble-ui'

import H4 from 'src/components/Liquidity/H4'
import LiquidityAssetList from 'src/components/Liquidity/LiquidityModals/LiquidityAssetList'
import PoolOverview from 'src/components/Liquidity/PoolOverview'

import RemoveLiquidityButton from './RemoveLiquidityButton'
import RemoveMultipleAssetsRow from './RemoveMultipleAssetsRow'
import RemoveRemainingLiquidityConfirmationModal from './RemoveRemainingLiquidityConfirmationModal'
import RemoveSingleAssetRow from './RemoveSingleAssetRow'

const { isProduction } = config

const RemoveLiquidityModal = ({
  pool,
  isOpen = false,
  onClose,
  reload,
  loading = false,
}: LiquidityModalProps) => {
  const { t } = useTranslation(['liquidityModals', 'navigation', 'pools'])
  const [selectedOption, setSelectedOption] = useState<PoolToken | 'all'>('all')
  const [liquidityToRemove, setLiquidityToRemove] = useState(0)
  const [transactionLoading, setTransactionLoading] = useState(false)
  const [
    isRemoveRemainingLiquidityConfirmationModalOpen,
    setIsRemoveRemainingLiquidityConfirmationModalOpen,
  ] = useState<boolean>(false)

  const openRemovingRemainingLiquidityConfirmationModal = () => {
    setIsRemoveRemainingLiquidityConfirmationModalOpen(true)
  }
  const closeRemovingRemainingLiquidityConfirmationModal = () => {
    setIsRemoveRemainingLiquidityConfirmationModalOpen(false)
  }

  const handleOnSelection = (token: PoolToken | 'all') => {
    setLiquidityToRemove(0)
    setSelectedOption(token)
  }

  const totalShares = Number(pool?.totalShares || 0)

  const userPoolTokenBalance = useMemo(
    () => big(pool?.userShare),
    [pool?.userShare],
  )

  const userPoolShareRatio = totalShares
    ? userPoolTokenBalance.div(totalShares).toNumber()
    : 0

  useEffect(() => {
    if (pool?.isAnyAssetPaused && userPoolShareRatio > 0) {
      const firstNotPausedAsset = pool.tokens.find(
        (token) => !token?.xToken?.paused,
      )

      if (firstNotPausedAsset) {
        setSelectedOption(firstNotPausedAsset)
      }
    }
  }, [pool?.isAnyAssetPaused, pool.tokens, userPoolShareRatio])

  const multiple = selectedOption === 'all'

  const maxTokensToRedeem = useMemo(
    () =>
      multiple
        ? userPoolTokenBalance
        : min(
            calcMaxPoolInBySingleOut(pool, selectedOption as ExtendedPoolToken),
            userPoolTokenBalance,
          ),
    [multiple, pool, selectedOption, userPoolTokenBalance],
  )

  const poolTokensToRedeem = maxTokensToRedeem.times(liquidityToRemove / 100)

  const handleReload = () => {
    reload?.()
    setLiquidityToRemove(0)
    onClose?.()
  }

  const newSptBalance = userPoolTokenBalance.minus(poolTokensToRedeem)

  const poolOverviewProps = {
    poolTokensToIssue: poolTokensToRedeem,
    userPoolTokenBalance,
    tokens: pool.tokens,
    id: pool.id || '',
    swapFee: pool.swapFee,
    totalShares: pool.totalShares || '0',
  }

  const isRemovingRemainingLiquidity =
    parseInt(pool.holdersCount, 10) === 1 && liquidityToRemove === 100

  const getModalTitleText = (): React.ReactNode => {
    if (userPoolTokenBalance.gt(0)) {
      if (pool?.isAnyAssetPaused === true) {
        return (
          <>
            <SvgIcon name="Warning" />
            <Text.span color="warning" pl={2}>
              {t('pools:suspendedSoonWarning')}
            </Text.span>
          </>
        )
      }

      return t('remove.selectAssetsToRemove')
    }

    return t('remove.noAssetsToRemove')
  }

  return (
    <>
      <Dialog
        isOpen={isOpen}
        width={['100%', 'auto']}
        minWidth={[0, 0, '800px']}
        onClose={onClose}
        title={t('liquidityModals:remove.header')}
        p="24px"
      >
        <Flex overflow="hidden" display="flex" flexDirection="row">
          <PoolOverview {...poolOverviewProps} action="remove" />
          <Flex pl="24px" flex="1 1 auto" flexDirection="column">
            <H4 text={getModalTitleText()} />
            {!pool.tokens.length ? (
              <Flex justifyContent="center" alignItems="center" height="100%">
                <Loader size="48px" />
              </Flex>
            ) : (
              <>
                {!!userPoolShareRatio && !pool?.isAnyAssetPaused && (
                  <RemoveMultipleAssetsRow
                    onSelect={() => handleOnSelection('all')}
                    value={liquidityToRemove}
                    checked={selectedOption === 'all'}
                    onChange={setLiquidityToRemove}
                    disabled={transactionLoading}
                  />
                )}
                <LiquidityAssetList>
                  {pool.tokens.map((token) => (
                    <RemoveSingleAssetRow
                      key={token.address}
                      token={token}
                      sptToRemove={liquidityToRemove}
                      checked={
                        selectedOption !== 'all' &&
                        selectedOption?.address === token.address
                      }
                      onSelect={() => handleOnSelection(token)}
                      onChange={setLiquidityToRemove}
                      multiple={multiple}
                      value={normalize(
                        calcAmountInByPoolAmountOut(
                          pool,
                          userPoolTokenBalance,
                          token,
                          multiple,
                          0,
                        ),
                        token.decimals,
                      ).toNumber()}
                      // DISABLED TEMPORARILY
                      disabled={
                        (isProduction() && !pool?.isAnyAssetPaused) ||
                        !!token?.xToken?.paused ||
                        transactionLoading ||
                        !userPoolShareRatio
                      }
                    />
                  ))}
                </LiquidityAssetList>
              </>
            )}
            <Box width="100%" px={2} mb="24px">
              <Flex justifyContent="space-between" height="24px">
                <Text.span>SPT amount:</Text.span>
                <Text.span
                  color={poolTokensToRedeem.eq(0) ? 'grey' : 'danger'}
                  fontWeight={5}
                >
                  {poolTokensToRedeem.eq(0)
                    ? 0
                    : `- ${prettifyBalance(poolTokensToRedeem)}`}{' '}
                  SPT
                </Text.span>
              </Flex>
              <Flex justifyContent="space-between">
                <Text.span color="grey">Your new SPT balance:</Text.span>
                <Text.span color="grey" fontWeight={5}>
                  {prettifyBalance(newSptBalance)} SPT
                </Text.span>
              </Flex>
            </Box>
            <Box>
              {isRemovingRemainingLiquidity ? (
                <Button
                  color="primary"
                  mr={3}
                  disabled={poolTokensToRedeem.eq(0)}
                  onClick={openRemovingRemainingLiquidityConfirmationModal}
                >
                  {t('liquidityModals:remove.header')}
                </Button>
              ) : (
                <RemoveLiquidityButton
                  label={t('liquidityModals:remove.header')}
                  amountOut={poolTokensToRedeem}
                  multiple={multiple}
                  pool={pool}
                  setTransactionLoading={setTransactionLoading}
                  loading={loading || transactionLoading}
                  reload={handleReload}
                  selectedOption={
                    multiple ? undefined : (selectedOption as ExtendedPoolToken)
                  }
                />
              )}
              <Button.Outline
                color="primary"
                borderColor="primary"
                border="1.5px solid"
                onClick={onClose}
              >
                {t('navigation:back')}
              </Button.Outline>
            </Box>
          </Flex>
        </Flex>
      </Dialog>
      <RemoveRemainingLiquidityConfirmationModal
        confirmButton={
          <RemoveLiquidityButton
            label={t('liquidityModals:removeRemainingConfirmation.confirm')}
            amountOut={poolTokensToRedeem}
            multiple={multiple}
            pool={pool}
            setTransactionLoading={setTransactionLoading}
            loading={loading || transactionLoading}
            reload={handleReload}
            selectedOption={
              multiple ? undefined : (selectedOption as ExtendedPoolToken)
            }
          />
        }
        isOpen={isRemoveRemainingLiquidityConfirmationModalOpen}
        onClose={closeRemovingRemainingLiquidityConfirmationModal}
      />
    </>
  )
}

export default RemoveLiquidityModal
