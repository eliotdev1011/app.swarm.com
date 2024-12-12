import { Flex, Icon } from 'rimble-ui'
import styled from 'styled-components/macro'

import Tooltip from '../Tooltip'

const StyledThead = styled.thead`
  display: none;

  @media (min-width: ${({ theme }) => theme?.breakpoints[0]}) {
    display: table-header-group;
  }
`

interface TableHeadProps {
  columns: Array<{
    id: string
    width?: string
    label?: React.ReactNode
    justify?: 'flex-end' | 'flex-start' | 'center'
    help?: string
  }>
  invisible?: boolean
}

const TableHead = ({ columns, invisible = false }: TableHeadProps) => {
  return (
    <>
      <colgroup>
        {columns.map(({ id, width }) => (
          <col key={id} {...(width && { style: { width } })} />
        ))}
      </colgroup>
      {!invisible && (
        <StyledThead>
          <tr>
            {columns.map(({ id, label, justify, help }) => (
              <th key={id}>
                {label && (
                  <Flex
                    alignItems="center"
                    {...(justify && { justifyContent: justify })}
                  >
                    {label}
                    {help && (
                      <Tooltip placement="top" message={help}>
                        <Icon
                          size="16px"
                          name="Help"
                          ml={1}
                          mt={-1}
                          style={{ cursor: 'pointer' }}
                        />
                      </Tooltip>
                    )}
                  </Flex>
                )}
              </th>
            ))}
          </tr>
        </StyledThead>
      )}
    </>
  )
}

export default TableHead
