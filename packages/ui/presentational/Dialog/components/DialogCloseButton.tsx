import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import React from 'react'
import { Icon } from 'rimble-ui'

interface Props {
  label?: string
  onClick?: () => void
}

export const DialogCloseButton: React.FC<Props> = (props: Props) => {
  const { label, onClick } = props

  if (label === undefined) {
    return (
      <IconButton aria-label="close" onClick={onClick}>
        <Icon name="Close" size="20px" />
      </IconButton>
    )
  }

  return (
    <Button
      variant="text"
      style={{
        marginTop: '8px',
        marginRight: '8px',
        paddingLeft: '12px',
        paddingRight: '10px',
      }}
      onClick={onClick}
    >
      {label}
      <Icon name="Close" size="20px" marginLeft="6px" marginBottom="1px" />
    </Button>
  )
}
