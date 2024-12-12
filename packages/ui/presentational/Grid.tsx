import { Box } from 'rimble-ui'
import styled from 'styled-components/macro'
import { grid } from 'styled-system'

const Grid = styled(Box)`
  display: grid;
  width: 100%;

  ${grid};
`

export default Grid
