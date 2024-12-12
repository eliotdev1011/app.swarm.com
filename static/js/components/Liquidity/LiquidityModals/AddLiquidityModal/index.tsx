import {
  calcMaxAmountsIn,
  calcPoolOutGivenSingleIn,
  calcPoolTokensByRatio,
} from '@swarm/core/shared/utils/calculations/pool-calc'
import { propEquals } from '@swarm/core/shared/utils/collection/filters'
import { prettifyBalance } from '@swarm/core/shared/utils/formatting'
import { big } from '@swarm/core/shared/utils/helpers/big-helpers'
import { LiquidityModalProps } from '@swarm/types/props'
import { ExtendedPoolToken } from '@swarm/types/tokens'
import Dialog from '@swarm/ui/presentational/Dialog'
import Alert from '@swarm/ui/swarm/AlertPanel/Alert'
import TransactionForbidden from '@swarm/ui/swarm/FlashToasts/TransactionForbidden'
import { Formik } from 'formik'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Button, Flex, Loader, Text } from 'rimble-ui'

import H4 from 'src/components/Liquidity/H4'
import AddLiquidityAssetList from 'src/components/Liquidity/LiquidityModals/AddLiquidityModal/AddLiquidityAssetList'
import PoolOverview from 'src/components/Liquidity/PoolOverview'
import {
  calculateRatio,
  matchPoolHasReachedLiquidityCap,
} from 'src/shared/utils/pool'

import AddLiquidityButton from './AddLiquidityButton'
import ValidationError from './ValidationErrors'
import { initialValues } from './consts'

const AddLiquidityModal = ({
  pool,
  isOpen = false,
  onClose,
  reload,
  loading = false,
}: LiquidityModalProps) => {
  const { t } = useTranslation(['liquidityModals', 'navigation'])
  const [selectedOption, setSelectedOption] = useState<
    ExtendedPoolToken | 'all'
  >('all')

  // Ensure the best option is always selected based on available balances
  const lastPoolTokensBalancesRef = useRef<
    Array<{ address: string; usdBalance: number }>
  >([])
  useEffect(() => {
    const poolTokensBalances = pool.tokens.map((poolToken) => {
      return {
        address: poolToken.address,
        usdBalance:
          poolToken.usdBalance !== undefined ? poolToken.usdBalance : 0,
      }
    })

    const haveBalancesChanged = pool.tokens.some((poolToken) => {
      const lastPoolTokenBalance = lastPoolTokensBalancesRef.current.find(
        propEquals('address', poolToken.address),
      )
      if (lastPoolTokenBalance === undefined) {
        return true
      }
      return lastPoolTokenBalance.usdBalance !== poolToken.usdBalance
    })

    if (haveBalancesChanged) {
      return
    }

    lastPoolTokensBalancesRef.current = poolTokensBalances

    const multipleAvailable = pool.tokens.every(
      ({ usdBalance }) => !!usdBalance,
    )
    const firstPositiveToken = pool.tokens.find(
      ({ usdBalance }) => !!usdBalance,
    )
    if (multipleAvailable) {
      setSelectedOption('all')
    } else if (firstPositiveToken) {
      setSelectedOption(firstPositiveToken)
    }
  }, [pool.tokens])

  // Keep the same selected option by address if the pool tokens objects change
  useEffect(() => {
    if (selectedOption !== 'all') {
      const newToken = pool.tokens.find(
        propEquals('address', (selectedOption as ExtendedPoolToken)?.address),
      )

      if (newToken && selectedOption !== newToken) {
        setSelectedOption(newToken)
      }
    }
  }, [pool.tokens, selectedOption])

  const [liquidityToAdd, setLiquidityToAdd] = useState(0)
  const [transactionLoading, setTransactionLoading] = useState(false)
  const handleOnSelection = (token: ExtendedPoolToken | 'all') => {
    setLiquidityToAdd(0)
    setSelectedOption(token)
  }

  const multiple = selectedOption === 'all'

  const maxAmountsIn = useMemo(
    () => calcMaxAmountsIn(pool.tokens),
    [pool.tokens],
  )

  const ratio =
    multiple && pool.tokens?.length
      ? (liquidityToAdd / 100) * calculateRatio(pool.tokens)
      : 0

  const poolTokensToIssue = multiple
    ? calcPoolTokensByRatio(ratio, pool.totalShares)
    : calcPoolOutGivenSingleIn(
        liquidityToAdd,
        selectedOption as ExtendedPoolToken,
        pool,
      )

  const userPoolTokenBalance = big(pool?.userShare)

  const newSptBalance = poolTokensToIssue.add(userPoolTokenBalance)

  const poolOverviewProps = {
    poolTokensToIssue,
    userPoolTokenBalance,
    tokens: pool.tokens,
    id: pool.id || '',
    swapFee: pool.swapFee,
    totalShares: pool.totalShares || '0',
    action: 'add',
  }

  const handleReload = () => {
    reload?.()
    setLiquidityToAdd(0)
    onClose?.()
  }

  const hasReachedLiquidityCap = matchPoolHasReachedLiquidityCap(pool)
  const willReachLiquidityCap =
    hasReachedLiquidityCap === false &&
    matchPoolHasReachedLiquidityCap({
      cap: pool.cap,
      totalShares: big(pool.totalShares).add(poolTokensToIssue).toFixed(0),
    })

  return (
    <Dialog
      isOpen={isOpen}
      width={['100%', 'auto']}
      minWidth={[0, 0, '800px']}
      onClose={onClose}
      title={t('liquidityModals:add.header')}
      p="24px"
    >
      <TransactionForbidden />
      {hasReachedLiquidityCap ? (
        <Alert title={t('add.liquidityCapAlert.title')} controls={null}>
          {t('add.liquidityCapAlert.content')}
        </Alert>
      ) : null}
      {willReachLiquidityCap ? (
        <Alert title={t('add.futureLiquidityCapAlert.title')} controls={null}>
          {t('add.futureLiquidityCapAlert.content')}
        </Alert>
      ) : null}
      <Flex overflow="hidden" display="flex" flexDirection="row">
        <PoolOverview {...poolOverviewProps} action="add" />
        <Formik initialValues={initialValues} onSubmit={() => {}}>
          <Flex pl="24px" flex="1 1 auto" flexDirection="column">
            <H4 text={t('add.selectAssetsToAdd')} />
            {!pool.tokens.length ? (
              <Flex justifyContent="center" alignItems="center" height="100%">
                <Loader size="48px" />
              </Flex>
            ) : (
              <AddLiquidityAssetList
                tokens={pool.tokens}
                selected={
                  selectedOption === 'all'
                    ? selectedOption
                    : selectedOption?.address
                }
                onSelection={handleOnSelection}
                value={liquidityToAdd}
                onChange={setLiquidityToAdd}
                maxAmountsIn={maxAmountsIn}
                disabled={transactionLoading}
              />
            )}
            <Box width="100%" px={2} mb="24px">
              <Flex justifyContent="space-between" height="24px">
                <Text.span>SPT amount:</Text.span>
                <Text.span
                  color={poolTokensToIssue.eq(0) ? 'grey' : 'success'}
                  fontWeight={5}
                >
                  {poolTokensToIssue.eq(0)
                    ? 0
                    : `+ ${prettifyBalance(poolTokensToIssue)}`}{' '}
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
            <ValidationError px={2} mb={3} />
            <Flex alignItems="center">
              <AddLiquidityButton
                pool={pool}
                multiple={multiple}
                selectedOption={
                  multiple ? undefined : (selectedOption as ExtendedPoolToken)
                }
                reload={handleReload}
                amountOut={poolTokensToIssue}
                loading={loading || transactionLoading}
                isDisabled={hasReachedLiquidityCap}
                setTransactionLoading={setTransactionLoading}
              />
              <Button.Outline
                color="primary"
                borderColor="primary"
                border="1.5px solid"
                onClick={onClose}
              >
                {t('navigation:back')}
              </Button.Outline>
            </Flex>
          </Flex>
        </Formik>
      </Flex>
    </Dialog>
  )
}

export default AddLiquidityModal
