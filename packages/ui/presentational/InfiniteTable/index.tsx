import useForwardedRef from '@swarm/core/hooks/dom/useForwardedRef'
import { useInfiniteScroll } from '@swarm/core/hooks/useInfiniteScroll'
import React, { forwardRef } from 'react'
import { Flex, Loader } from 'rimble-ui'
import styled from 'styled-components/macro'

import Table from '../StyledTable'

const StyledTable = styled(Table)<{ height?: string }>`
  table-layout: fixed;
  overflow: auto;

  th,
  td {
    overflow: hidden;
    text-align: left;
    padding: 12px 8px;
  }

  th {
    position: sticky;
  }

  td {
    scroll-snap-align: start;
  }
`

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TableWrapper = styled.div<any>`
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
`

interface InfiniteTableProps {
  colgroup: React.ReactNode
  head: React.ReactNode
  children: React.ReactChild[]
  noResults: React.ReactNode
  hasMore: boolean
  loading: boolean
  loadMore: () => void
  className?: string
  totalCols?: number
}

const InfiniteTable = forwardRef<HTMLDivElement, InfiniteTableProps>(
  (
    {
      colgroup,
      head,
      children,
      noResults,
      loading,
      hasMore,
      loadMore,
      className,
      totalCols = 7,
    }: InfiniteTableProps,
    ref,
  ) => {
    const scrollParentRef = useForwardedRef<HTMLDivElement>(ref)

    const loaderRef = useInfiniteScroll<HTMLTableRowElement>({
      hasMore,
      loadMore,
    })

    return (
      <Flex flexDirection="column" justifyContent="stretch" overflow="auto">
        <StyledTable className={className}>
          {colgroup}
          {!!head && <thead>{head}</thead>}
        </StyledTable>
        <TableWrapper ref={scrollParentRef}>
          <StyledTable className={className} height="auto">
            {colgroup}

            <tbody>
              {loading === false && children.length === 0
                ? noResults
                : children}
              {loading === true ? (
                <tr key="loading">
                  <td colSpan={totalCols}>
                    <Loader m="auto" />
                  </td>
                </tr>
              ) : null}
              <tr key="loader" ref={loaderRef} />
            </tbody>
          </StyledTable>
        </TableWrapper>
      </Flex>
    )
  },
)

InfiniteTable.displayName = 'InfiniteTable'

export default InfiniteTable
