import useEffectCompare from '@swarm/core/hooks/effects/useEffectCompare'
import { useState } from 'react'

import { AlertSkeleton } from './types'

import { useSnackbar } from '.'

interface FlashToastProps extends AlertSkeleton {
  display: boolean
  once?: boolean
}

const FlashToast = ({
  display,
  once = false,
  message,
  ...options
}: FlashToastProps) => {
  const { addAlert } = useSnackbar()
  const [alreadyDisplayed, setAlreadyDisplayed] = useState(false)

  useEffectCompare(() => {
    if (display && !alreadyDisplayed) {
      addAlert(message, options)
      setAlreadyDisplayed(once)
    }
  }, [display])

  return null
}

export default FlashToast
