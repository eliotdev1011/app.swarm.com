import omit from 'lodash/omit'
import ReactSelect, { Props as ReactSelectProps } from 'react-select'
import { Box, Text } from 'rimble-ui'
import styled from 'styled-components/macro'
import { height } from 'styled-system'

import DropdownIndicator from './DropdownIndicator'
import Option from './Option'
import SingleValue from './SingleValue'

const StyledSelect = styled(ReactSelect)`
  &.Select {
    width: 100%;

    .Select-value {
      display: inline-flex;
      align-items: center;
    }

    .Dropdown__control {
      border-color: ${({ theme }) => theme.colors.grey};
      ${height}
    }

    .Dropdown__indicator-separator {
      display: none;
    }

    .Dropdown__menu {
      margin-top: 4px;
    }
  }
  & .Select-placeholder {
    font-size: smaller;
  }
`

export interface AddressSelectOption {
  value: string
  label: string
  connected?: boolean
  disabled?: boolean
}

const AddressSelect = ({ label, ...props }: ReactSelectProps) => (
  <Box>
    {!!label && (
      <Text.span color="near-black" fontSize={1}>
        {label}
      </Text.span>
    )}
    <StyledSelect
      {...omit(props, ['theme'])}
      isSearchable={false}
      className="Select"
      classNamePrefix="Dropdown"
      styles={{
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        valueContainer: (provided: any) => ({ ...provided, cursor: 'pointer' }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        singleValue: (provided: any) => ({
          ...provided,
          width: '100%',
        }),
      }}
      components={{
        Option,
        DropdownIndicator,
        SingleValue,
      }}
    />
  </Box>
)

export default AddressSelect
