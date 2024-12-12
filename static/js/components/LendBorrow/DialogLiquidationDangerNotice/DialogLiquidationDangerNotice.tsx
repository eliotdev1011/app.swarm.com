import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import React from 'react'
import { Box, Flash, Text } from 'rimble-ui'
import styled from 'styled-components/macro'

const StyledFlash = styled(Flash)`
  > * {
    font-size: 12px;
  }
`

interface Props extends React.ComponentProps<typeof Box> {
  noticeText: string
  acknowledgeText: string
  isAcknowledgeChecked: boolean
  setIsAcknowledgeChecked: (isChecked: boolean) => void
}

export const DialogLiquidationDangerNotice: React.FC<Props> = (
  props: Props,
) => {
  const {
    noticeText,
    acknowledgeText,
    isAcknowledgeChecked,
    setIsAcknowledgeChecked,
    ...boxProps
  } = props

  return (
    <Box
      {...boxProps}
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
      alignItems="center"
    >
      <StyledFlash variant="danger" marginBottom="20px" p="8px 12px" border={0}>
        {noticeText}
      </StyledFlash>
      <FormControlLabel
        control={
          <Checkbox
            color="primary"
            checked={isAcknowledgeChecked}
            onChange={(event, checked) => {
              setIsAcknowledgeChecked(checked)
            }}
          />
        }
        label={<Text fontSize={1}>{acknowledgeText}</Text>}
      />
    </Box>
  )
}
