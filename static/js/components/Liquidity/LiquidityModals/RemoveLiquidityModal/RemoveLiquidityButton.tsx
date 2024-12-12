import useTransactionAlerts from '@swarm/core/hooks/i18n/useTransactionAlerts'
import usePopupState from '@swarm/core/hooks/state/usePopupState'
import {
  BALANCE_BUFFER,
  SPT_DECIMALS,
  TRANSACTION_RELOAD_DELAY,
} from '@swarm/core/shared/consts'
import { Tier } from '@swarm/core/shared/enums'
import {
  calcMultipleOutByPoolAmountIn,
  calcSingleOutByPoolAmountIn,
} from '@swarm/core/shared/utils/calculations/pool-calc'
import { big } from '@swarm/core/shared/utils/helpers/big-helpers'
import autoRound from '@swarm/core/shared/utils/math/autoRound'
import { isSameEthereumAddress, useAccount } from '@swarm/core/web3'
import { PoolExpanded } from '@swarm/types'
import { ExtendedPoolToken } from '@swarm/types/tokens'
import SmartButton from '@swarm/ui/swarm/Buttons/SmartButton'
import { useSnackbar } from '@swarm/ui/swarm/Snackbar'
import { BigSource } from 'big.js'
import { TransactionResult } from 'contract-proxy-kit'
import { ethers } from 'ethers'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader } from 'rimble-ui'

import CpkBalanceModal from 'src/components/CpkBalanceModal'
import { BPoolProxy } from 'src/contracts/BPoolProxy'
import { CRPoolProxy } from 'src/contracts/SmartPools/CRPoolProxy'

interface RemoveLiquidityButtonProps {
  label: string
  multiple: boolean
  loading?: boolean
  selectedOption?: ExtendedPoolToken
  pool: PoolExpanded
  amountOut: BigSource
  reload?: () => void
  setTransactionLoading: (val: boolean) => void
}

const getAmountOut = (
  amountIn: BigSource,
  pool: PoolExpanded,
  token: ExtendedPoolToken,
  multiple: boolean,
  tolerance = BALANCE_BUFFER,
) => {
  return multiple
    ? calcMultipleOutByPoolAmountIn(pool, amountIn, token, tolerance)
    : calcSingleOutByPoolAmountIn(pool, amountIn, token, tolerance)
}

const RemoveLiquidityButton = ({
  label,
  pool,
  reload,
  multiple,
  loading,
  selectedOption,
  amountOut,
  setTransactionLoading,
}: RemoveLiquidityButtonProps) => {
  const account = useAccount()
  const { t } = useTranslation(['liquidityModals', 'errors'])
  const { reportError } = useSnackbar()
  const { track } = useTransactionAlerts()

  const amountIn = useMemo(() => big(amountOut), [amountOut])

  const disabled = amountIn.eq(0) || loading

  const cpkBalanceModal = usePopupState(false)
  const [isCpkBalanceModalConfirmed, setIsCpkBalanceModalConfirmed] =
    useState(false)

  const willReceiveCpkBalance = multiple
    ? pool.tokens.some((token) => token.xToken?.cpkBalance?.gt(0))
    : selectedOption?.xToken?.cpkBalance?.gt(0)

  const removeLiquidity = useCallback(async () => {
    if (!account) {
      return
    }

    if (
      willReceiveCpkBalance &&
      !cpkBalanceModal.isOpen &&
      !isCpkBalanceModalConfirmed
    ) {
      cpkBalanceModal.open()
      return
    }

    setIsCpkBalanceModalConfirmed(false)

    setTransactionLoading(true)

    try {
      const tx = await BPoolProxy.exitPool(
        account,
        pool,
        multiple ? pool.tokens : (selectedOption as ExtendedPoolToken),
        amountIn,
      )

      if (tx) {
        await track(tx, {
          confirm: {
            secondaryMessage: t('liquidityModals:removeSuccess', {
              amount: autoRound(amountIn),
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
    willReceiveCpkBalance,
    cpkBalanceModal,
    isCpkBalanceModalConfirmed,
    setTransactionLoading,
    pool,
    multiple,
    selectedOption,
    amountIn,
    track,
    t,
    reload,
    reportError,
  ])

  const removeLiquidityToSmartPool = useCallback(async () => {
    if (!account) {
      return
    }

    if (
      willReceiveCpkBalance &&
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
        tx = await crpoolProxyContract.exitPool(
          account,
          pool.controller,
          pool.tokensList,
          ethers.utils.parseUnits(big(amountOut).toFixed(0), SPT_DECIMALS),
          pool.tokensList.map((tokenAddress) => {
            const token = pool.tokens.find((poolToken) => {
              return isSameEthereumAddress(poolToken.xToken?.id, tokenAddress)
            })
            if (token === undefined) {
              return ethers.BigNumber.from(0)
            }
            return ethers.BigNumber.from(
              getAmountOut(amountIn, pool, token, true).toFixed(0),
            )
          }),
        )
      } else if (selectedOption !== undefined) {
        tx = await crpoolProxyContract.exitswapPoolAmountIn(
          account,
          pool.controller,
          selectedOption.address,
          ethers.utils.parseUnits(
            big(amountOut).toFixed(SPT_DECIMALS),
            SPT_DECIMALS,
          ),
          ethers.BigNumber.from(
            getAmountOut(amountIn, pool, selectedOption, false).toFixed(0),
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
    amountIn,
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
    willReceiveCpkBalance,
  ])

  const handleCpkBalanceModalConfirm = useCallback(async () => {
    cpkBalanceModal.close()
    setIsCpkBalanceModalConfirmed(true)

    if (pool.crp) {
      await removeLiquidityToSmartPool()
    } else {
      await removeLiquidity()
    }
  }, [cpkBalanceModal, pool.crp, removeLiquidity, removeLiquidityToSmartPool])

  return (
    <>
      <SmartButton
        requireInitiated
        requireAccount
        requireTier={Tier.tier1}
        mr={3}
        disabled={disabled}
        loading={loading}
        onClick={pool.crp ? removeLiquidityToSmartPool : removeLiquidity}
        loadingText={
          <>
            <Loader mr={2} color="white" />
            {label}
          </>
        }
      >
        {label}
      </SmartButton>
      <CpkBalanceModal
        onClose={cpkBalanceModal.close}
        isOpen={cpkBalanceModal.isOpen}
        onConfirm={handleCpkBalanceModalConfirm}
        tokenOut={multiple ? undefined : selectedOption}
      />
    </>
  )
}

export default RemoveLiquidityButton
