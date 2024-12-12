import { useSnackbar } from '@swarm/ui/swarm/Snackbar'
import { AlertSkeleton, AlertVariant } from '@swarm/ui/swarm/Snackbar/types'
import { TransactionResult } from 'contract-proxy-kit'
import { providers } from 'ethers'
import { useTranslation } from 'react-i18next'

import { refresh } from '@core/observables/watcher'
import { generateExplorerUrl } from '@core/shared/utils'
import { provider$, useStoredNetworkId } from '@core/web3'

interface TrackerOptions {
  submit?: Partial<AlertSkeleton>
  confirm?: Partial<AlertSkeleton>
  fail?: Partial<AlertSkeleton>
  skipSubmit?: boolean
  skipConfirm?: boolean
  confirmations?: number
}

const useTransactionAlerts = () => {
  const { addAlert, dismissAlert } = useSnackbar()
  const { t } = useTranslation(['transaction'])
  const networkId = useStoredNetworkId()

  const track = async (
    tx?: TransactionResult | providers.TransactionResponse | string,
    options?: TrackerOptions,
  ) => {
    if (!tx) {
      return Promise.reject()
    }

    const hash = typeof tx === 'string' ? tx : tx.hash

    const submitKey = `TX-${hash}-SUBMIT`

    if (!options?.skipSubmit) {
      addAlert(options?.submit?.message || t('transactionSubmitted'), {
        variant: AlertVariant.success,
        actionHref: generateExplorerUrl({
          type: 'tx',
          hash,
          chainId: networkId,
        }),
        actionText: t('view'),
        key: submitKey,
        ...options?.submit,
      })
    }

    const realTx =
      typeof tx === 'string'
        ? await provider$.getValue().getTransaction(tx)
        : tx

    const response: providers.TransactionResponse =
      ((realTx as TransactionResult)
        ?.transactionResponse as providers.TransactionResponse) || realTx

    try {
      const receipt = await response?.wait(options?.confirmations || 1)

      refresh().then(() => {
        if (!options?.skipConfirm) {
          addAlert(options?.confirm?.message || t('transactionConfirmed'), {
            variant: AlertVariant.success,
            actionHref: generateExplorerUrl({
              type: 'tx',
              hash,
              chainId: networkId,
            }),
            actionText: t('view'),
            key: `TX-${hash}-CONFIRM`,
            ...options?.confirm,
          })
        }
        dismissAlert(submitKey)
      })

      return receipt
    } catch (e) {
      addAlert(options?.fail?.message || t('transactionFailed'), {
        actionHref: generateExplorerUrl({
          type: 'tx',
          hash,
          chainId: networkId,
        }),
        actionText: t('view'),
        variant: AlertVariant.error,
        autoDismissible: false,
        ...options?.fail,
      })

      throw e
    }
  }

  return { track }
}

export default useTransactionAlerts
