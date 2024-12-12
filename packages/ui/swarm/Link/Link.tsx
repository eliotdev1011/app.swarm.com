import { ReactNode } from 'react'
import { Icon, Link as RimbleLink, Text } from 'rimble-ui'
import styled from 'styled-components/macro'
import {
  ColorProps,
  FontSizeProps,
  FontWeightProps,
  MarginProps,
  WidthProps,
} from 'styled-system'

const StyledLink = styled(RimbleLink)`
  display: ${({ inline }) => (inline ? 'inline-flex' : 'flex')};
  color: ${({ theme, color }) =>
    theme.colors[color] ?? theme.colors['near-black']};
  text-overflow: ellipsis;
  font-size: ${({ theme }) => theme.fontSizes[2]}px;
  font-weight: ${({ theme, fontWeight }) => fontWeight ?? theme.fontWeights[2]};
  align-items: center;
  ${({ underlined }) => underlined && 'text-decoration: underline;'}
`
export interface LinkProps
  extends MarginProps,
    ColorProps,
    FontSizeProps,
    FontWeightProps,
    WidthProps {
  download?: string | boolean
  label?: ReactNode
  inline?: boolean
  icon?: string
  iconSize?: string
  hoverColor?: string
  activeColor?: string
  href: string
  title?: string
  underlined?: boolean
}

const Link = ({
  icon,
  iconSize = '16px',
  inline = false,
  underlined = false,
  label,
  href,
  ...props
}: LinkProps) => {
  return (
    <StyledLink
      target="_blank"
      hoverColor="text-light"
      title={label}
      {...props}
      inline={inline}
      href={href}
      underlined={underlined}
    >
      {label && (
        <Text.span
          {...props}
          overflow="hidden"
          style={{ textOverflow: 'ellipsis' }}
          textAlign="right"
        >
          {label}
        </Text.span>
      )}
      {icon && (
        <Icon
          name={icon}
          size={iconSize}
          ml={label === undefined ? 0 : '6px'}
        />
      )}
    </StyledLink>
  )
}

export default Link
