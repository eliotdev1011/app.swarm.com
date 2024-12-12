import { Button, Loader } from 'rimble-ui'
import styled from 'styled-components/macro'

const StyledButton = styled(Button)`
  width: 100%;
`

interface Props extends React.ComponentProps<typeof Button> {
  isLoading?: boolean
  children: string
}

export const DialogActionButton: React.FC<Props> = (props: Props) => {
  const { isLoading = false, children, disabled, ...rest } = props

  return (
    <StyledButton {...rest} disabled={disabled || isLoading}>
      {isLoading ? (
        <>
          <Loader color="white" marginRight="8px" />
          {children}
        </>
      ) : (
        children
      )}
    </StyledButton>
  )
}
