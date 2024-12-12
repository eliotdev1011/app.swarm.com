import omit from 'lodash/omit'
import { Props as ReactSelectProps } from 'react-select'

import DropdownIndicator from './DropdownIndicator'
import Option from './Option'
import SingleValue from './SingleValue'
import StyledSelect from './StyledSelect'

const Select = (props: ReactSelectProps) => (
  <StyledSelect
    {...omit(props, ['theme'])}
    isSearchable={false}
    className="Select"
    classNamePrefix="Dropdown"
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    styles={{ valueContainer: (base: any) => ({ ...base, cursor: 'pointer' }) }}
    components={{
      Option,
      DropdownIndicator,
      SingleValue,
    }}
  />
)

export default Select
