import { ExtractProps } from '@swarm/types/props'
import { components } from 'react-select'
import styled from 'styled-components/macro'

import AddressPresentation from './AddressPresentation'

const StyledSelected = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`

const SingleValue = (props: ExtractProps<typeof components.SingleValue>) => {
  const { data } = props

  return (
    <components.SingleValue {...props}>
      <StyledSelected>
        <AddressPresentation value={data.value} label={data.label} />
      </StyledSelected>
    </components.SingleValue>
  )
}

export default SingleValue
