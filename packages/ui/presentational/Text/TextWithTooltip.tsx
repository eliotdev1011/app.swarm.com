import React, { ComponentType } from 'react'
import { Flex, Icon } from 'rimble-ui'

import Tooltip from '../Tooltip'

type WrapperType = keyof JSX.IntrinsicElements | ComponentType<any> | string

type TextWithTooltipProps = {
  children: React.ReactNode
  icon?: string
  iconSize?: string
  iconProps?: Record<string, unknown>
  tooltip: string
  wrapper?: WrapperType
  color?: string
  [k: string]: unknown
}

const TextWithTooltip = ({
  children,
  icon = 'Help',
  iconSize = '16px',
  iconProps = {},
  color = '',
  tooltip,
  wrapper = Flex,
  ...props
}: TextWithTooltipProps) => {
  const Tag = wrapper

  return (
    <Tag
      style={{
        alignItems: 'center',
      }}
      {...props}
    >
      {children}
      <Tooltip placement="top" message={tooltip}>
        {icon && (
          <Icon
            size={iconSize}
            name={icon}
            ml={1}
            style={{ cursor: 'pointer' }}
            color={color}
            {...iconProps}
          />
        )}
      </Tooltip>
    </Tag>
  )
}

export default TextWithTooltip
