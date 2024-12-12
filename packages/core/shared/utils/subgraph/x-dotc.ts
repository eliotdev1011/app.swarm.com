import { NormalizedUserHolding } from '@swarm/types/normalized-entities/user-holding'
import { NormalizedXOffer } from '@swarm/types/normalized-entities/x-offer'
import { DotcAsset as NormalizedDotcAssets } from '@swarm/types/tokens/dotc'
import { DotcAsset, UserHolding, XOffer } from '@swarm/types/x-subgraph/graphql'

import { TokenType } from '@swarm/core/shared/enums'

import { big } from '../helpers'
import { isNFT } from '../tokens'

const tokenTypes = [
  // The token types are specified by their numbers, corresponding to the order of the array indexes.
  TokenType.noType, // 0
  TokenType.erc20, // 1
  TokenType.erc721, // 2
  TokenType.erc1155, // 3
]

export const normalizeTokenType = (tokenTypeNumeric: number) => {
  return tokenTypes[tokenTypeNumeric]
}

export const denormalizeTokenType = (tokenType?: TokenType) => {
  if (!tokenType) {
    return 0
  }
  const tokenTypeNumeric = tokenTypes.indexOf(tokenType)
  if (tokenTypeNumeric === -1) {
    return 0
  }
  return tokenTypeNumeric
}

export const normalizeOffers = (xOffers: XOffer[]): NormalizedXOffer[] => {
  return xOffers.map((offer) => ({
    ...offer,
    price: big(offer.price),
    timelockPeriod: Number(offer.timelockPeriod),
    expiresAt: Number(offer.expiresAt),
    createdAt: Number(offer.createdAt),
    depositAsset: offer.depositAsset,
    withdrawalAsset: offer.withdrawalAsset,
  }))
}

export const normalizeDotcAsset = (asset: DotcAsset): NormalizedDotcAssets => {
  const type = normalizeTokenType(asset.type)
  return {
    id: asset.id,
    name: asset.name,
    symbol: asset.symbol,
    address: asset.address,
    tokenId: isNFT(type) ? asset.tokenId?.toString() : null,
    assetType: asset.assetType,
    decimals: isNFT(type) ? null : asset.decimals,
    type,
    tradedVolume: asset.tradedVolume,
  } as NormalizedDotcAssets
}

export const normalizeUserHolding = (
  userHolding: UserHolding,
): NormalizedUserHolding => {
  return {
    id: userHolding.id,
    name: userHolding.tokenId.parentNFT.name,
    symbol: userHolding.tokenId.parentNFT.symbol,
    address: userHolding.tokenId.parentNFT.id,
    tokenId: userHolding.tokenId.id.split('-')[1],
  }
}
