import { Box } from 'rimble-ui'
import { MarginProps } from 'styled-system'

interface DividerProps extends MarginProps {
  thickness?: number
  color?: string
}

const Divider = ({
  thickness = 1,
  color = 'border',
  ...props
}: DividerProps) => {
  return (
    <Box
      width="100%"
      height="0"
      borderBottomWidth={`${thickness}px`}
      borderBottomStyle="solid"
      borderColor={color}
      my="24px"
      {...props}
    />
  )
}

export default Divider
