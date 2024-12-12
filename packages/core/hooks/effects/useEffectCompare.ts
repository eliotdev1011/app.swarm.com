import isEqual from 'fast-deep-equal'
import { DependencyList, EffectCallback, useEffect } from 'react'

import usePrevious from '@core/hooks/state/usePrevious'

const useEffectCompare = (
  effect: EffectCallback,
  compareDeps: DependencyList,
) => {
  const prevDeps = usePrevious(compareDeps)

  useEffect(() => {
    if (!isEqual(compareDeps, prevDeps)) {
      return effect()
    }
    return () => {}
  }, [compareDeps, prevDeps, effect])
}

export default useEffectCompare
