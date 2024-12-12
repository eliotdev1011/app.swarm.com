import useNativeTokens from '@swarm/core/hooks/data/useNativeTokens'
import useDeepTranslation from '@swarm/core/hooks/i18n/useDeepTranslation'
import useTransactionAlerts from '@swarm/core/hooks/i18n/useTransactionAlerts'
import { POLL_INTERVAL } from '@swarm/core/shared/consts'
import { verify } from '@swarm/core/shared/utils/crypto'
import wait from '@swarm/core/shared/utils/helpers/wait'
import { isSameEthereumAddress, useReadyState } from '@swarm/core/web3'
import { NativeToken } from '@swarm/types/tokens'
import { useSnackbar } from '@swarm/ui/swarm/Snackbar'
import { ethers } from 'ethers'
import { useCallback, useMemo, useState } from 'react'

import { CRPool } from 'src/contracts/SmartPools/CRPool'

type NewToken = { address: string; symbol: string; decimals: number }

type CommitToken = (
  newToken: NewToken,
  newTokenInitialSupply: string,
  newTokenWeight: string,
) => Promise<void>

interface ReturnValue {
  possibleNewTokens: NewToken[]
  newToken: NewToken | undefined
  newTokenInitialSupply: string
  newTokenWeight: string
  isCommittingToken: boolean
  isOverwrittingCommittedToken: boolean
  setNewTokenAddress: (newTokenAddress: string) => void
  setNewTokenInitialSupply: (newTokenInitialSupply: string) => void
  setNewTokenWeight: (newTokenWeight: string) => void
  setIsOverwrittingCommittedToken: (
    isOverwrittingCommittedToken: boolean,
  ) => void
  commitToken: CommitToken
}

export function useCommitToken(
  pool: {
    tokens: Array<{ address: string }>
    controller: string
  },
  refreshPool: () => void,
): ReturnValue {
  const ready = useReadyState()
  const { track } = useTransactionAlerts()
  const { addError } = useSnackbar()
  const { t } = useDeepTranslation('poolDetails', ['poolTabs', 'manage'])

  const { nativeTokens } = useNativeTokens<NativeToken>({
    skip: !ready,
    variables: { filter: { isLPT: false, paused: false } },
    pollInterval: POLL_INTERVAL,
  })

  const possibleNewTokens = useMemo<NewToken[]>(() => {
    return nativeTokens
      .filter((token) => {
        return (
          pool.tokens.some((poolToken) => {
            return isSameEthereumAddress(token.id, poolToken.address)
          }) === false
        )
      })
      .map((token) => {
        return {
          ...token,
          address: token.id,
        }
      })
  }, [nativeTokens, pool.tokens])

  const [newTokenAddress, setNewTokenAddress] = useState<string | undefined>(
    undefined,
  )
  const [newTokenInitialSupply, setNewTokenInitialSupply] = useState<string>('')
  const [newTokenWeight, setNewTokenWeight] = useState<string>('')
  const [isCommittingToken, setIsCommittingToken] = useState<boolean>(false)
  // This flag is purely an interface one, there is "overwrite commit" function,
  // calling commitToken of top of a previous one overwrites the previously committed token
  const [isOverwrittingCommittedToken, setIsOverwrittingCommittedToken] =
    useState<boolean>(false)

  const newToken = useMemo(() => {
    return possibleNewTokens.find((token) => {
      return isSameEthereumAddress(token.address, newTokenAddress)
    })
  }, [possibleNewTokens, newTokenAddress])

  const commitToken = useCallback<CommitToken>(
    async (token, initialSupply, weight) => {
      if (token.decimals < 12 || token.decimals > 18) {
        addError(t('addToken.nonSupportedDecimalsTokenAddition'))
        return
      }

      setIsCommittingToken(true)
      try {
        const crpoolContract = await CRPool.getInstance(pool.controller)

        const transaction = await crpoolContract.commitToken(
          token.address,
          ethers.utils.parseUnits(initialSupply, token.decimals),
          ethers.utils.parseUnits(weight, 18),
        )
        verify(transaction !== undefined, 'COMMIT_TOKEN_FAILS')

        await track(transaction, {
          confirm: {
            message: t('addToken.success'),
          },
        })

        setNewTokenAddress(undefined)
        setNewTokenInitialSupply('')
        setNewTokenWeight('')

        await wait(2000)

        refreshPool()
      } catch {
        addError(t('addToken.failure'))
      } finally {
        setIsCommittingToken(false)
      }
    },
    [addError, pool.controller, track, t, refreshPool],
  )

  const value = useMemo<ReturnValue>(() => {
    return {
      possibleNewTokens,
      newToken,
      newTokenInitialSupply,
      newTokenWeight,
      isCommittingToken,
      isOverwrittingCommittedToken,
      setNewTokenAddress,
      setNewTokenInitialSupply,
      setNewTokenWeight,
      setIsOverwrittingCommittedToken,
      commitToken,
    }
  }, [
    possibleNewTokens,
    newToken,
    newTokenInitialSupply,
    newTokenWeight,
    isCommittingToken,
    isOverwrittingCommittedToken,
    setNewTokenAddress,
    setNewTokenInitialSupply,
    setNewTokenWeight,
    setIsOverwrittingCommittedToken,
    commitToken,
  ])

  return value
}
