import { useStoredNetworkId } from '@swarm/core/web3'
import {
  generateExplorerUrl,
  truncateStringInTheMiddle,
} from '@swarm/core/shared/utils'
import { ExplorerLinkType } from '@swarm/types'

import Link, { LinkProps } from './Link'

interface ExplorerLinkProps extends Omit<LinkProps, 'href' | 'hash'> {
  type: ExplorerLinkType
  hash?: string
  iconOnly?: boolean
}

const getLabel = (iconOnly: boolean, hash?: string) => {
  if (iconOnly || hash === undefined) {
    return null
  }

  return truncateStringInTheMiddle(hash)
}

const ExplorerLink = ({
  type,
  hash,
  icon = 'Launch',
  iconOnly = false,
  label = getLabel(iconOnly, hash),
  ...props
}: ExplorerLinkProps) => {
  const networkId = useStoredNetworkId()

  return (
    <Link
      hoverColor="text-light"
      {...props}
      label={label}
      href={generateExplorerUrl({ type, hash, chainId: networkId })}
      icon={icon}
    />
  )
}

export default ExplorerLink
