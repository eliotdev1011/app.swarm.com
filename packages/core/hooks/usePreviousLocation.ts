import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'

export const usePreviousLocation = () => {
  const [prevLocation, setPrevLocation] = useState<
    undefined | ReturnType<typeof useLocation>
  >(undefined)

  const location = useLocation()

  useEffect(() => {
    setPrevLocation(location)
  }, [location])

  return prevLocation
}
