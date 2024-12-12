import { OwnedNft, OwnedToken, TokenMetadataResponse } from 'alchemy-sdk'

import config from '@core/config'
import { spamKeywords, spamPatterns } from '@core/shared/consts/spam-tokens'
import { TokenType } from '@core/shared/enums'
import { unifyAddressToId } from '@core/web3'

const {
  resources: { iconsCdn: iconsBaseUrl },
} = config
const genericIconSrc = `${iconsBaseUrl}/svg/color/generic.svg`

export const isAlchemyNFTType = (
  asset: Partial<OwnedNft>,
): asset is OwnedNft => {
  return (
    asset.contract !== undefined &&
    'address' in asset.contract &&
    'tokenId' in asset
  )
}

export const isAlchemyTokenType = (
  asset: Partial<OwnedToken>,
): asset is OwnedToken => {
  return 'decimals' in asset
}

export const testIsSpamAsset = (name?: string, symbol?: string) => {
  if (!name || !symbol) return true
  const _name = name.toLowerCase()
  const _symbol = symbol.toLowerCase()
  for (const keyword of spamKeywords) {
    if (_name.includes(keyword) || _symbol.includes(keyword)) {
      return true
    }
  }
  for (const pattern of spamPatterns) {
    if (pattern.test(_name) || pattern.test(_symbol)) {
      return true
    }
  }
  return false
}

export const normalizeAlchemyNFT = (
  address: string,
  tokenType: TokenType,
  metadata: TokenMetadataResponse,
) => {
  return {
    id: unifyAddressToId(address),
    name: metadata.name || '',
    symbol: metadata.symbol || '',
    logo: metadata?.logo || genericIconSrc,
    decimals: metadata.decimals || 0,
    type: tokenType,
  }
}

export const normalizeAlchemyMetadata = (
  address: string,
  tokenType: TokenType,
  metadata: TokenMetadataResponse,
) => {
  return {
    id: unifyAddressToId(address),
    name: metadata.name || '',
    symbol: metadata.symbol || '',
    logo: metadata?.logo || genericIconSrc,
    decimals: metadata.decimals || 0,
    type: tokenType,
  }
}
