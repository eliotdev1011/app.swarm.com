import styled from 'styled-components/macro'

const ExpandableCell = styled.td<Record<string, unknown>>`
  display: ${({ expanded }) => (expanded ? 'block' : 'none')};
  opacity: ${({ hide }) => (hide ? '0' : '1')};
  transition: 0.1s;

  @media (min-width: ${({ theme }) => theme?.breakpoints[0]}) {
    display: table-cell;
  }
`

export default ExpandableCell
