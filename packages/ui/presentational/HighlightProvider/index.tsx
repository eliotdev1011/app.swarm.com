import { ChildrenProps } from '@swarm/types'
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

interface HighlightContextType {
  highlightedIndex: number | null
  setHighlightedIndex: Dispatch<SetStateAction<number | null>>
}

const HighlightContext = createContext<HighlightContextType>({
  highlightedIndex: null,
  setHighlightedIndex: () => {},
})

export const HighlightProvider = ({ children }: ChildrenProps) => {
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null)

  return (
    <HighlightContext.Provider
      value={useMemo(
        () => ({
          highlightedIndex,
          setHighlightedIndex,
        }),
        [highlightedIndex],
      )}
    >
      {children}
    </HighlightContext.Provider>
  )
}

export const useHighLight = (index: number) => {
  const { highlightedIndex, setHighlightedIndex } = useContext(HighlightContext)

  const toggleHighlight = useCallback(
    (newState?: boolean) =>
      newState === undefined
        ? setHighlightedIndex((prevIndex) =>
            prevIndex === index ? null : index,
          )
        : setHighlightedIndex(newState ? index : null),
    [index, setHighlightedIndex],
  )

  const highlighted = useMemo(() => highlightedIndex === index, [
    highlightedIndex,
    index,
  ])

  return {
    toggleHighlight,
    highlighted,
  }
}
