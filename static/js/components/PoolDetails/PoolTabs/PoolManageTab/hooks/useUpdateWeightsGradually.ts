import useDeepTranslation from '@swarm/core/hooks/i18n/useDeepTranslation'
import useTransactionAlerts from '@swarm/core/hooks/i18n/useTransactionAlerts'
import wait from '@swarm/core/shared/utils/helpers/wait'
import { useSnackbar } from '@swarm/ui/swarm/Snackbar'
import { ethers } from 'ethers'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { CRPool } from 'src/contracts/SmartPools/CRPool'

type WeightsByTokenAddress = { [tokenAddress: string]: string }

type SetNewWeight = (tokenAddress: string, newWeight: string) => void

type UpdateWeightsGradually = (
  weights: string[],
  startBlock: number,
  endBlock: number,
) => Promise<void>

interface ReturnValue {
  newGradualWeightsByXTokenAddress: WeightsByTokenAddress
  gradualUpdateStartBlock: number
  gradualUpdateEndBlock: number
  isGraduallyUpdatingWeights: boolean
  setNewGradualWeight: SetNewWeight
  setGradualUpdateStartBlock: (gradualUpdateStartBlock: number) => void
  setGradualUpdateEndBlock: (gradualUpdateEndBlock: number) => void
  updateWeightsGradually: UpdateWeightsGradually
}

export function useUpdateWeightsGradually(
  pool: {
    tokens: Array<{
      address: string
      denormWeight: string
      xToken?: { id: string }
    }>
    controller: string
  },
  refreshPool: () => void,
): ReturnValue {
  const { track } = useTransactionAlerts()
  const { addError } = useSnackbar()
  const { t } = useDeepTranslation('poolDetails', ['poolTabs', 'manage'])

  const [
    newGradualWeightsByXTokenAddress,
    setNewGradualWeightsByXTokenAddress,
  ] = useState<WeightsByTokenAddress>({})
  const [gradualUpdateStartBlock, setGradualUpdateStartBlock] =
    useState<number>(0)
  const [gradualUpdateEndBlock, setGradualUpdateEndBlock] = useState<number>(0)
  const [isGraduallyUpdatingWeights, setIsGraduallyUpdatingWeights] =
    useState<boolean>(false)

  useEffect(() => {
    setNewGradualWeightsByXTokenAddress(
      pool.tokens.reduce<WeightsByTokenAddress>(
        (currentWeightsByTokenAddress, token) => {
          if (token.xToken === undefined) {
            return currentWeightsByTokenAddress
          }
          // eslint-disable-next-line no-param-reassign
          currentWeightsByTokenAddress[token.xToken.id] = token.denormWeight
          return currentWeightsByTokenAddress
        },
        {},
      ),
    )
  }, [pool.tokens])

  const setNewGradualWeight = useCallback<SetNewWeight>(
    (tokenAddress, newWeight) => {
      setNewGradualWeightsByXTokenAddress((currentNewWeightsByTokenAddress) => {
        return {
          ...currentNewWeightsByTokenAddress,
          [tokenAddress]: newWeight,
        }
      })
    },
    [],
  )

  const updateWeightsGradually = useCallback<UpdateWeightsGradually>(
    async (weights, startBlock, endBlock) => {
      setIsGraduallyUpdatingWeights(true)
      try {
        const crpoolContract = await CRPool.getInstance(pool.controller)

        const transaction = await crpoolContract.updateWeightsGradually(
          weights.map((weight) => {
            return ethers.utils.parseUnits(weight, 18)
          }),
          startBlock,
          endBlock,
        )
        if (transaction === undefined) {
          throw new Error('UPDATE_WEIGHTS_GRADUALLY_FAILS')
        }

        await track(transaction, {
          confirm: {
            message: t('updateWeightsGradually.success'),
          },
        })

        await wait(2000)

        refreshPool()
      } catch {
        addError(t('updateWeightsGradually.failure'))
      } finally {
        setIsGraduallyUpdatingWeights(false)
      }
    },
    [addError, pool.controller, track, t, refreshPool],
  )

  const value = useMemo<ReturnValue>(() => {
    return {
      newGradualWeightsByXTokenAddress,
      gradualUpdateStartBlock,
      gradualUpdateEndBlock,
      isGraduallyUpdatingWeights,
      setNewGradualWeight,
      setGradualUpdateStartBlock,
      setGradualUpdateEndBlock,
      updateWeightsGradually,
    }
  }, [
    newGradualWeightsByXTokenAddress,
    gradualUpdateStartBlock,
    gradualUpdateEndBlock,
    isGraduallyUpdatingWeights,
    setNewGradualWeight,
    setGradualUpdateStartBlock,
    setGradualUpdateEndBlock,
    updateWeightsGradually,
  ])

  return value
}
