import { Icon } from 'rimble-ui'
import styled from 'styled-components/macro'

export const StyledInfoIcon = styled(Icon)`
  color: ${({ theme }) => theme.colors.grey};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`
