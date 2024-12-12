import { Selector } from '@swarm/types/state'
import { useContext, useMemo } from 'react'

import { AppContext } from '@core/state/AppContext'

const useSelector = <T = unknown>(selector: Selector<T>): T => {
  const { appState } = useContext(AppContext)

  const selected = useMemo(() => selector(appState), [appState, selector])

  return useMemo(() => selected, [selected])
}

export default useSelector
