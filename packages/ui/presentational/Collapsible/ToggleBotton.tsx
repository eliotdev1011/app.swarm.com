import { Button } from 'rimble-ui'
import styled from 'styled-components/macro'

const ToggleButton = styled(Button.Text).attrs({
  size: 'small',
})`
  height: 22px;
  line-height: 22px;
  padding: 0;

  & > div:last-child > svg {
    margin-right: 0;
  }

  &:hover {
    text-decoration: none;
  }
`

export default ToggleButton
