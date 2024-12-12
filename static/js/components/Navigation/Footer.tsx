import config from '@swarm/core/config'
import useFeatureFlags, {
  FlaggedFeatureName,
} from '@swarm/core/hooks/data/useFeatureFlags'
import { SupportedNetworkId } from '@swarm/core/shared/enums/supported-network-id'
import i18n from '@swarm/core/shared/i18n'
import { useAccount, useStoredNetworkId } from '@swarm/core/web3'
import Tooltip from '@swarm/ui/presentational/Tooltip'
import SvgIcon from '@swarm/ui/swarm/SvgIcon'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'
import { Flex, Icon, Link, Text } from 'rimble-ui'
import styled from 'styled-components/macro'

import { PackageVersion } from 'src/consts'
import { ROUTES } from 'src/routes'

const { isProduction } = config

const StyledFooter = styled(Flex)`
  flex-shrink: 0;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: ${({ theme }) => theme.zIndices.footer};

  background-color: ${({ theme }) => theme.colors.sidebar.background};
  justify-content: space-between;
`

export interface FooterProps {
  isMobile: boolean
}

const { docs } = config.resources

const footerLinks = [
  {
    href: docs.terms.disclaimer,
    text: i18n.t('navigation:footer.disclaimer'),
  },
]

const Footer: React.FC<FooterProps> = (props: FooterProps) => {
  const { isMobile } = props
  const { checkFeature } = useFeatureFlags()

  const { t } = useTranslation('navigation')
  const account = useAccount()
  const networkId = useStoredNetworkId()

  return (
    <StyledFooter
      px={[3, '24px']}
      py={[2, '24px']}
      flexDirection={['row', 'column']}
      alignItems={['center', 'flex-start']}
      width={['100vw', '304px']}
      height="auto"
      display={isMobile ? ['block', 'none'] : ['none', 'block']}
    >
      <Flex alignItems="center" paddingY={['12px', 0]}>
        {networkId && (
          <Tooltip
            message={t('footer.connectionTooltip', {
              name: SupportedNetworkId[networkId],
            })}
          >
            <Flex alignItems="center" mr={3}>
              <Icon
                name="Lens"
                size="8px"
                color={account ? 'success' : 'danger'}
                mr={1}
              />
              <Text color="white" fontWeight={5} fontSize={0}>
                {SupportedNetworkId[networkId]}
              </Text>
            </Flex>
          </Tooltip>
        )}
        {checkFeature(FlaggedFeatureName.faucet) && !isProduction() && (
          <RouterLink to={ROUTES.TEST_FAUCET} style={{ height: '18px' }}>
            <SvgIcon name="faucet" height="18px" />
          </RouterLink>
        )}
        <Text.span
          color="white"
          fontWeight={5}
          fontSize={0}
          lineHeight="copy"
          ml="24px"
        >
          {t('footer.version', { version: PackageVersion })}
        </Text.span>
      </Flex>
      <Flex display={['none', 'block']} mt="12px">
        {footerLinks.map(({ href, text }, id) => (
          <Link
            key={text + href}
            href={href}
            target="_blank"
            color="white"
            fontWeight={5}
            fontSize={0}
            lineHeight="copy"
            ml={id === 0 ? 0 : '24px'}
          >
            {text}
          </Link>
        ))}
      </Flex>
    </StyledFooter>
  )
}

export default Footer
