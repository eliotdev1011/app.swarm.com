import { MutableRefObject, useEffect, useRef } from 'react'

interface Options {
  hasMore: boolean
  loadMore: () => void
}

export function useInfiniteScroll<Element extends HTMLElement>(
  options: Options,
): MutableRefObject<Element | null> {
  const { hasMore, loadMore } = options

  const loaderRef = useRef<Element | null>(null)

  useEffect(() => {
    if (loaderRef.current === null) {
      return () => {}
    }

    const observer = new IntersectionObserver((entries) => {
      const target = entries[0]
      if (target.isIntersecting && hasMore) {
        loadMore()
      }
    })

    observer.observe(loaderRef.current)

    return () => {
      observer.disconnect()
    }
  }, [hasMore, loadMore])

  return loaderRef
}
