import { Text } from 'rimble-ui'

import { useTheme } from '@swarm/ui/theme/useTheme'
import Clickable from '@ui/presentational/Clickable'

interface TokenActionButtonProps {
  selected?: boolean
  onClick: () => void
  label: React.ReactNode
}

const TokenActionButton = ({
  selected,
  onClick,
  label,
}: TokenActionButtonProps) => {
  const theme = useTheme()

  return (
    <Clickable
      backgroundColor={selected ? 'primary' : theme.colors.greyBackground}
      hoverBackgroundColor={
        selected ? 'primary' : theme.colors.greyBackgroundHover
      }
      color={selected ? 'white' : theme.colors['near-black']}
      paddingX="6px"
      paddingY="3px"
      borderRadius="4px"
      onClick={onClick}
    >
      <Text.span fontSize={1} fontWeight={4}>
        {label}
      </Text.span>
    </Clickable>
  )
}

export default TokenActionButton
