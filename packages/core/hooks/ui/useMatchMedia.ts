import { useEffect, useState } from 'react'

export function useMatchMedia(mediaQuery: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mediaQueryList = window.matchMedia(mediaQuery)
    setMatches(mediaQueryList.matches)

    const onChange = () => {
      setMatches(window.matchMedia(mediaQuery).matches)
    }

    mediaQueryList.addEventListener('change', onChange)

    return () => {
      mediaQueryList.removeEventListener('change', onChange)
    }
  }, [mediaQuery])

  return matches
}
