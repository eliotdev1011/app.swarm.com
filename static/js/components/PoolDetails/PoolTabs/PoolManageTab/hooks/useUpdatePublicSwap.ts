import useDeepTranslation from '@swarm/core/hooks/i18n/useDeepTranslation'
import useTransactionAlerts from '@swarm/core/hooks/i18n/useTransactionAlerts'
import wait from '@swarm/core/shared/utils/helpers/wait'
import { useSnackbar } from '@swarm/ui/swarm/Snackbar'
import { useCallback, useMemo, useState } from 'react'

import { CRPool } from 'src/contracts/SmartPools/CRPool'

type UpdatePublicSwap = (newPublicSwap: boolean) => Promise<void>

interface ReturnValue {
  isUpdatingPublicSwap: boolean
  updatePublicSwap: UpdatePublicSwap
}

export function useUpdatePublicSwap(
  pool: { controller: string },
  refreshPool: () => void,
): ReturnValue {
  const { track } = useTransactionAlerts()
  const { addError } = useSnackbar()
  const { t } = useDeepTranslation('poolDetails', ['poolTabs', 'manage'])

  const [isUpdatingPublicSwap, setIsUpdatingPublicSwap] =
    useState<boolean>(false)

  const updatePublicSwap = useCallback<UpdatePublicSwap>(
    async (publicSwap) => {
      setIsUpdatingPublicSwap(true)
      try {
        const crpoolContract = await CRPool.getInstance(pool.controller)

        const transaction = await crpoolContract.updatePublicSwap(publicSwap)
        if (transaction === undefined) {
          throw new Error('UPDATE_LIQUIDITY_CAP_FAILS')
        }

        await track(transaction, {
          confirm: {
            message: t('updatePublicSwap.success'),
          },
        })

        await wait(2000)

        refreshPool()
      } catch {
        addError(t('updatePublicSwap.failure'))
      } finally {
        setIsUpdatingPublicSwap(false)
      }
    },
    [addError, pool.controller, track, t, refreshPool],
  )

  const value = useMemo<ReturnValue>(() => {
    return {
      isUpdatingPublicSwap,
      updatePublicSwap,
    }
  }, [isUpdatingPublicSwap, updatePublicSwap])

  return value
}
