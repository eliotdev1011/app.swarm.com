import { Obj } from '@swarm/types/index'
import isEqual from 'fast-deep-equal'
import { useMemo } from 'react'

import usePrevious from '@core/hooks/state/usePrevious'

const useMemoCollection = <T extends Obj>(collection: T[]) => {
  const previous = usePrevious(collection)
  return useMemo(() => {
    if (previous?.length !== collection.length) {
      return collection
    }

    return previous?.map((prevElem, idx) => {
      if (isEqual(prevElem, collection[idx])) {
        return prevElem
      }

      return collection[idx]
    })
  }, [collection, previous])
}

export default useMemoCollection
