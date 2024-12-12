import { Props as SVGProps } from 'react-inlinesvg'
import styled from 'styled-components/macro'
import { BackgroundProps, ColorProps, LayoutProps } from 'styled-system'

import SvgIcon from '../SvgIcon'

interface WrapperProps extends ColorProps, LayoutProps, BackgroundProps {}

const Wrapper = styled.div<WrapperProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${(props) => props.width || '100px'};
  height: ${(props) => props.height || '100px'};
  border-radius: 50%;
  background: ${({ theme, ...props }) =>
    props.background
      ? props.background.toString()
      : `linear-gradient(37.2deg, ${theme.colors['primary-lighter-variant']} 20.15%, ${theme.colors.primary} 87.15%)`};
`

type RewardsIconProps = Omit<SVGProps, 'src'> &
  ColorProps & {
    wrapHeight?: string
    wrapWidth?: string
    wrapBackground?: string
  }

const RewardsIcon = ({
  wrapWidth,
  wrapHeight,
  wrapBackground,
  width,
  height,
  className,
  ...rest
}: RewardsIconProps) => {
  return (
    <Wrapper
      background={wrapBackground}
      width={wrapWidth}
      height={wrapHeight}
      className={className}
    >
      <SvgIcon
        name="RewardsWhite"
        width={width || '58px'}
        height={height || '43px'}
        {...rest}
      />
    </Wrapper>
  )
}

export default RewardsIcon
