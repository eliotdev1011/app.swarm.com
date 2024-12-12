import { Erc20 } from '@swarm/core/contracts/ERC20'
import { useCpk } from '@swarm/core/contracts/cpk'
import useDeepTranslation from '@swarm/core/hooks/i18n/useDeepTranslation'
import useTransactionAlerts from '@swarm/core/hooks/i18n/useTransactionAlerts'
import wait from '@swarm/core/shared/utils/helpers/wait'
import { useSnackbar } from '@swarm/ui/swarm/Snackbar'
import { useCallback, useMemo, useState } from 'react'

type EnableToken = (token: { address: string; symbol: string }) => Promise<void>

interface ReturnValue {
  isEnablingToken: boolean
  enableToken: EnableToken
}

export function useEnableToken(refreshPool: () => void): ReturnValue {
  const cpk = useCpk()
  const { track } = useTransactionAlerts()
  const { addError } = useSnackbar()
  const { t } = useDeepTranslation('poolDetails', ['poolTabs', 'manage'])

  const [isEnablingToken, setIsEnablingToken] = useState<boolean>(false)

  const enableToken = useCallback<EnableToken>(
    async (token) => {
      if (cpk === null || cpk === undefined || cpk.address === undefined) {
        return
      }

      setIsEnablingToken(true)
      try {
        const erc20Contract = await Erc20.getInstance(token.address)

        const transaction = await erc20Contract.enableToken(cpk.address)
        if (transaction === undefined) {
          throw new Error('ENABLE_TOKEN_FAILS')
        }

        await track(transaction, {
          skipSubmit: true,
          confirm: {
            message: t('enableToken.success', { symbol: token.symbol }),
          },
        })

        await wait(2000)

        refreshPool()
      } catch {
        addError(t('enableToken.failure', { symbol: token.symbol }))
      } finally {
        setIsEnablingToken(false)
      }
    },
    [addError, cpk, track, t, refreshPool],
  )

  const value = useMemo<ReturnValue>(() => {
    return {
      isEnablingToken,
      enableToken,
    }
  }, [isEnablingToken, enableToken])

  return value
}
