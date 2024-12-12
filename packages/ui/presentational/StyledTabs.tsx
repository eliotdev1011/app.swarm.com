import { Tabs } from '@material-ui/core'
import styled from 'styled-components/macro'

export const StyledTabs = styled(Tabs)`
  .MuiTabs-indicator {
    background-color: ${({ theme }) => theme.colors.primary};
  }
`
