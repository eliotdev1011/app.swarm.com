import { Props as ReactSelectProps } from 'react-select'
import styled from 'styled-components/macro'

import AddressPresentation from './AddressPresentation'

const StyledOption = styled.div<{ disabled: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 6px 10px;
  width: 100%;
  max-width: calc(100% - 24px);

  &:hover {
    cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints[0]}) {
    padding: 12px;
  }
`

const Option = ({ data, innerRef, innerProps }: ReactSelectProps) => (
  <StyledOption ref={innerRef} {...innerProps} disabled={data.isDisabled}>
    <AddressPresentation
      value={data.value}
      label={data.label}
      disabled={data.isDisabled}
    />
  </StyledOption>
)

export default Option
