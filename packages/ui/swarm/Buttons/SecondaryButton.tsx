import { ExtractProps } from '@swarm/types/props'
import { Button } from 'rimble-ui'

import SmartButton from './SmartButton'

const SecondaryButton = (props: ExtractProps<typeof Button>) => (
  <SmartButton.Outline
    width="fit-content"
    color="primary"
    border="1.5px solid"
    borderColor="primary"
    {...props}
  />
)

export default SecondaryButton
