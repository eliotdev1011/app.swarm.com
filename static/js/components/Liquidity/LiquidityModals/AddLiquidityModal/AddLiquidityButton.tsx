import { useCpk } from '@swarm/core/contracts/cpk'
import useTransactionAlerts from '@swarm/core/hooks/i18n/useTransactionAlerts'
import usePopupState from '@swarm/core/hooks/state/usePopupState'
import {
  BALANCE_BUFFER,
  SPT_DECIMALS,
  TRANSACTION_RELOAD_DELAY,
} from '@swarm/core/shared/consts'
import { Tier } from '@swarm/core/shared/enums'
import {
  calcSingleTokenAmountInByPoolAmountOut,
  calcTokenAmountInByPoolAmountOut,
} from '@swarm/core/shared/utils/calculations/pool-calc'
import { wrap } from '@swarm/core/shared/utils/collection/wrap'
import { big, normalize } from '@swarm/core/shared/utils/helpers/big-helpers'
import wait from '@swarm/core/shared/utils/helpers/wait'
import autoRound from '@swarm/core/shared/utils/math/autoRound'
import {
  cpkAllowancesLoading,
  isLocked,
} from '@swarm/core/shared/utils/tokens/allowance'
import { isSameEthereumAddress, useAccount } from '@swarm/core/web3'
import { PoolExpanded } from '@swarm/types'
import { ExtendedPoolToken } from '@swarm/types/tokens'
import SmartButton from '@swarm/ui/swarm/Buttons/SmartButton'
import { useSnackbar } from '@swarm/ui/swarm/Snackbar'
import { BigSource } from 'big.js'
import { TransactionResult } from 'contract-proxy-kit'
import { ethers } from 'ethers'
import { useFormikContext } from 'formik'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader } from 'rimble-ui'

import CpkBalanceModal from 'src/components/CpkBalanceModal'
import { BPoolProxy } from 'src/contracts/BPoolProxy'
import { CRPoolProxy } from 'src/contracts/SmartPools/CRPoolProxy'

import { AddLiquidityValues } from './types'

interface AddLiquidityButtonProps {
  multiple: boolean
  loading?: boolean
  isDisabled?: boolean
  selectedOption?: ExtendedPoolToken
  pool: PoolExpanded
  amountOut: BigSource
  reload?: () => void
  setTransactionLoading: (val: boolean) => void
}

const getAmountIn = (
  amountOut: BigSource,
  pool: PoolExpanded,
  token: ExtendedPoolToken,
  multiple: boolean,
  tolerance = BALANCE_BUFFER,
) => {
  return multiple
    ? calcTokenAmountInByPoolAmountOut(pool, amountOut, token, tolerance)
    : calcSingleTokenAmountInByPoolAmountOut(pool, amountOut, token, tolerance)
}

const AddLiquidityButton = ({
  multiple,
  selectedOption,
  pool,
  amountOut,
  reload,
  loading = false,
  isDisabled = false,
  setTransactionLoading,
}: AddLiquidityButtonProps) => {
  const { t } = useTranslation(['common', 'liquidityModals'])
  const account = useAccount()
  const cpk = useCpk()

  const [tokenBeingEnabled, setTokenBeingEnabled] =
    useState<ExtendedPoolToken | null>(null)

  const cpkBalanceModal = usePopupState(false)
  const [isCpkBalanceModalConfirmed, setIsCpkBalanceModalConfirmed] =
    useState(false)

  const { reportError } = useSnackbar()
  const { track } = useTransactionAlerts()

  const { isValid } = useFormikContext<AddLiquidityValues>()

  const tokensToCheckAllowance = useMemo(
    () => (multiple ? pool.tokens : wrap(selectedOption)),
    [multiple, pool.tokens, selectedOption],
  )

  const areAllowancesLoading = useMemo(
    () => cpkAllowancesLoading(tokensToCheckAllowance, account),
    [account, tokensToCheckAllowance],
  )

  const firstLockedToken = useMemo(
    () =>
      areAllowancesLoading
        ? undefined
        : tokensToCheckAllowance.find((token) =>
            isLocked(
              token,
              normalize(
                getAmountIn(amountOut, pool, token, multiple),
                token.decimals,
              ),
            ),
          ),
    [amountOut, areAllowancesLoading, multiple, pool, tokensToCheckAllowance],
  )

  const willUseCpkBalance = multiple
    ? pool.tokens.some((token) => token.xToken?.cpkBalance?.gt(0))
    : selectedOption?.xToken?.cpkBalance?.gt(0)

  const enable = useCallback(
    async (tokenToEnable: ExtendedPoolToken) => {
      setTokenBeingEnabled(tokenToEnable)
      try {
        const tx = await tokenToEnable.contract?.enableToken(cpk?.address || '')

        await track(tx, {
          confirm: {
            secondaryMessage: t('common:token.enabled', {
              token: tokenToEnable.name,
            }),
          },
        })

        await wait(2000)
      } catch (e) {
        reportError(e)
      } finally {
        setTokenBeingEnabled(null)
      }
    },
    [cpk?.address, track, t, reportError],
  )

  const addLiquidity = useCallback(async () => {
    if (!account) {
      return
    }

    if (
      willUseCpkBalance &&
      !cpkBalanceModal.isOpen &&
      !isCpkBalanceModalConfirmed
    ) {
      cpkBalanceModal.open()
      return
    }

    setIsCpkBalanceModalConfirmed(false)

    setTransactionLoading(true)

    try {
      const tx = await BPoolProxy.joinPool(
        account,
        pool,
        multiple ? pool.tokens : (selectedOption as ExtendedPoolToken),
        amountOut,
      )

      if (tx) {
        await track(tx, {
          confirm: {
            secondaryMessage: t('liquidityModals:addSuccess', {
              amount: autoRound(amountOut),
            }),
          },
        })

        setTimeout(() => reload?.(), TRANSACTION_RELOAD_DELAY)
      }
    } catch (e) {
      reportError(e)
    } finally {
      setTransactionLoading(false)
    }
  }, [
    account,
    amountOut,
    cpkBalanceModal,
    isCpkBalanceModalConfirmed,
    multiple,
    pool,
    reload,
    reportError,
    selectedOption,
    setTransactionLoading,
    t,
    track,
    willUseCpkBalance,
  ])

  const addLiquidityToSmartPool = useCallback(async () => {
    if (!account) {
      return
    }

    if (
      willUseCpkBalance &&
      !cpkBalanceModal.isOpen &&
      !isCpkBalanceModalConfirmed
    ) {
      cpkBalanceModal.open()
      return
    }

    setIsCpkBalanceModalConfirmed(false)

    setTransactionLoading(true)

    try {
      const crpoolProxyContract = await CRPoolProxy.getInstance()

      let tx: TransactionResult | undefined

      if (multiple) {
        tx = await crpoolProxyContract.joinPool(
          account,
          pool.controller,
          pool.tokensList,
          pool.tokensList.map((tokenAddress) => {
            const token = pool.tokens.find((poolToken) => {
              return isSameEthereumAddress(poolToken.xToken?.id, tokenAddress)
            })
            if (token === undefined) {
              return ethers.BigNumber.from(0)
            }
            return ethers.BigNumber.from(
              getAmountIn(amountOut, pool, token, true).toFixed(0),
            )
          }),
          ethers.utils.parseUnits(
            big(amountOut).toFixed(SPT_DECIMALS),
            SPT_DECIMALS,
          ),
        )
      } else if (selectedOption !== undefined) {
        tx = await crpoolProxyContract.joinswapExternAmountIn(
          account,
          pool.controller,
          selectedOption.address,
          ethers.BigNumber.from(
            getAmountIn(amountOut, pool, selectedOption, false).toFixed(0),
          ),
          ethers.utils.parseUnits(
            big(amountOut).toFixed(SPT_DECIMALS),
            SPT_DECIMALS,
          ),
        )
      }

      if (tx !== undefined) {
        await track(tx, {
          confirm: {
            secondaryMessage: t('liquidityModals:addSuccess', {
              amount: autoRound(amountOut),
            }),
          },
        })

        setTimeout(() => reload?.(), TRANSACTION_RELOAD_DELAY)
      }
    } catch (e) {
      reportError(e)
    } finally {
      setTransactionLoading(false)
    }
  }, [
    account,
    amountOut,
    cpkBalanceModal,
    isCpkBalanceModalConfirmed,
    multiple,
    pool,
    reload,
    reportError,
    selectedOption,
    setTransactionLoading,
    t,
    track,
    willUseCpkBalance,
  ])

  const handleCpkBalanceModalConfirm = useCallback(async () => {
    cpkBalanceModal.close()
    setIsCpkBalanceModalConfirmed(true)

    if (pool.crp) {
      await addLiquidityToSmartPool()
    } else {
      await addLiquidity()
    }
  }, [addLiquidity, addLiquidityToSmartPool, cpkBalanceModal, pool.crp])

  const handleClick = useCallback(async () => {
    if (firstLockedToken !== undefined) {
      return enable(firstLockedToken)
    }
    return pool.crp ? addLiquidityToSmartPool() : addLiquidity()
  }, [
    firstLockedToken,
    pool.crp,
    addLiquidityToSmartPool,
    addLiquidity,
    enable,
  ])

  return (
    <>
      <SmartButton
        requireInitiated
        requireAccount
        requireTier={Tier.tier1}
        mr={3}
        disabled={
          loading ||
          areAllowancesLoading ||
          (firstLockedToken === undefined && big(amountOut).eq(0)) ||
          !isValid ||
          isDisabled
        }
        loading={loading || areAllowancesLoading}
        onClick={handleClick}
        loadingText={
          <>
            <Loader mr={2} color="white" />
            {tokenBeingEnabled !== null
              ? t('common:token.enabling', { token: tokenBeingEnabled.symbol })
              : t('liquidityModals:add.header')}
          </>
        }
      >
        {firstLockedToken !== undefined
          ? t('common:token.enable', { token: firstLockedToken.symbol })
          : t('liquidityModals:add.header')}
      </SmartButton>
      <CpkBalanceModal
        onClose={cpkBalanceModal.close}
        isOpen={cpkBalanceModal.isOpen}
        onConfirm={handleCpkBalanceModalConfirm}
        tokenIn={multiple ? undefined : selectedOption}
      />
    </>
  )
}

export default AddLiquidityButton
