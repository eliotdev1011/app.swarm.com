import Collapse from '@material-ui/core/Collapse'
import { ChildrenProps } from '@swarm/types'
import Divider from '@ui/presentational/Divider'
import { useCallback, useState } from 'react'
import { Flex } from 'rimble-ui'
import { MarginProps, PaddingProps } from 'styled-system'

import ToggleButton from './ToggleBotton'

type PopupDataSectionProps = ChildrenProps &
  PaddingProps &
  MarginProps & {
    title: string
    defaultExpanded?: boolean
    dividerThickness?: number
    onChange?: (expanded: boolean) => void
  }

function Collapsible({
  children,
  title,
  defaultExpanded = false,
  dividerThickness = 1,
  onChange,
  ...containerProps
}: PopupDataSectionProps) {
  const [expanded, setExpanded] = useState<boolean>(defaultExpanded)

  const toggle = useCallback(
    () => setExpanded((prevExpanded) => !prevExpanded),
    [],
  )

  return (
    <Flex
      flexDirection="column"
      justifyContent="flex-start"
      alignItems="stretch"
      width="100%"
      {...containerProps}
    >
      {!!dividerThickness && <Divider mb={3} thickness={dividerThickness} />}
      <ToggleButton
        icon={expanded ? 'KeyboardArrowUp' : 'KeyboardArrowDown'}
        onClick={toggle}
        iconpos="right"
        mb={3}
      >
        <Flex
          color="grey"
          fontWeight="bold"
          justifyContent="center"
          alignItems="center"
          fontSize={1}
        >
          {title}
        </Flex>
      </ToggleButton>
      <Collapse in={expanded} timeout={300}>
        {children}
      </Collapse>
    </Flex>
  )
}

export default Collapsible
