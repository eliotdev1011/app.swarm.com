import { useTheme } from '@swarm/ui/theme/useTheme'
import { useState } from 'react'
import { Flex } from 'rimble-ui'
import styled from 'styled-components/macro'

import Footer from './Footer'
import Header from './Header'
import Menu from './Menu'

export const StyledNavigation = styled(Flex)`
  flex-direction: column;

  height: ${({ open }) => (open ? '140vh' : '48px')};

  position: fixed;
  left: 0;
  z-index: ${({ theme }) => theme.zIndices.navigation};

  @media (min-width: ${({ theme }) => theme.breakpoints[0]}) {
    flex-shrink: 0;
    height: 100vh;
  }
`

export interface Props {
  hasAnnouncement?: boolean
}

const Navigation = (props: Props) => {
  const { hasAnnouncement } = props

  const theme = useTheme()

  const [open, setOpen] = useState<boolean>(false)

  const toggleMenu = () => setOpen((prev: boolean) => !prev)

  return (
    <StyledNavigation
      top={
        hasAnnouncement
          ? [
              theme.layout.announcements.mobileHeightPixels,
              theme.layout.announcements.heightPixels,
            ]
          : 0
      }
      width={['100vw', `${theme.layout.navigationBar.desktopWidthPixels}px`]}
      open={open}
    >
      <Header open={open} toggleMenu={toggleMenu} />
      <Menu open={open} />
      <Footer isMobile={false} />
    </StyledNavigation>
  )
}

export default Navigation
