import { AbstractAsset } from '@swarm/types/tokens'
import { useSnackbar } from '@swarm/ui/swarm/Snackbar'
import { constants, ContractTransaction } from 'ethers'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { Erc20 } from '@core/contracts/ERC20'
import { Erc721 } from '@core/contracts/ERC721'
import { TokenType } from '@core/shared/enums'
import wait from '@core/shared/utils/helpers/wait'
import { isNFT } from '@core/shared/utils/tokens'

import useAsyncState from '../async/useAsyncState'
import useTransactionAlerts from '../i18n/useTransactionAlerts'

type UseEnableAssetState = {
  txLoading: boolean
}

type UseEnableAssetReturn = [
  (
    token: AbstractAsset,
    spender: string,
    tokenType: TokenType,
  ) => Promise<void>,
  UseEnableAssetState,
]

const useEnableAsset = (): UseEnableAssetReturn => {
  const { t } = useTranslation('common', { keyPrefix: 'token' })
  const { track } = useTransactionAlerts()
  const { addError } = useSnackbar()

  const [txLoading, setTxLoading] = useAsyncState(false)

  const enableAsset = useCallback(
    async (token: AbstractAsset, spender: string, tokenType: TokenType) => {
      if (!spender) return

      setTxLoading(true)
      try {
        let tx: ContractTransaction
        if (isNFT(tokenType)) {
          const instance = await Erc721.getInstance(token.address as string)
          tx = await instance.setApprovalForAll(spender, true)
        } else {
          const instance = await Erc20.getInstance(token.id)
          tx = await instance.approve(spender, constants.MaxUint256)
        }

        await track(tx, {
          skipSubmit: true,
          confirm: { message: t('enabled', { token: token.name }) },
        })

        await wait(2000)
      } catch (e) {
        addError(e as Error)
      } finally {
        setTxLoading(false)
      }
    },
    [addError, setTxLoading, t, track],
  )

  return [enableAsset, { txLoading }]
}

export default useEnableAsset
