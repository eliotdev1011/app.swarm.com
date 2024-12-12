import { ExtractProps } from '@swarm/types/props'
import { Text } from 'rimble-ui'
import styled from 'styled-components/macro'

import { useFirstValidationError } from './validation'

const StyledError = styled(Text.span)`
  white-space: break-spaces;
`

const ValidationError = (props: ExtractProps<typeof Text>) => {
  const error = useFirstValidationError()

  return (
    <StyledError color="danger" {...props}>
      {error || ' '}
    </StyledError>
  )
}

export default ValidationError
