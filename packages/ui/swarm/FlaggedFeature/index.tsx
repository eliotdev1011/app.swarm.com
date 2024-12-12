import useFeatureFlags, {
  FlaggedFeatureName,
} from '@swarm/core/hooks/data/useFeatureFlags'
import { PropsWithChildren, ReactNode } from 'react'

interface FeatureProps {
  name: FlaggedFeatureName
  fallback?: ReactNode | ReactNode[]
}

const FlaggedFeature = ({
  name,
  children,
  fallback = null,
}: PropsWithChildren<FeatureProps>) => {
  const { ifFeature } = useFeatureFlags()

  return ifFeature(name, <>{children}</>, <>{fallback}</>)
}

export default FlaggedFeature
