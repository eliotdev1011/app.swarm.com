import { Button } from 'rimble-ui'
import styled from 'styled-components/macro'

const StyledButton = styled(Button)`
  height: 2.5rem;
  font-size: 1rem;
  padding: ${({ theme }) => `${theme.space[2]}px ${theme.space[3]}px}`};
  justify-content: flex-start;
`

export default StyledButton
