import isEqual from 'fast-deep-equal'
import { useMemo } from 'react'

import useMemoCompare from './useMemoCompare'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useDeepMemo = <T = any>(
  callback: () => T,
  deps: React.DependencyList | undefined,
) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemoCompare(useMemo(callback, deps || []), isEqual)
}

export default useDeepMemo
