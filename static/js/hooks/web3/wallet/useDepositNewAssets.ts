import { XGoldBundleContract } from '@swarm/core/contracts/XGoldBundle'
import useAsyncState from '@swarm/core/hooks/async/useAsyncState'
import useTransactionAlerts from '@swarm/core/hooks/i18n/useTransactionAlerts'
import { AbstractNFT } from '@swarm/types/tokens'
import { useSnackbar } from '@swarm/ui/swarm/Snackbar'
import { TransactionReceipt } from 'alchemy-sdk'
import { useCallback } from 'react'
import 'react-datepicker/dist/react-datepicker.css'

type UseDepositNewAssetsState = {
  txLoading: boolean
}

type DepositNewAssetsFunction = (
  nfts: AbstractNFT[],
) => Promise<TransactionReceipt | undefined>

type UseDepositNewAssetsReturn = [
  DepositNewAssetsFunction,
  UseDepositNewAssetsState,
]

const useDepositNewAssets = (): UseDepositNewAssetsReturn => {
  const { track } = useTransactionAlerts()
  const { addError } = useSnackbar()
  const [txLoading, setTxLoading] = useAsyncState(false)

  const depositNewAssets: DepositNewAssetsFunction = useCallback(
    async (nfts) => {
      setTxLoading(true)
      try {
        const tx = await XGoldBundleContract.depositNewAssets(nfts)

        const receipt = await track(tx, {
          confirm: {
            secondaryMessage: 'Refresh shortly to see the latest offers.',
          },
        })

        return receipt
      } catch (e) {
        console.log(e)
        addError(e as Error)
      } finally {
        setTxLoading(false)
      }
    },
    [setTxLoading, track, addError],
  )

  return [depositNewAssets, { txLoading }]
}

export default useDepositNewAssets
