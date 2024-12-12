import { useStoredNetworkId } from '@swarm/core/web3'
import Content from '@swarm/ui/presentational/Content'
import Header from '@swarm/ui/swarm/Header'
import { useTheme } from '@swarm/ui/theme/useTheme'
import React, { ComponentType } from 'react'
import { Box, Flex } from 'rimble-ui'

import Announcements from './Announcements'
import { useAnnouncements } from './Announcements/useAnnouncements'
import Navigation, { Props as NavigationProps } from './Navigation'
import Footer from './Navigation/Footer'

interface LayoutProps {
  children?: React.ReactNode
  subheader?: React.ReactNode
  CustomNavigation?: ComponentType<NavigationProps>
  header?: React.ReactNode
  scrollable?: boolean
  headerActions?: React.ReactNode
}

const Layout = ({
  children,
  CustomNavigation,
  header,
  subheader,
  scrollable = false,
  headerActions,
}: LayoutProps) => {
  const theme = useTheme()

  const networkId = useStoredNetworkId()
  const { announcements, closeAnnouncement } = useAnnouncements(networkId)

  const hasAnnouncement = announcements !== null && announcements.length > 0

  const mobileTopFixedHeight = hasAnnouncement
    ? theme.layout.navigationBar.heightPixels +
      theme.layout.announcements.mobileHeightPixels
    : theme.layout.navigationBar.heightPixels

  const desktopTopFixedHeight = hasAnnouncement
    ? theme.layout.announcements.heightPixels
    : 0

  return (
    <Flex
      width="100%"
      height="100vh"
      flexDirection={['column', 'row']}
      justifyContent="flex-start"
      transform="translateZ(0)"
    >
      <Announcements
        announcements={announcements}
        closeAnnouncement={closeAnnouncement}
      />

      {CustomNavigation === undefined ? (
        <Navigation hasAnnouncement={hasAnnouncement} />
      ) : (
        <CustomNavigation hasAnnouncement={hasAnnouncement} />
      )}

      <Content
        noPadding
        fullScreen={!scrollable}
        width={['100%', 'calc(100% - 304px)']}
        height="auto"
        marginTop={[mobileTopFixedHeight, desktopTopFixedHeight]}
        marginLeft={[0, theme.layout.navigationBar.desktopWidthPixels]}
      >
        {header !== undefined ? (
          <Header
            title={header}
            subheader={subheader}
            position={scrollable ? 'sticky' : 'relative'}
            top={scrollable ? [mobileTopFixedHeight, desktopTopFixedHeight] : 0}
            zIndex={theme.zIndices.layerOne}
            shadowOnScroll={scrollable}
          >
            {headerActions}
          </Header>
        ) : null}

        {children}

        <Box
          display={['block', 'none']}
          flexShrink={0}
          width="100%"
          height={theme.layout.footer.heightPixels}
        />
      </Content>

      <Footer isMobile />
    </Flex>
  )
}

export default Layout
