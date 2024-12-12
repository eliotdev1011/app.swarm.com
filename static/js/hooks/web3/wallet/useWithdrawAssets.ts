import { XGoldBundleContract } from '@swarm/core/contracts/XGoldBundle'
import useAsyncState from '@swarm/core/hooks/async/useAsyncState'
import useTransactionAlerts from '@swarm/core/hooks/i18n/useTransactionAlerts'
import { AbstractNFT } from '@swarm/types/tokens'
import { useSnackbar } from '@swarm/ui/swarm/Snackbar'
import { TransactionReceipt } from 'alchemy-sdk'
import { useCallback } from 'react'
import 'react-datepicker/dist/react-datepicker.css'

type UseWithdrawAssetsState = {
  txLoading: boolean
}

type WithdrawAssetsFunction = (
  nfts: AbstractNFT[],
) => Promise<TransactionReceipt | undefined>

type UseWithdrawAssetsReturn = [WithdrawAssetsFunction, UseWithdrawAssetsState]

const useWithdrawAssets = (): UseWithdrawAssetsReturn => {
  const { track } = useTransactionAlerts()
  const { addError } = useSnackbar()
  const [txLoading, setTxLoading] = useAsyncState(false)

  const withdrawAssets: WithdrawAssetsFunction = useCallback(
    async (nfts) => {
      setTxLoading(true)
      try {
        const tx = await XGoldBundleContract.withdrawAssets(nfts)

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

  return [withdrawAssets, { txLoading }]
}

export default useWithdrawAssets
