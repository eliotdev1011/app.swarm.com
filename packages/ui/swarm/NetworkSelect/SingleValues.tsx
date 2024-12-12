import { ExtractProps } from '@swarm/types/props'
import { components } from 'react-select'
import { Text } from 'rimble-ui'
import styled from 'styled-components/macro'

import SvgIcon from '../SvgIcon'

const StyledSelected = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  svg {
    width: 20px;
    height: 20px;
    min-width: 20px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints?.[1]}) {
    .selected-option-label {
      display: none;
    }
  }
`

export const SingleValue = (
  props: ExtractProps<typeof components.SingleValue>,
) => {
  const { data } = props

  return (
    <components.SingleValue {...props}>
      {' '}
      <StyledSelected>
        <SvgIcon name={data.icon} />
        <Text
          ml={[2, '10px']}
          mr="4px"
          fontWeight={4}
          className="selected-option-label"
        >
          {data.label}
        </Text>
      </StyledSelected>
    </components.SingleValue>
  )
}
