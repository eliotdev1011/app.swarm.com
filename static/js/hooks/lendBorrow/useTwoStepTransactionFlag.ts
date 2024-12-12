import { useCallback, useMemo, useState } from 'react'

type State = 'idle' | 'confirming' | 'executing'

interface ReturnValue {
  state: State
  startConfirmation: () => void
  startExecution: () => void
  stop: () => void
}

export function useTwoStepTransactionFlag(): ReturnValue {
  const [state, setState] = useState<State>('idle')

  const startConfirmation = useCallback(() => {
    setState('confirming')
  }, [])

  const startExecution = useCallback(() => {
    setState('executing')
  }, [])

  const stop = useCallback(() => {
    setState('idle')
  }, [])

  const value = useMemo<ReturnValue>(() => {
    return {
      state,
      startConfirmation,
      startExecution,
      stop,
    }
  }, [state, startConfirmation, startExecution, stop])

  return value
}
