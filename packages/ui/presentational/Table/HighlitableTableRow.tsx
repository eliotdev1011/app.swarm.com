import { ChildrenProps } from '@swarm/types'
import { MouseEventHandler } from 'react'

import { useHighLight } from '../HighlightProvider'

import TableRow from './TableRow'

interface HighlightableTableRowProps
  extends ChildrenProps,
    Omit<React.HTMLAttributes<HTMLTableRowElement>, 'children'> {
  rowIndex: number
  onClick?: MouseEventHandler<HTMLTableRowElement>
}

const HighlightableTableRow = ({
  rowIndex,
  children,
  onClick,
  ...props
}: HighlightableTableRowProps) => {
  const { toggleHighlight } = useHighLight(rowIndex)

  return (
    <TableRow
      onMouseEnter={() => toggleHighlight(true)}
      onMouseLeave={() => toggleHighlight(false)}
      onClick={onClick}
      {...props}
    >
      {children}
    </TableRow>
  )
}

export default HighlightableTableRow
