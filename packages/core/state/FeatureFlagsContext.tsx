import { ChildrenProps } from '@swarm/types'
import React, { createContext, useCallback, useContext } from 'react'

import useAsyncMemo from '@core/hooks/async/useAsyncMemo'
import api from '@core/services/api'

export type FeatureFlagAttrs = {
  disabled: boolean
  flag: string
}

export interface FeatureFlag {
  id: string
  type: string
  attributes: FeatureFlagAttrs
}

export interface FeatureFlagsContextType {
  featureFlags: FeatureFlagAttrs[]
  loading: boolean
}

export const FeatureFlagsContext = createContext<FeatureFlagsContextType>({
  featureFlags: [],
  loading: false,
})

export const FeatureFlagsContextProvider = ({ children }: ChildrenProps) => {
  const [featureFlags, { loading }] = useAsyncMemo(
    async () => {
      return api.getFeatureFlags()
    },
    [],
    [],
  )

  const getFlagsAttrs = useCallback(() => {
    const flagsAttrs = featureFlags?.map((item: FeatureFlag) => item.attributes)
    return flagsAttrs
  }, [featureFlags])

  const value = React.useMemo(() => {
    return { featureFlags: getFlagsAttrs(), loading }
  }, [getFlagsAttrs, loading])

  return (
    <FeatureFlagsContext.Provider value={value}>
      {children}
    </FeatureFlagsContext.Provider>
  )
}

export const useFeatureFlagsContext = () => {
  return useContext(FeatureFlagsContext)
}
