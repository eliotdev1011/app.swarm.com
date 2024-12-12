import { css } from 'styled-components/macro'

import { CustomInputProps } from './types'

export const customInputStyles = css<CustomInputProps>`
  border-color: ${({ theme }) => theme.colors['light-gray']}
    ${({ error, theme }) =>
      error &&
      `
    border-color: ${theme.colors.danger};

    &:focus {
      border-color: ${theme.colors.danger};
    }
  `};
`
