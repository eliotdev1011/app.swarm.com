import { AbstractAsset, AbstractNFT, AbstractToken } from '@swarm/types/tokens'
import { InvestAssetSG } from '@swarm/types/tokens/invest'

import { getCurrentConfig } from '@core/observables/configForNetwork'
import {
  NATIVE_TOKEN_SKELETON,
  STABLE_COIN_SYMBOLS,
  STOCK_TOKEN_SYMBOLS,
  VSMT_TOKEN,
} from '@core/shared/consts/known-tokens'
import { getLastUsedNetworkId, isSameEthereumAddress } from '@core/web3'
import { TokenType } from '@swarm/core/shared/enums'

export const hasAddress =
  (address: string) =>
  <T extends Pick<AbstractToken, 'id'>>(token: T) =>
    isSameEthereumAddress(token.id, address)

export const addressNot =
  (address: string) =>
  <T extends Pick<AbstractToken, 'id'>>(token: T) =>
    !isSameEthereumAddress(token.id, address)

export const hasSymbol =
  (...symbols: string[]) =>
  (token: Pick<AbstractToken, 'symbol'>) =>
    symbols.some(
      (symbol) => token.symbol.toLowerCase() === symbol.toLowerCase(),
    )

export const isNativeToken = hasAddress(NATIVE_TOKEN_SKELETON.address)

export const isWrappedNativeToken = <T extends Pick<AbstractToken, 'id'>>(
  token: T,
): boolean => {
  const currentNetworkConfig = getCurrentConfig()

  return hasAddress(currentNetworkConfig.nativeTokenWrapperAddress)(token)
}

export const isNotNativeToken = addressNot(NATIVE_TOKEN_SKELETON.address)

export const isVSMT = hasAddress(VSMT_TOKEN.address)

export const isUsdc = <T extends Pick<AbstractToken, 'id'>>(token: T) => {
  const { usdcAddress } = getCurrentConfig()

  return isSameEthereumAddress(usdcAddress, token.id)
}

export const isNotUsdc = <T extends Pick<AbstractToken, 'id'>>(token: T) => {
  return !isUsdc(token)
}

export const isStableCoin = (symbol: string) => {
  return hasSymbol(...STABLE_COIN_SYMBOLS)({ symbol })
}

export const isStockTokenType = (token: Pick<InvestAssetSG, 'assetType'>) =>
  token.assetType === 'stock'

export const isStockToken = (symbol: string) => {
  return hasSymbol(...STOCK_TOKEN_SYMBOLS)({ symbol })
}

export const isBrandingPoolToken = <T extends Pick<AbstractToken, 'id'>>(
  token: T,
) => {
  return true
}

export const isBrandingDOTCToken = <T extends Pick<AbstractToken, 'id'>>(
  token: T,
) => {
  const networkId = getLastUsedNetworkId()
  return true
}

export const isErc1155 = (tokenType: TokenType = TokenType.noType) =>
  tokenType === TokenType.erc1155

export function isERC20Type<T extends AbstractAsset>(
  token: Partial<T>,
): token is T {
  return 'decimals' in token && typeof token.decimals === 'number'
}

export function isNFTType<T extends AbstractAsset>(
  asset: AbstractAsset,
): asset is T & Required<Pick<T, 'address' | 'tokenId'>> {
  return 'address' in asset && 'tokenId' in asset && asset.tokenId !== null
}

export const isNFT = (tokenType: TokenType = TokenType.noType) => {
  return [TokenType.erc1155, TokenType.erc721].includes(tokenType)
}
