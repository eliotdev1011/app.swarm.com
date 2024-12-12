import { ExtractProps } from '@swarm/types/props'
import { components } from 'react-select'
import { Text } from 'rimble-ui'
import styled from 'styled-components/macro'

const StyledMenu = styled.div`
  padding: 10px 5px;
`

export const Menu = (props: ExtractProps<typeof components.Menu>) => {
  const { children } = props
  return (
    <components.Menu {...props}>
      <StyledMenu>
        <Text.span color="grey" fontSize="16px" lineHeight="20px" ml={2}>
          Networks
        </Text.span>
        {children}
      </StyledMenu>
    </components.Menu>
  )
}
