import { ExtractProps } from '@swarm/types/props'
import { RouterLink, RouterLinkProps } from '@ui/presentational/RouterLink'
import StyledButton from '@ui/presentational/StyledButton'
import { ReactNode } from 'react'
import { Button } from 'rimble-ui'

interface LinkButtonProps extends ExtractProps<typeof Button> {
  label?: ReactNode
}

const LinkButton = ({
  pathname,
  state,
  hash,
  queryParams,
  label,
  children,
  ...props
}: RouterLinkProps & LinkButtonProps) => (
  <RouterLink
    pathname={pathname}
    state={state}
    hash={hash}
    queryParams={queryParams}
  >
    <StyledButton {...props}>{label || children}</StyledButton>
  </RouterLink>
)

export default LinkButton
