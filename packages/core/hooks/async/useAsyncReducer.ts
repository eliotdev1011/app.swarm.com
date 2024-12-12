import { Action, DispatchWithThunk, Thunk } from '@swarm/types/state'
import { useCallback, useEffect, useRef, useState } from 'react'

const useAsyncReducer = <T>(
  reducer: (arg0: T, arg1: Action) => T,
  initialArg: T,
  init?: (initialArg: T) => T,
): [T, DispatchWithThunk<T>] => {
  const [state, setState] = useState<T>(init ? init(initialArg) : initialArg)

  const ref = useRef(state)
  const reducerRef = useRef(reducer)

  useEffect(() => {
    ref.current = { ...state }
  }, [state])

  const dispatch: DispatchWithThunk<T> = useCallback(
    (action: Action | Thunk<T>) => {
      if (action instanceof Function) {
        return action(dispatch)
      }
      return setState((prevState) => reducerRef.current(prevState, action))
    },
    [],
  )

  return [state, dispatch]
}

export default useAsyncReducer
