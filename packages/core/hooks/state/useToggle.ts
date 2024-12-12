import { useMemo, useState } from 'react'

interface ReturnValue {
  isOn: boolean
  on: () => void
  off: () => void
  toggle: () => void
  reset: () => void
}

export function useToggle(initialIsOn = false): ReturnValue {
  const [isOn, setIsOn] = useState(initialIsOn)

  return useMemo(() => {
    return {
      isOn,
      on: () => {
        setIsOn(true)
      },
      off: () => {
        setIsOn(false)
      },
      toggle: () => {
        setIsOn((currentIsOn) => !currentIsOn)
      },
      reset: () => {
        setIsOn(initialIsOn)
      },
    }
  }, [isOn, initialIsOn])
}
