import config from '@swarm/core/config'
import { FlaggedFeatureName } from '@swarm/core/hooks/data/useFeatureFlags'
import useClickAway from '@swarm/core/hooks/dom/useClickAway'
import { useTranslation } from 'react-i18next'
import { Button, Icon, Link, Text } from 'rimble-ui'
import styled from 'styled-components/macro'

import { useTheme } from '../theme/useTheme'

import FlaggedFeature from './FlaggedFeature'
import PassportIcon from './Icons/PassportIcon'
import SvgIcon from './SvgIcon'

const MenuWrapper = styled.div`
  box-sizing: border-box;
  display: inline-flex;
  position: relative;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  user-select: none;
`

const Menu = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 76px);
  position: absolute;
  top: 100%;
  padding: 28px;
  z-index: ${({ theme }) => theme.zIndices.threeDotsMenu};
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: 0px 3px 8px rgba(77, 77, 77, 0.25);
  border-radius: 4px;
  list-style: none;

  @media (max-width: ${({ theme }) => theme?.breakpoints[2]}) {
    left: unset;
    right: 0px;
  }
`

const MenuLink = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  text-decoration: none;
  margin-bottom: 36px;

  &:nth-last-child(-n + 2) {
    margin-bottom: 0px;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    opacity: 0.7;
  }

  span {
    margin-top: 7px;
    font-size: 14px;
    font-weight: 400;
  }
`

const ButtonIcon = styled(Button.Text)<{ active: boolean; color: string }>`
  display: flex;
  align-items: center;
  max-width: 40px;
  min-width: 40px;
  height: 40px;

  border-radius: 50px;
  transition: all 0.3s;
  ${({ active }) => active && 'background-color: rgba(0, 0, 0, 0.09);'}

  &:hover {
    border-radius: 50px;
    background-color: rgba(0, 0, 0, 0.09);
  }

  & svg > path {
    ${({ color }) => `color: ${color}; fill: ${color};`};
  }
`

const AppIcon = styled(Icon)`
  color: ${({ theme }) => theme.colors.icon.primary};
`

const { apps, docs } = config.resources

const ROUTES = {
  HOMEPAGE: '/',
  VERIFY_EMAIL: '/verify-email',
  ONBOARDING: '/onboarding',
  INVEST: '/invest',
  INVEST_CATEGORY: '/invest/:category',
  SWAP: '/swap',
  DOTC: '/dotc',
  DOTC_CATEGORY: '/dotc/:category?',
  POOLS: '/pools',
  POOLS_CATEGORY: '/pools/:category?',
  POOL_DETAILS: '/pool/:address',
  LENDING_AND_BORROWING: '/lend-borrow',
  WALLETS: '/wallets',
  PASSPORT: '/passport',
  TEST_FAUCET: '/faucet',
  VOUCHERS: '/vouchers',
  VOUCHERS_PAYMENT: '/vouchers/payment',
  VOUCHERS_LIST: '/vouchers/list',
  STAKING: '/staking',
  STAKING_CATEGORY: '/staking/:category',
}

const LINKS = {
  SWARM: apps.general,
  INVEST: `${apps.swarm}${ROUTES.INVEST}`,
  SWAP: `${apps.swarm}${ROUTES.SWAP}`,
  DOTC: `${apps.swarm}${ROUTES.DOTC}`,
  POOLS: `${apps.swarm}${ROUTES.POOLS}`,
  STAKING: `${apps.staking}${ROUTES.STAKING}`,
  WALLETS: `${apps.swarm}${ROUTES.WALLETS}`,
  PASSPORT: `${apps.swarm}${ROUTES.PASSPORT}`,
  DOCS: docs.general,
  VOTE: apps.vote,
}

interface SwarmAppsInterface {
  color?: string
}

export const SwarmApps = ({ color }: SwarmAppsInterface) => {
  const { t } = useTranslation('common')
  const { ref, active, toggle } = useClickAway()
  const theme = useTheme()

  return (
    <MenuWrapper>
      <ButtonIcon onClick={toggle} active={active} color={color}>
        <SvgIcon name="SwarmApps" width="22px" height="22px" />
      </ButtonIcon>

      {active && (
        <Menu ref={ref}>
          <MenuLink href={LINKS.SWARM} target="_blank">
            <SvgIcon
              height="30px"
              fill={theme.colors.icon.primary}
              name="Web"
            />
            <Text.span>{t('appsMenu.web')}</Text.span>
          </MenuLink>
          <MenuLink href={LINKS.INVEST} target="_blank">
            <SvgIcon
              height="30px"
              fill={theme.colors.icon.primary}
              name="Invest"
            />
            <Text.span>{t('appsMenu.invest')}</Text.span>
          </MenuLink>
          <FlaggedFeature name={FlaggedFeatureName.swapService}>
            <MenuLink href={LINKS.SWAP} target="_blank">
              <AppIcon name="SwapHoriz" size="30px" />
              <Text.span>{t('appsMenu.swap')}</Text.span>
            </MenuLink>
          </FlaggedFeature>
          <FlaggedFeature name={FlaggedFeatureName.allPools}>
            <MenuLink href={LINKS.POOLS} target="_blank">
              <SvgIcon
                height="30px"
                fill={theme.colors.icon.primary}
                name="Pools"
              />
              <Text.span>{t('appsMenu.pools')}</Text.span>
            </MenuLink>
          </FlaggedFeature>
          <MenuLink href={LINKS.STAKING} target="_blank">
            <SvgIcon height="30px" fill="#000" name="SMT" />
            <Text.span>{t('appsMenu.stake')}</Text.span>
          </MenuLink>

          <MenuLink href={LINKS.DOCS} target="_blank">
            <AppIcon name="InfoOutline" size="30px" />
            <Text.span>{t('appsMenu.docs')}</Text.span>
          </MenuLink>

          <MenuLink href={LINKS.VOTE} target="_blank">
            <SvgIcon
              name="Vote"
              height="30px"
              width="30px"
              fill={theme.colors.icon.primary}
            />
            <Text.span>{t('appsMenu.vote')}</Text.span>
          </MenuLink>
        </Menu>
      )}
    </MenuWrapper>
  )
}
