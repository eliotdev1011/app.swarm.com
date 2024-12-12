import { unifyAddressToId } from '@swarm/core/web3'
import { AbstractNFT } from '@swarm/types/tokens'
import groupBy from 'lodash/groupBy'

export const groupGoldNfts = (
  nfts?: AbstractNFT[],
  goldKgAddress?: string,
  goldOzAddress?: string,
) => {
  const groupedSelectedNfts = groupBy(nfts, 'address')
  const goldKgNfts = goldKgAddress
    ? groupedSelectedNfts[unifyAddressToId(goldKgAddress)] || []
    : []
  const goldOzNfts = goldOzAddress
    ? groupedSelectedNfts[unifyAddressToId(goldOzAddress)] || []
    : []

  return { goldKgNfts, goldOzNfts }
}
