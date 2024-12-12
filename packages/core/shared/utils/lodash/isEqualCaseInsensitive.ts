import { utils } from 'ethers'

import { isSameEthereumAddress } from '@core/web3'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isEqualCaseInsensitive(first: any, second: any) {
  if (utils.isAddress(first)) {
    return utils.isAddress(second) && isSameEthereumAddress(first, second)
  }

  if (typeof first === 'string') {
    return (
      typeof second === 'string' && first.toLowerCase() === second.toLowerCase()
    )
  }

  return first === second
}
