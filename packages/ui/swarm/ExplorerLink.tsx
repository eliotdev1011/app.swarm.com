import {
  generateExplorerUrl,
  truncateStringInTheMiddle,
} from '@swarm/core/shared/utils'
import { useStoredNetworkId } from '@swarm/core/web3'
import { ExplorerLinkType } from '@swarm/types'
import { ReactNode, useMemo } from 'react'
import { Icon, Link } from 'rimble-ui'
import styled from 'styled-components/macro'
import {
  ColorProps,
  FontSizeProps,
  FontWeightProps,
  MarginProps,
} from 'styled-system'

const StyledLink = styled(Link)`
  display: ${({ inline }) => (inline ? 'inline-flex' : 'flex')};
  color: ${({ theme, color }) =>
    theme.colors[color] ?? theme.colors['near-black']};
  text-overflow: ellipsis;
  font-size: ${({ theme }) => theme.fontSizes[2]}px;
  font-weight: ${({ theme, fontWeight }) => fontWeight ?? theme.fontWeights[2]};
  align-items: center;
`
interface ExplorerLinkProps
  extends MarginProps,
    ColorProps,
    FontSizeProps,
    FontWeightProps {
  type: ExplorerLinkType
  hash?: string
  iconOnly?: boolean
  label?: ReactNode
  inline?: boolean
  icon?: string
  iconSize?: string
  iconPosition?: 'right' | 'left'
  hoverColor?: string
  activeColor?: string
}

const getLabel = (iconOnly: boolean, hash?: string) => {
  if (iconOnly || hash === undefined) {
    return null
  }

  return truncateStringInTheMiddle(hash)
}

const ExplorerLink = ({
  type,
  hash,
  icon = 'Launch',
  iconOnly = false,
  iconSize = '16px',
  iconPosition = 'right',
  inline = false,
  label = getLabel(iconOnly, hash),
  ...props
}: ExplorerLinkProps) => {
  const networkId = useStoredNetworkId()

  const url = useMemo(
    () => generateExplorerUrl({ type, hash, chainId: networkId }),
    [hash, networkId, type],
  )

  return (
    <StyledLink
      target="_blank"
      hoverColor="text-light"
      inline={inline}
      title={url}
      {...props}
      href={url}
    >
      {iconPosition === 'left' && (
        <Icon name={icon} size={iconSize} mr={iconOnly ? 0 : '6px'} />
      )}
      {label}
      {iconPosition === 'right' && (
        <Icon name={icon} size={iconSize} ml={iconOnly ? 0 : '6px'} />
      )}
    </StyledLink>
  )
}

export default ExplorerLink
