import { useCallback, useEffect, useMemo, useState } from 'react'

import { LocalStorageService } from '@core/services/window-storage/local-storage'
import { SessionStorageService } from '@core/services/window-storage/session-storage'

type SetValue<Value> = (newValue: Value | ((prevValue: Value) => Value)) => void

type ReturnValue<Value> = {
  value: Value
  setValue: SetValue<Value>
  removeValue: () => void
}

export function useWindowStorage<Value>(
  serviceInstance: LocalStorageService<Value> | SessionStorageService<Value>,
): ReturnValue<Value> {
  const [value, setValue] = useState<Value>(serviceInstance.get())

  // Reset state whenever something afecting the value changes
  useEffect(() => {
    const { unsubscribe } = serviceInstance.subscribe(setValue)
    setValue(serviceInstance.get())

    return () => {
      unsubscribe()
    }
  }, [serviceInstance])

  const storeValue = useCallback<SetValue<Value>>(
    (valueOrFunctionToStore) => {
      if (valueOrFunctionToStore instanceof Function) {
        const valueToStore = valueOrFunctionToStore(value)
        serviceInstance.set(valueToStore)
        return
      }

      const valueToStore = valueOrFunctionToStore
      serviceInstance.set(valueToStore)
    },
    [serviceInstance, value],
  )

  const removeValue = useCallback<() => void>(() => {
    serviceInstance.remove()
  }, [serviceInstance])

  // Listen to storage events on other documents
  useEffect(() => {
    const listener = (event: StorageEvent) => {
      if (event.key !== serviceInstance.key) {
        return
      }

      setValue(serviceInstance.decode(event.newValue))
    }

    window.addEventListener('storage', listener)

    return () => {
      window.removeEventListener('storage', listener)
    }
  }, [serviceInstance])

  const returnValue = useMemo(() => {
    return {
      value,
      setValue: storeValue,
      removeValue,
    }
  }, [value, storeValue, removeValue])

  return returnValue
}
