import { useEffect, useRef, useState } from 'react'

export default function useClickAway() {
  const [active, setActive] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const toggle = () => {
    setActive(prev => !prev)
  }

  // eslint-disable-next-line
  const handleClick = (e: any) => {
    if (!ref.current?.contains(e.target)) {
      setActive(false)
    }
  }

  useEffect(() => {
    if (active) {
      document.addEventListener('mousedown', handleClick)
    } else {
      document.removeEventListener('mousedown', handleClick)
    }

    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  }, [active])

  return { ref, active, setActive, toggle }
}
