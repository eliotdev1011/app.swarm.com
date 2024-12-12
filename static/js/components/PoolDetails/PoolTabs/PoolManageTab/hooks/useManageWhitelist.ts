import useDeepTranslation from '@swarm/core/hooks/i18n/useDeepTranslation'
import useTransactionAlerts from '@swarm/core/hooks/i18n/useTransactionAlerts'
import wait from '@swarm/core/shared/utils/helpers/wait'
import { useSnackbar } from '@swarm/ui/swarm/Snackbar'
import { useCallback, useMemo, useState } from 'react'

import { CRPool } from 'src/contracts/SmartPools/CRPool'

type AddToWhitelist = (address: string) => Promise<void>
type RemoveFromWhitelist = (address: string) => Promise<void>

interface ReturnValue {
  newAddressToWhitelist: string
  isAddingToWhitelist: boolean
  isRemovingFromWhitelist: boolean
  setNewAddressToWhitelist: (newAddressToWhitelist: string) => void
  addToWhitelist: AddToWhitelist
  removeFromWhitelist: RemoveFromWhitelist
}

export function useManageWhitelist(
  pool: { controller: string },
  refreshPool: () => void,
): ReturnValue {
  const { track } = useTransactionAlerts()
  const { addError } = useSnackbar()
  const { t } = useDeepTranslation('poolDetails', ['poolTabs', 'manage'])

  const [newAddressToWhitelist, setNewAddressToWhitelist] = useState<string>('')
  const [isAddingToWhitelist, setIsAddingToWhitelist] = useState<boolean>(false)
  const [isRemovingFromWhitelist, setIsRemovingFromWhitelist] =
    useState<boolean>(false)

  const addToWhitelist = useCallback<AddToWhitelist>(
    async (address) => {
      setIsAddingToWhitelist(true)
      try {
        const crpoolContract = await CRPool.getInstance(pool.controller)

        const transaction = await crpoolContract.addToWhitelist(address)
        if (transaction === undefined) {
          throw new Error('ADD_TO_WHITELIST_FAILS')
        }

        await track(transaction, {
          confirm: {
            message: t('manageWhitelist.success'),
          },
        })

        setNewAddressToWhitelist('')

        await wait(2000)

        refreshPool()
      } catch {
        addError(t('manageWhitelist.failure'))
      } finally {
        setIsAddingToWhitelist(false)
      }
    },
    [addError, pool.controller, track, t, refreshPool],
  )

  const removeFromWhitelist = useCallback<AddToWhitelist>(
    async (address) => {
      setIsRemovingFromWhitelist(true)
      try {
        const crpoolContract = await CRPool.getInstance(pool.controller)

        const transaction = await crpoolContract.removeFromWhitelist(address)
        if (transaction === undefined) {
          throw new Error('REMOVE_FROM_WHITELIST_FAILS')
        }

        await track(transaction, {
          confirm: {
            message: t('manageWhitelist.success'),
          },
        })

        await wait(2000)

        refreshPool()
      } catch {
        addError(t('manageWhitelist.failure'))
      } finally {
        setIsRemovingFromWhitelist(false)
      }
    },
    [addError, pool.controller, track, t, refreshPool],
  )

  const value = useMemo<ReturnValue>(() => {
    return {
      newAddressToWhitelist,
      isAddingToWhitelist,
      isRemovingFromWhitelist,
      setNewAddressToWhitelist,
      addToWhitelist,
      removeFromWhitelist,
    }
  }, [
    newAddressToWhitelist,
    isAddingToWhitelist,
    isRemovingFromWhitelist,
    setNewAddressToWhitelist,
    addToWhitelist,
    removeFromWhitelist,
  ])

  return value
}
