import React, { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components/macro'

export interface RouterLinkProps {
  pathname: string
  queryParams?: string[][] | Record<string, string> | string | URLSearchParams
  hash?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  state?: any
  children?: React.ReactNode
}

export const StyledRouterLink = styled(Link)`
  text-decoration: none;
  &:visited {
    color: ${({ theme }) => theme.colors['primary-dark']};
  }
`

export const RouterLink = ({
  pathname,
  queryParams,
  hash,
  state,
  children,
}: RouterLinkProps) => {
  const location = useLocation()
  const search = useMemo(
    () =>
      `?${location.search.replace('?', '')}&${new URLSearchParams(
        queryParams,
      )}`,
    [queryParams, location],
  )

  return (
    <StyledRouterLink to={{ pathname, search, hash, state }}>
      {children}
    </StyledRouterLink>
  )
}
