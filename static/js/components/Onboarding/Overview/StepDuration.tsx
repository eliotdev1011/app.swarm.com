import { Icon } from '@rimble/icons'
import { Box, Text } from 'rimble-ui'

interface StepDurationProps {
  legend: string
}

const StepDuration = ({ legend }: StepDurationProps) => {
  return (
    <Box height="40px" display="flex" alignItems="center">
      <Icon name="AccessTime" color="grey" />
      <Text.span color="grey" fontWeight={3} ml="10px">
        {legend}
      </Text.span>
    </Box>
  )
}

export default StepDuration
