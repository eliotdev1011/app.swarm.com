import api from '@swarm/core/services/api'
import { useAccount, useStoredNetworkId } from '@swarm/core/web3'
import { useEffect, useMemo, useState } from 'react'

import { LOYALTY_LEVEL_DESIGN } from './enums'
import { ILoyaltyLevel } from './interfaces'

const useLoyaltyLevel = () => {
  const [error, setError] = useState<null | unknown>(null)
  const [loading, setLoading] = useState(false)
  const [loyaltyLevels, setLoyaltyLevels] = useState([] as ILoyaltyLevel[])
  const networkId = useStoredNetworkId()
  const address = useAccount()

  useEffect(() => {
    async function fetchData() {
      if (!address || !networkId) {
        return
      }
      setLoading(true)
      try {
        const data = await api.loyaltyLevels(address, networkId)
        /* eslint-disable-next-line */
        data.forEach((row: any, index: number) => {
          data[index] = {
            current: row.attributes.current,
            forecast: row.attributes.forecast,
            ...LOYALTY_LEVEL_DESIGN[index],
          }
        })
        setLoyaltyLevels(data)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [address, networkId])

  const currentLoyaltyLevelIndex = useMemo(
    () => loyaltyLevels.findIndex((level: ILoyaltyLevel) => level.current),
    [loyaltyLevels],
  )

  const loyaltyLevel = useMemo(() => loyaltyLevels[currentLoyaltyLevelIndex], [
    currentLoyaltyLevelIndex,
    loyaltyLevels,
  ])

  return {
    error,
    loading,
    loyaltyLevels,
    loyaltyLevel,
    currentLoyaltyLevelIndex,
  }
}

export default useLoyaltyLevel
