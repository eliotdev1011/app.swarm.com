import MUIDrawer from '@material-ui/core/Drawer'
import React from 'react'
import { createGlobalStyle } from 'styled-components/macro'

type Props = React.ComponentProps<typeof MUIDrawer>

const GlobalStyles = createGlobalStyle`
  .MuiDrawer-root.MuiDrawer-modal {
    z-index: ${({ theme }) => theme.zIndices.drawer} !important;
  }
`

export const Drawer: React.FC<Props> = (props: Props) => {
  return (
    <>
      <GlobalStyles />
      <MUIDrawer elevation={0} {...props} />
    </>
  )
}
