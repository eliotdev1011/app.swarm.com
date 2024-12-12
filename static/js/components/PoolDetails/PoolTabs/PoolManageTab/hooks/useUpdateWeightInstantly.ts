import useDeepTranslation from '@swarm/core/hooks/i18n/useDeepTranslation'
import useTransactionAlerts from '@swarm/core/hooks/i18n/useTransactionAlerts'
import { verify } from '@swarm/core/shared/utils/crypto'
import { big } from '@swarm/core/shared/utils/helpers/big-helpers'
import wait from '@swarm/core/shared/utils/helpers/wait'
import { useAccount } from '@swarm/core/web3'
import { useSnackbar } from '@swarm/ui/swarm/Snackbar'
import { ethers } from 'ethers'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { CRPoolProxy } from 'src/contracts/SmartPools/CRPoolProxy'
import { matchPoolHasReachedLiquidityCap } from 'src/shared/utils/pool'

type WeightsByTokenAddress = { [tokenAddress: string]: string }

type SetNewWeight = (tokenAddress: string, newWeight: string) => void

type UpdateWeightInstantly = (
  tokenAddress: string,
  currentTokenWeight: string,
  newTokenWeight: string,
) => Promise<void>

interface ReturnValue {
  newWeightsByTokenAddress: WeightsByTokenAddress
  isUpdatingWeight: boolean
  setNewWeight: SetNewWeight
  updateWeightInstantly: UpdateWeightInstantly
}

export function useUpdateWeightInstantly(
  pool: {
    tokens: Array<{ address: string; denormWeight: string }>
    controller: string
    totalShares: string
    cap: string | null
  },
  refreshPool: () => void,
): ReturnValue {
  const account = useAccount()
  const { track } = useTransactionAlerts()
  const { addError } = useSnackbar()
  const { t } = useDeepTranslation('poolDetails', ['poolTabs', 'manage'])

  const [newWeightsByTokenAddress, setNewWeightsByTokenAddress] =
    useState<WeightsByTokenAddress>({})
  const [isUpdatingWeight, setIsUpdatingWeight] = useState<boolean>(false)

  useEffect(() => {
    setNewWeightsByTokenAddress(
      pool.tokens.reduce<WeightsByTokenAddress>(
        (currentWeightsByTokenAddress, token) => {
          // eslint-disable-next-line no-param-reassign
          currentWeightsByTokenAddress[token.address] = token.denormWeight
          return currentWeightsByTokenAddress
        },
        {},
      ),
    )
  }, [pool.tokens])

  const setNewWeight = useCallback<SetNewWeight>((tokenAddress, newWeight) => {
    setNewWeightsByTokenAddress((currentNewWeightsByTokenAddress) => {
      return {
        ...currentNewWeightsByTokenAddress,
        [tokenAddress]: newWeight,
      }
    })
  }, [])

  const updateWeightInstantly = useCallback<UpdateWeightInstantly>(
    async (tokenAddress, currentTokenWeight, newTokenWeight) => {
      if (account === undefined) {
        return
      }

      const isIncreasing = big(newTokenWeight).gt(currentTokenWeight)
      if (isIncreasing && matchPoolHasReachedLiquidityCap(pool)) {
        addError(t('updateWeightInstantly.liquidityCapReached'))
        return
      }

      setIsUpdatingWeight(true)
      try {
        const crpoolProxyContract = await CRPoolProxy.getInstance()

        const transaction = await crpoolProxyContract.updateWeightInstantly(
          account,
          pool.controller,
          tokenAddress,
          ethers.utils.parseUnits(currentTokenWeight, 18),
          ethers.utils.parseUnits(newTokenWeight, 18),
        )

        verify(transaction !== undefined, 'UPDATE_WEIGHT_INSTANTLY_FAILS')

        await track(transaction, {
          confirm: {
            message: t('updateWeightInstantly.success'),
          },
        })

        await wait(2000)

        refreshPool()
      } catch {
        addError(t('updateWeightInstantly.failure'))
      } finally {
        setIsUpdatingWeight(false)
      }
    },
    [account, pool, addError, t, track, refreshPool],
  )

  const value = useMemo<ReturnValue>(() => {
    return {
      newWeightsByTokenAddress,
      isUpdatingWeight,
      setNewWeight,
      updateWeightInstantly,
    }
  }, [
    newWeightsByTokenAddress,
    isUpdatingWeight,
    setNewWeight,
    updateWeightInstantly,
  ])

  return value
}
