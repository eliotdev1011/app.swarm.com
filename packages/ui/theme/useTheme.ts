import { useContext } from 'react'
import { ThemeContext } from 'styled-components/macro'

import { Theme } from '.'

export function useTheme<T = Theme>() {
  return useContext<T>((ThemeContext as unknown) as React.Context<T>)
}
