import { truncateStringInTheMiddle } from '@swarm/core/shared/utils'
import { getCanonicalIpfsUrl, isIpfsUrl } from '@swarm/core/shared/utils/crypto'
import { isUrl } from '@swarm/core/shared/utils/helpers/isUrl'
import { utils } from 'ethers'
import { ReactNode, useMemo } from 'react'
import { Box } from 'rimble-ui'
import { ColorProps } from 'styled-system'

import ExplorerLink from '@ui/swarm/Link/ExplorerLink'
import Link from '@ui/swarm/Link/Link'

export interface ValuePresenterProps extends ColorProps {
  value: ReactNode
  document?: boolean
  title?: string
}

const ValuePresenter = ({
  value,
  document = false,
  ...props
}: ValuePresenterProps) => {
  const type = useMemo(() => {
    if (typeof value === 'string') {
      if (utils.isAddress(value)) {
        return 'address'
      }

      if (isIpfsUrl(value)) {
        return 'ipfs'
      }

      if (isUrl(value)) {
        return 'url'
      }

      return 'string'
    }

    return 'other'
  }, [value])

  if (type === 'ipfs') {
    return (
      <Link
        color="text"
        fontWeight="bold"
        href={value ? getCanonicalIpfsUrl(value.toString()) : ''}
        label={document ? undefined : value}
        icon={document ? 'VerticalAlignBottom' : 'Launch'}
        download
        title={value?.toString() ?? ''}
        underlined
        width="100%"
        {...props}
      />
    )
  }

  if (type === 'url') {
    return (
      <Link
        color="text"
        fontWeight="bold"
        href={value?.toString() ?? ''}
        label={document ? undefined : value}
        icon={document ? 'VerticalAlignBottom' : 'Launch'}
        download
        title={value?.toString() ?? ''}
        underlined
        width="100%"
        {...props}
      />
    )
  }

  if (type === 'address') {
    return (
      <ExplorerLink
        color="text"
        fontWeight="bold"
        type="address"
        hash={value?.toString() ?? ''}
        label={truncateStringInTheMiddle(value?.toString() ?? '')}
        title={value?.toString() ?? ''}
        underlined
        width="100%"
        {...props}
      />
    )
  }

  if (type === 'string') {
    return (
      <Box
        color="black"
        fontWeight="bold"
        maxWidth="340px"
        textAlign="right"
        overflow="hidden"
        style={{
          textOverflow: 'ellipsis',
        }}
        title={value}
        {...props}
      >
        {value}
      </Box>
    )
  }

  return <>{value}</>
}

export default ValuePresenter
