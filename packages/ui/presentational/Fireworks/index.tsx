import { usePrefersReducedMotion } from '@swarm/core/hooks/ui/usePrefersReducedMotion'
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react'
import styled from 'styled-components/macro'

import { FireworkDisplay } from './FireworkDisplay'
import { setupFireworks } from './fireworks'

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: ${({ theme }) => theme.zIndices.fireworks};
  pointer-events: none;
`
const Canvas = styled.canvas``

interface FireworksProps {
  isActive: boolean
}

const Fireworks: React.FC<FireworksProps> = (props: FireworksProps) => {
  const { isActive } = props

  const [container, setContainer] = React.useState<HTMLDivElement | null>(null)
  const [canvas, setCanvas] = React.useState<HTMLCanvasElement | null>(null)

  const fireworkDisplayRef = useRef<FireworkDisplay | null>(null)
  const [isShowing, setIsShowing] = React.useState<boolean>(false)

  useEffect(() => {
    if (isActive) {
      setIsShowing(true)
    }

    if (container === null || canvas === null) {
      return
    }

    if (isActive) {
      fireworkDisplayRef.current = setupFireworks(container, canvas)
      return
    }

    if (fireworkDisplayRef.current !== null) {
      fireworkDisplayRef.current.finish(() => {
        setIsShowing(false)
      })
    }
  }, [container, canvas, isActive])

  if (isShowing === false) {
    return null
  }

  return (
    <Container ref={setContainer}>
      <Canvas ref={setCanvas} />
    </Container>
  )
}

export const FireworksContext = createContext<{
  showFireworks: (durationMilliseconds: number) => void
  hideFireworks: () => void
}>({
  showFireworks: () => {
    throw new Error("Can't call showFireworks outside of FireworksProvider")
  },
  hideFireworks: () => {
    throw new Error("Can't call hideFireworks outside of FireworksProvider")
  },
})

interface FireworksProviderProps {
  children: React.ReactNode
}

export const FireworksProvider: React.FC<FireworksProviderProps> = (
  props: FireworksProviderProps,
) => {
  const { children } = props

  const [isShowingFireworks, setIsShowingFireworks] = React.useState<boolean>(
    false,
  )
  const prefersReducedMotion = usePrefersReducedMotion()

  const hideFireworks = useCallback<() => void>(() => {
    setIsShowingFireworks(false)
  }, [])

  const showFireworks = useCallback<(durationMilliseconds: number) => void>(
    (durationMilliseconds) => {
      setIsShowingFireworks(true)
      setTimeout(() => {
        hideFireworks()
      }, durationMilliseconds)
    },
    [hideFireworks],
  )

  const value = React.useMemo(() => {
    return {
      showFireworks,
      hideFireworks,
    }
  }, [showFireworks, hideFireworks])

  return (
    <FireworksContext.Provider value={value}>
      {children}

      <Fireworks
        isActive={isShowingFireworks && prefersReducedMotion === false}
      />
    </FireworksContext.Provider>
  )
}

export const useFireworks = () => {
  return useContext(FireworksContext)
}
