import useDeepTranslation from '@swarm/core/hooks/i18n/useDeepTranslation'
import useTransactionAlerts from '@swarm/core/hooks/i18n/useTransactionAlerts'
import wait from '@swarm/core/shared/utils/helpers/wait'
import { useSnackbar } from '@swarm/ui/swarm/Snackbar'
import { ethers } from 'ethers'
import { useCallback, useMemo, useState } from 'react'

import { CRPool } from 'src/contracts/SmartPools/CRPool'

type UpdateSwapFee = (newSwapFee: string) => Promise<void>

interface ReturnValue {
  newSwapFee: string
  isUpdatingSwapFee: boolean
  setNewSwapFee: (newSwapFee: string) => void
  updateSwapFee: UpdateSwapFee
}

export function useUpdateSwapFee(
  pool: { controller: string },
  refreshPool: () => void,
): ReturnValue {
  const { track } = useTransactionAlerts()
  const { addError } = useSnackbar()
  const { t } = useDeepTranslation('poolDetails', ['poolTabs', 'manage'])

  const [newSwapFee, setNewSwapFee] = useState<string>('')
  const [isUpdatingSwapFee, setIsUpdatingSwapFee] = useState<boolean>(false)

  const updateSwapFee = useCallback<UpdateSwapFee>(
    async (swapFee) => {
      setIsUpdatingSwapFee(true)
      try {
        const crpoolContract = await CRPool.getInstance(pool.controller)

        const transaction = await crpoolContract.updateSwapFee(
          ethers.utils.parseUnits(swapFee, 18),
        )
        if (transaction === undefined) {
          throw new Error('UPDATE_SWAP_FEE_FAILS')
        }

        await track(transaction, {
          confirm: {
            message: t('updateSwapFee.success'),
          },
        })

        setNewSwapFee('')

        await wait(2000)

        refreshPool()
      } catch {
        addError(t('updateSwapFee.failure'))
      } finally {
        setIsUpdatingSwapFee(false)
      }
    },
    [addError, pool.controller, track, t, refreshPool],
  )

  const value = useMemo<ReturnValue>(() => {
    return {
      newSwapFee,
      isUpdatingSwapFee,
      setNewSwapFee,
      updateSwapFee,
    }
  }, [newSwapFee, isUpdatingSwapFee, setNewSwapFee, updateSwapFee])

  return value
}
