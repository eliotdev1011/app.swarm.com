import { withStyles } from '@material-ui/core'
import MuiTooltip from '@material-ui/core/Tooltip'
import { ChildrenProps } from '@swarm/types'
import ExtractProps from '@swarm/types/props/extract-props'
import { forwardRef, ReactChild, ReactFragment, ReactPortal } from 'react'
import { Box } from 'rimble-ui'

import theme, { Color } from '@ui/theme'

const StyledTooltip = withStyles(() => ({
  popper: {
    zIndex: theme.zIndices.tooltip,
  },
  tooltip: {
    backgroundColor: Color.greyDark,
    fontSize: '12px',
    lineHeight: '16px',
    padding: '12px',
    whiteSpace: 'nowrap',
    maxWidth: 'none',
  },
  tooltipPlacementTop: {
    margin: '6px 0',
  },
}))(MuiTooltip)

interface TooltipProps
  extends Omit<ExtractProps<typeof MuiTooltip>, 'title' | 'children'>,
    ChildrenProps {
  message: boolean | ReactChild | ReactFragment | ReactPortal | string
  variant?: 'dark' | 'light'
}

const MyComponent = forwardRef<ChildrenProps, ChildrenProps>(
  function MyComponent(props, ref) {
    //  Spread the props to the underlying DOM element.
    return <Box {...props} ref={ref} display="flex" alignItems="center" />
  },
)

const Tooltip = ({ message, children, ...props }: TooltipProps) => {
  return (
    <>
      <StyledTooltip placement="top" {...props} title={message}>
        <MyComponent>{children}</MyComponent>
      </StyledTooltip>
    </>
  )
}

export default Tooltip
