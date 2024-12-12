import { useCurrentBlockNumber } from '@swarm/core/hooks/data/useCurrentBlockNumber'
import useNativeTokens from '@swarm/core/hooks/data/useNativeTokens'
import useDeepTranslation from '@swarm/core/hooks/i18n/useDeepTranslation'
import useTransactionAlerts from '@swarm/core/hooks/i18n/useTransactionAlerts'
import { POLL_INTERVAL } from '@swarm/core/shared/consts'
import { verify } from '@swarm/core/shared/utils/crypto'
import wait from '@swarm/core/shared/utils/helpers/wait'
import { isEnabled } from '@swarm/core/shared/utils/tokens/allowance'
import {
  injectCpkAllowance,
  useInjections,
} from '@swarm/core/shared/utils/tokens/injectors'
import { useAccount, useReadyState } from '@swarm/core/web3'
import { HasCpkAllowance, NativeToken } from '@swarm/types/tokens'
import { useSnackbar } from '@swarm/ui/swarm/Snackbar'
import { useCallback, useMemo, useState } from 'react'

import { CRPoolProxy } from 'src/contracts/SmartPools/CRPoolProxy'
import { matchPoolHasReachedLiquidityCap } from 'src/shared/utils/pool'

type ApplyToken = () => Promise<void>

type TokenToApplyWithCpkAllowance = {
  address: string
  symbol: string
  balance: string
} & HasCpkAllowance

interface ReturnValue {
  tokenToApplyWithCpkAllowance: TokenToApplyWithCpkAllowance | null
  missingBlocksBeforeUnlock: number | undefined
  canApplyToken: boolean
  isTokenToApplyEnabled: boolean
  isApplyingToken: boolean
  applyToken: ApplyToken
}

export function useApplyToken(
  pool: {
    newCRPoolToken: {
      balance: string
      token: { address: string }
      commitBlock: string
    } | null
    addTokenTimeLockInBlocks: string
    controller: string
    totalShares: string
    cap: string | null
  },
  refreshPool: () => void,
): ReturnValue {
  const account = useAccount()
  const ready = useReadyState()
  const { track } = useTransactionAlerts()
  const { addError } = useSnackbar()
  const { t } = useDeepTranslation('poolDetails', ['poolTabs', 'manage'])
  const currentBlockNumber = useCurrentBlockNumber()

  const { nativeTokens } = useNativeTokens<NativeToken>({
    skip: !ready || pool.newCRPoolToken === null,
    variables: { filter: { id: pool.newCRPoolToken?.token.address } },
    pollInterval: POLL_INTERVAL,
  })

  const fullTokens = useInjections(
    nativeTokens,
    useMemo(() => [injectCpkAllowance(account)], [account]),
  ) as unknown as Array<NativeToken & HasCpkAllowance>

  const tokenToApplyWithCpkAllowance =
    useMemo<TokenToApplyWithCpkAllowance | null>(() => {
      if (pool.newCRPoolToken === null || fullTokens[0] === undefined) {
        return null
      }

      return {
        ...fullTokens[0],
        address: pool.newCRPoolToken.token.address,
        balance: pool.newCRPoolToken.balance,
      }
    }, [pool.newCRPoolToken, fullTokens])

  const [isApplyingToken, setIsApplyingToken] = useState<boolean>(false)

  const missingBlocksBeforeUnlock = useMemo<number | undefined>(() => {
    if (pool.newCRPoolToken === null || currentBlockNumber === undefined) {
      return undefined
    }

    const unlockBlock =
      parseInt(pool.newCRPoolToken.commitBlock, 10) +
      parseInt(pool.addTokenTimeLockInBlocks, 10)

    return unlockBlock - currentBlockNumber
  }, [currentBlockNumber, pool.addTokenTimeLockInBlocks, pool.newCRPoolToken])

  const canApplyToken = useMemo<boolean>(() => {
    return (
      missingBlocksBeforeUnlock !== undefined &&
      missingBlocksBeforeUnlock <= 0 &&
      matchPoolHasReachedLiquidityCap(pool) === false
    )
  }, [missingBlocksBeforeUnlock, pool])

  const isTokenToApplyEnabled = useMemo<boolean>(() => {
    return (
      tokenToApplyWithCpkAllowance !== null &&
      isEnabled(
        tokenToApplyWithCpkAllowance,
        tokenToApplyWithCpkAllowance.balance,
      )
    )
  }, [tokenToApplyWithCpkAllowance])

  const applyToken = useCallback<ApplyToken>(async () => {
    if (account === undefined || tokenToApplyWithCpkAllowance === null) {
      return
    }

    setIsApplyingToken(true)
    try {
      const crpoolProxyContract = await CRPoolProxy.getInstance()

      const transaction = await crpoolProxyContract.applyToken(
        account,
        pool.controller,
        tokenToApplyWithCpkAllowance.address,
        tokenToApplyWithCpkAllowance.balance,
      )

      verify(transaction !== undefined, 'APPLY_TOKEN_FAILS')

      await track(transaction, {
        confirm: {
          message: t('addToken.applySuccess'),
        },
      })

      await wait(2000)

      refreshPool()
    } catch {
      addError(t('addToken.applyFailure'))
    } finally {
      setIsApplyingToken(false)
    }
  }, [
    account,
    tokenToApplyWithCpkAllowance,
    addError,
    pool.controller,
    track,
    t,
    refreshPool,
  ])

  const value = useMemo<ReturnValue>(() => {
    return {
      tokenToApplyWithCpkAllowance,
      missingBlocksBeforeUnlock,
      canApplyToken,
      isTokenToApplyEnabled,
      isApplyingToken,
      applyToken,
    }
  }, [
    tokenToApplyWithCpkAllowance,
    missingBlocksBeforeUnlock,
    canApplyToken,
    isTokenToApplyEnabled,
    isApplyingToken,
    applyToken,
  ])

  return value
}
