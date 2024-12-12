import { ReactNode } from 'react'
import { Loader as RimbleLoader } from 'rimble-ui'
import styled from 'styled-components/macro'
import { SizeProps } from 'styled-system'

interface LoaderProps extends SizeProps {
  error?: ReactNode
  loading?: boolean
  children: ReactNode
  inline?: boolean
}

const StyledRimbleLoader = styled(RimbleLoader)`
  ${({ inline }) => inline && `display: inline-block;`}
`

const Loader = ({
  loading = false,
  inline = false,
  error = null,
  children,
  ...props
}: LoaderProps) => {
  if (loading) {
    return <StyledRimbleLoader inline={inline} {...props} />
  }

  if (error) {
    return <>{error}</>
  }

  return <>{children}</>
}

export default Loader
