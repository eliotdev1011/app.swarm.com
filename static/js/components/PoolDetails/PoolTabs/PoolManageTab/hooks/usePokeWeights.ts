import { useCurrentBlockNumber } from '@swarm/core/hooks/data/useCurrentBlockNumber'
import useDeepTranslation from '@swarm/core/hooks/i18n/useDeepTranslation'
import useTransactionAlerts from '@swarm/core/hooks/i18n/useTransactionAlerts'
import wait from '@swarm/core/shared/utils/helpers/wait'
import { useSnackbar } from '@swarm/ui/swarm/Snackbar'
import { useCallback, useMemo, useState } from 'react'

import { CRPool } from 'src/contracts/SmartPools/CRPool'

type PokeWeights = () => Promise<void>

interface ReturnValue {
  missingBlocksBeforeStart: number | undefined
  canPokeWeights: boolean
  isPokingWeights: boolean
  pokeWeights: PokeWeights
}

export function usePokeWeights(
  pool: {
    controller: string
    crpoolGradualWeightsUpdate: { startBlock: string } | null
  },
  refreshPool: () => void,
): ReturnValue {
  const { track } = useTransactionAlerts()
  const { addError } = useSnackbar()
  const { t } = useDeepTranslation('poolDetails', ['poolTabs', 'manage'])
  const currentBlockNumber = useCurrentBlockNumber()

  const [isPokingWeights, setIsPokingWeights] = useState<boolean>(false)

  const pokeWeights = useCallback<PokeWeights>(async () => {
    setIsPokingWeights(true)
    try {
      const crpoolContract = await CRPool.getInstance(pool.controller)

      const transaction = await crpoolContract.pokeWeights()
      if (transaction === undefined) {
        throw new Error('POKE_WEIGHTS_FAILS')
      }

      await track(transaction, {
        confirm: {
          message: t('updateWeightsGradually.pokeWeightsSuccess'),
        },
      })

      await wait(2000)

      refreshPool()
    } catch {
      addError(t('updateWeightsGradually.pokeWeightsSuccess'))
    } finally {
      setIsPokingWeights(false)
    }
  }, [addError, pool.controller, track, t, refreshPool])

  const missingBlocksBeforeStart = useMemo<number | undefined>(() => {
    if (
      pool.crpoolGradualWeightsUpdate === null ||
      currentBlockNumber === undefined
    ) {
      return undefined
    }

    return (
      parseInt(pool.crpoolGradualWeightsUpdate.startBlock, 10) -
      currentBlockNumber
    )
  }, [pool.crpoolGradualWeightsUpdate, currentBlockNumber])

  const canPokeWeights = useMemo<boolean>(() => {
    return (
      missingBlocksBeforeStart !== undefined && missingBlocksBeforeStart <= 0
    )
  }, [missingBlocksBeforeStart])

  const value = useMemo<ReturnValue>(() => {
    return {
      missingBlocksBeforeStart,
      canPokeWeights,
      isPokingWeights,
      pokeWeights,
    }
  }, [missingBlocksBeforeStart, canPokeWeights, isPokingWeights, pokeWeights])

  return value
}
