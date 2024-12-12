import useInvestAssets from '@swarm/core/hooks/data/useInvestAssets'
import { Pool } from '@swarm/types'
import { useCallback, useMemo } from 'react'

const useHasExtraRewards = () => {
  const { investAssetsLoading, investAssets } = useInvestAssets({
    options: { includeAssetTokenAttrs: false },
  })

  const securitiesXTokenAddresses = useMemo(() => {
    return investAssets.map((token) => token.xToken?.id)
  }, [investAssets])

  const hasExtraRewards = useCallback(
    (pool?: Pick<Pool, 'tokensList'>) => {
      return (
        !!pool &&
        !investAssetsLoading &&
        pool?.tokensList.some((address) =>
          securitiesXTokenAddresses.includes(address.toLowerCase()),
        )
      )
    },
    [investAssetsLoading, securitiesXTokenAddresses],
  )

  return hasExtraRewards
}

export default useHasExtraRewards
