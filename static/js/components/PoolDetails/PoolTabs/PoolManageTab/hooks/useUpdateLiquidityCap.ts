import useDeepTranslation from '@swarm/core/hooks/i18n/useDeepTranslation'
import useTransactionAlerts from '@swarm/core/hooks/i18n/useTransactionAlerts'
import { SPT_DECIMALS } from '@swarm/core/shared/consts'
import wait from '@swarm/core/shared/utils/helpers/wait'
import { useSnackbar } from '@swarm/ui/swarm/Snackbar'
import { ethers } from 'ethers'
import { useCallback, useMemo, useState } from 'react'

import { CRPool } from 'src/contracts/SmartPools/CRPool'

type UpdateLiquidityCap = (newLiquidityCap: string) => Promise<void>

interface ReturnValue {
  newLiquidityCap: string
  isUpdatingLiquidityCap: boolean
  setNewLiquidityCap: (newLiquidityCap: string) => void
  updateLiquidityCap: UpdateLiquidityCap
}

export function useUpdateLiquidityCap(
  pool: {
    controller: string
  },
  refreshPool: () => void,
): ReturnValue {
  const { track } = useTransactionAlerts()
  const { addError } = useSnackbar()
  const { t } = useDeepTranslation('poolDetails', ['poolTabs', 'manage'])

  const [newLiquidityCap, setNewLiquidityCap] = useState<string>('')
  const [isUpdatingLiquidityCap, setIsUpdatingLiquidityCap] =
    useState<boolean>(false)

  const updateLiquidityCap = useCallback<UpdateLiquidityCap>(
    async (liquidityCap) => {
      setIsUpdatingLiquidityCap(true)
      try {
        const crpoolContract = await CRPool.getInstance(pool.controller)

        const transaction = await crpoolContract.updateLiquidityCap(
          ethers.utils.parseUnits(liquidityCap, SPT_DECIMALS),
        )
        if (transaction === undefined) {
          throw new Error('UPDATE_LIQUIDITY_CAP_FAILS')
        }

        await track(transaction, {
          confirm: {
            message: t('updateLiquidityCap.success'),
          },
        })

        setNewLiquidityCap('')

        await wait(2000)

        refreshPool()
      } catch {
        addError(t('updateLiquidityCap.failure'))
      } finally {
        setIsUpdatingLiquidityCap(false)
      }
    },
    [addError, pool.controller, track, t, refreshPool],
  )

  const value = useMemo<ReturnValue>(() => {
    return {
      newLiquidityCap,
      isUpdatingLiquidityCap,
      setNewLiquidityCap,
      updateLiquidityCap,
    }
  }, [
    newLiquidityCap,
    isUpdatingLiquidityCap,
    setNewLiquidityCap,
    updateLiquidityCap,
  ])

  return value
}
