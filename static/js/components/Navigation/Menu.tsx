import { Icon } from '@rimble/icons'
import { FlaggedFeatureName } from '@swarm/core/hooks/data/useFeatureFlags'
import Translate from '@swarm/ui/presentational/Translate'
import FlaggedFeature from '@swarm/ui/swarm/FlaggedFeature'
import SvgIcon from '@swarm/ui/swarm/SvgIcon'
import { useTranslation } from 'react-i18next'
import { generatePath, NavLink, useLocation } from 'react-router-dom'
import { Box } from 'rimble-ui'
import styled from 'styled-components/macro'

import { ROUTES } from 'src/routes'

export const StyledMenu = styled(Box)`
  background-color: ${({ theme }) => theme.colors.sidebar.background};
  flex-grow: 1;
  transform: ${({ open }) => (open ? 'translateX(0)' : 'translateX(-100%)')};
  transition: transform 0.3s ease-in-out;
  overflow: auto;
  max-height: 100vh;

  @media (min-width: ${({ theme }) => theme.breakpoints[0]}) {
    transform: none;
    transition: none;
    overflow-y: unset;
  }
  z-index: ${({ theme }) => theme.zIndices.navigationMenu};
`
export const StyledNav = styled.nav`
  padding: 55px 28px;

  @media (min-width: ${({ theme }) => theme.breakpoints[0]}) {
    padding: 36px;
  }
`

export const StyledLink = styled(NavLink)`
  text-decoration: none !important;
  color: ${({ theme }) => theme.colors.white};
  display: flex;
  font-size: ${({ theme }) => theme.fontSizes[3]}px;
  margin-bottom: 36px;
  align-items: center;
  opacity: 0.5;

  &:hover,
  &:active,
  &:focus,
  &.active {
    opacity: 1;
    color: ${({ theme }) => theme.colors.white};
  }
`

const DotcIcon = styled(SvgIcon)`
  & > * {
    stroke-width: 5.09px !important;
  }
`

interface MenuProps {
  open: boolean
}

const Menu = ({ open }: MenuProps) => {
  const { t } = useTranslation('navigation')
  const location = useLocation()

  return (
    <StyledMenu open={open}>
      <StyledNav>
        <StyledLink to={ROUTES.INVEST}>
          <SvgIcon
            height="32px"
            style={{ marginRight: '24px', marginLeft: '4px' }}
            name="AssetPageMenuIcon"
            color="white"
          />
          {t('menu.rwas')}
        </StyledLink>
        <FlaggedFeature name={FlaggedFeatureName.swapService}>
          <StyledLink to={ROUTES.SWAP}>
            <Icon size="32px" mr="20px" name="SwapHoriz" color="white" />
            {t('menu.swap')}
          </StyledLink>
        </FlaggedFeature>
        <StyledLink
          to={generatePath(ROUTES.DOTC_CATEGORY, { category: 'shared' })}
          isActive={() => location.pathname.includes(ROUTES.DOTC)}
        >
          <DotcIcon
            name="DOTCPageIcon"
            width="32px"
            style={{ marginRight: '20px' }}
          />
          <Translate namespaces={['navigation']}>menu.otc</Translate>
        </StyledLink>
        <FlaggedFeature name={FlaggedFeatureName.allPools}>
          <StyledLink to={ROUTES.POOLS}>
            <SvgIcon name="Pool" width="32px" style={{ marginRight: '20px' }} />
            {t('menu.pools')}
          </StyledLink>
        </FlaggedFeature>
        <FlaggedFeature name={FlaggedFeatureName.lendBorrowPage}>
          <StyledLink to={ROUTES.LENDING_AND_BORROWING}>
            <SvgIcon
              height="32px"
              style={{ marginRight: '20px' }}
              name="LendBorrowPageMenuIcon"
              color="white"
            />
            {t('menu.lendBorrow')}
          </StyledLink>
        </FlaggedFeature>
        <StyledLink to={ROUTES.WALLETS}>
          <SvgIcon name="Wallet" width="32px" style={{ marginRight: '20px' }} />
          {t('menu.wallets')}
        </StyledLink>
      </StyledNav>
    </StyledMenu>
  )
}

export default Menu
