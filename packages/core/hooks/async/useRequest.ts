import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import isEqual from 'lodash/isEqual'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Request = (...args: any[]) => Promise<any>

type UnwrapPromise<P> = P extends PromiseLike<infer T> ? T : never

interface UseRequestReturnType<T extends Request> {
  data: null | UnwrapPromise<ReturnType<T>>
  loading: boolean
  ready: boolean
  error: null | unknown
  refetch: (...args: Parameters<T>) => void
}

const useRequest = <T extends Request>(
  request: T,
  params?: Parameters<T>,
): UseRequestReturnType<T> => {
  const [loading, setLoading] = useState(true)
  const [ready, setReady] = useState(false)
  const [data, setData] = useState<UnwrapPromise<ReturnType<T>> | null>(null)
  const [error, setError] = useState<unknown | null>(null)
  const [localParams, setLocalParams] = useState<Parameters<T>>()
  const initialized = useRef(false)

  const refetch = useCallback(
    async (...args: Parameters<T> | unknown[]) => {
      setLoading(true)
      setError(null)
      try {
        const responseData = await request(...args)
        setData(responseData)
      } catch (localError) {
        setError(localError)
      } finally {
        setLoading(false)
        setReady(true)
      }
    },
    [request],
  )

  useEffect(() => {
    if (isEqual(params, localParams) && initialized.current) return
    initialized.current = true
    setLocalParams(params)
    refetch(...(params || []))
  }, [params, refetch])

  return useMemo(() => {
    return {
      data,
      loading,
      error,
      refetch,
      ready,
    }
  }, [data, error, loading, ready, refetch])
}

export default useRequest
