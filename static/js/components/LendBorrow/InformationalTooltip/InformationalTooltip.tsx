import TextWithTooltip from '@swarm/ui/presentational/Text/TextWithTooltip'
import React from 'react'

interface Props {
  label: string
  tooltip: string
}

export const InformationalTooltip: React.FC<Props> = (props: Props) => {
  const { label, tooltip } = props

  return (
    <TextWithTooltip
      tooltip={tooltip}
      fontSize={0}
      icon="Info"
      iconProps={{ color: 'grey', marginTop: 0 }}
      display="flex"
      flexDirection="row"
      justifyContent="flex-start"
      alignItems="center"
    >
      {label}
    </TextWithTooltip>
  )
}
