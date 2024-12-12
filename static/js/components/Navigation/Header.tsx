import { getSvgUrl } from '@swarm/core/shared/utils/cdn'
import NetworkSelect from '@swarm/ui/swarm/NetworkSelect'
import { SwarmApps } from '@swarm/ui/swarm/SwarmApps'
import { Box, Flex } from 'rimble-ui'
import styled from 'styled-components/macro'

const StyledBurger = styled.button<{ open: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 27px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: ${({ theme }) => theme.zIndices.header};
  height: fit-content;
  span {
    width: 100%;
    height: 3px;
    margin-top: 4.5px;
    background-color: #ffffff;
    transition: all 0.3s linear;
    position: relative;
    transform-origin: 3px;
    :first-child {
      transform: ${({ open }) => (open ? 'rotate(45deg)' : 'rotate(0)')};
      margin-top: 0;
    }
    :nth-child(2) {
      opacity: ${({ open }) => (open ? '0' : '1')};
      transform: ${({ open }) => (open ? 'translateX(20px)' : 'translateX(0)')};
    }
    :nth-child(3) {
      transform: ${({ open }) => (open ? 'rotate(-45deg)' : 'rotate(0)')};
    }
  }

  @media (min-width: ${({ theme }) => theme.breakpoints[0]}) {
    display: none;
  }
`

const StyledHeader = styled(Box)`
  background-color: ${({ theme }) => theme.colors.sidebar.background};
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const SwarmAppsWrapper = styled(Box)`
  @media (min-width: ${({ theme }) => theme.breakpoints[0]}) {
    display: none;
  }
`

const Avatar = styled.div`
  width: 43px;
  height: 32px;
  background: url(${getSvgUrl('SwarmMobileLogo')}) center no-repeat;
  background-size: contain;

  @media (min-width: ${({ theme }) => theme.breakpoints[0]}) {
    width: 180px;
    height: 38px;
    background-image: url(${getSvgUrl('SwarmNewLogo')});
  }
`

interface HeaderProps {
  open: boolean
  toggleMenu?: () => void
  appsWidget?: boolean
  networkSelect?: boolean
}

const Header = ({
  open,
  toggleMenu,
  appsWidget = true,
  networkSelect = true,
}: HeaderProps) => {
  return (
    <StyledHeader px={[3, '28px']} py={[2, '28px']}>
      <Avatar />
      <Flex alignItems="center">
        {networkSelect && (
          <Box mr="12px" display={['block', 'none']}>
            <NetworkSelect />
          </Box>
        )}

        {appsWidget && (
          <SwarmAppsWrapper mr={3}>
            <SwarmApps color="white" />
          </SwarmAppsWrapper>
        )}

        <StyledBurger
          aria-label="Toggle menu"
          aria-expanded={open}
          open={open}
          onClick={toggleMenu}
        >
          <span />
          <span />
          <span />
        </StyledBurger>
      </Flex>
    </StyledHeader>
  )
}

export default Header
