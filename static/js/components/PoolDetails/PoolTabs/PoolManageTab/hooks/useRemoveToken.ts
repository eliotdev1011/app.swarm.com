import useDeepTranslation from '@swarm/core/hooks/i18n/useDeepTranslation'
import useTransactionAlerts from '@swarm/core/hooks/i18n/useTransactionAlerts'
import wait from '@swarm/core/shared/utils/helpers/wait'
import { useAccount } from '@swarm/core/web3'
import { useSnackbar } from '@swarm/ui/swarm/Snackbar'
import { useCallback, useMemo, useState } from 'react'

import { CRPoolProxy } from 'src/contracts/SmartPools/CRPoolProxy'

type RemoveToken = (tokenAddress: string) => Promise<void>

interface ReturnValue {
  isRemovingToken: boolean
  removeToken: RemoveToken
}

export function useRemoveToken(
  pool: { controller: string },
  refreshPool: () => void,
): ReturnValue {
  const account = useAccount()
  const { track } = useTransactionAlerts()
  const { addError } = useSnackbar()
  const { t } = useDeepTranslation('poolDetails', ['poolTabs', 'manage'])

  const [isRemovingToken, setIsRemovingToken] = useState<boolean>(false)

  const removeToken = useCallback<RemoveToken>(
    async (tokenAddress) => {
      if (account === undefined) {
        return
      }

      setIsRemovingToken(true)
      try {
        const crpoolProxyContract = await CRPoolProxy.getInstance()

        const transaction = await crpoolProxyContract.removeToken(
          account,
          pool.controller,
          tokenAddress,
        )
        if (transaction === undefined) {
          throw new Error('REMOVE_TOKEN_FAILS')
        }

        await track(transaction, {
          confirm: {
            message: t('removeToken.success'),
          },
        })

        await wait(2000)

        refreshPool()
      } catch {
        addError(t('removeToken.failure'))
      } finally {
        setIsRemovingToken(false)
      }
    },
    [account, addError, pool.controller, track, t, refreshPool],
  )

  const value = useMemo<ReturnValue>(() => {
    return {
      isRemovingToken,
      removeToken,
    }
  }, [isRemovingToken, removeToken])

  return value
}
