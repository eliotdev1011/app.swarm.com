import { Flex } from 'rimble-ui'
import styled from 'styled-components/macro'

const PopupDataBox = styled(Flex)`
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  gap: ${({ theme }) => theme.space[3]}px;
  width: 100%;
`

export default PopupDataBox
