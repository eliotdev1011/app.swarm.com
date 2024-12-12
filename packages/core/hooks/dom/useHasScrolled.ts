import { useEffect, useState } from 'react'

interface UseHasScrolledOptions {
  active?: boolean
}

const useHasScrolled = ({ active = true }: UseHasScrolledOptions) => {
  const [hasScrolled, setHasScrolled] = useState(
    active && document.body.scrollTop > 0,
  )

  useEffect(() => {
    if (active === false) {
      return () => {}
    }

    let isCancelled = false

    const handler = () => {
      if (isCancelled === false) {
        setHasScrolled(document.body.scrollTop > 0)
      }
    }

    document.body.addEventListener('scroll', handler, {
      passive: true,
    })

    return () => {
      isCancelled = true
      document.body.removeEventListener('scroll', handler)
    }
  }, [active])

  return active && hasScrolled
}

export default useHasScrolled
