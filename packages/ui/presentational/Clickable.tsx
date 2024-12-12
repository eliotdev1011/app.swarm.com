import { ReactNode } from 'react'
import styled, { css } from 'styled-components/macro'
import {
  background,
  BackgroundProps,
  border,
  BorderProps,
  color,
  ColorProps,
  flexbox,
  FlexboxProps,
  fontSize,
  FontSizeProps,
  margin,
  MarginProps,
  space,
  SpaceProps,
  width,
  WidthProps,
} from 'styled-system'

export type ClickableProps = SpaceProps &
  WidthProps &
  FontSizeProps &
  FlexboxProps &
  BorderProps &
  MarginProps &
  Omit<ColorProps, 'color'> &
  BackgroundProps & {
    hoverBackgroundColor?: string
    children: ReactNode
  }

const Clickable = styled.button<ClickableProps>`
  background: none;
  display: flex;
  border: none;
  padding: 0;
  outline: none;
  cursor: ${(props) => (props.onClick ? 'pointer' : 'default')};
  text-align: left;

  ${(props) =>
    props.hoverBackgroundColor &&
    css`
      &:hover {
        background-color: ${props.hoverBackgroundColor};
      }
    `}

  ${space}
  ${width}
  ${fontSize}
  ${color}
  ${flexbox}
  ${border}
  ${margin}
  ${background}
`

export default Clickable
