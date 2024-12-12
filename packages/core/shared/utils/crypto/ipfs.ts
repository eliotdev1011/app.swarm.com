import { genericRequest, IRequestInit } from '@core/services/api'

export const IPFS_REGEX =
  /^(ipfs:\/\/|https:\/\/[a-zA-Z0-9.-]+\/ipfs\/)([a-zA-Z0-9]{46})(\/?(.*))$/

const SWARM_DEDICATED_IPFS_GATEWAY = 'https://swarm.infura-ipfs.io/ipfs/'

export const isIpfsUrl = (url: string) => {
  return IPFS_REGEX.test(url) && url.length >= 46
}

export const getCanonicalIpfsUrlFromKya = (kya: string) => {
  return `${SWARM_DEDICATED_IPFS_GATEWAY}${kya}`
}

export const getCanonicalIpfsUrl = (url: string) => {
  if (isIpfsUrl(url)) {
    return url.replace(IPFS_REGEX, `${SWARM_DEDICATED_IPFS_GATEWAY}$2$3`)
  }

  throw new Error(`'${url}' is not a valid ipfs url`)
}

export const requestIpfs = async (url: string, options?: IRequestInit) => {
  const canonicalUrl = getCanonicalIpfsUrl(url)

  return genericRequest(canonicalUrl, {
    ...options,
    shouldNotReturnDataProperty: true,
  })
}
