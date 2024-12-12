import {
  allowedFintivTokens,
  allowedFintivXTokens,
  fintivTokens,
  fintivXTokens,
} from '@core/shared/consts/fintiv-tokens'
import {
  allowedMatrTokens,
  matrTokens,
  matrXTokens,
} from '@core/shared/consts/mattereum-tokens'
import { getLastUsedNetworkId, unifyAddressToId } from '@core/web3'

export type TokenType = 'XToken' | 'Token'

export const getFintivTokensIds = (
  tokenType: TokenType = 'Token',
): string[] => {
  const networkId = getLastUsedNetworkId()
  const allowedTokens =
    tokenType === 'Token' ? allowedFintivTokens : allowedFintivXTokens

  return allowedTokens[networkId].map((tokenId) => unifyAddressToId(tokenId))
}

export const getMattereumTokensIds = (): string[] => {
  const networkId = getLastUsedNetworkId()

  return allowedMatrTokens[networkId].map((tokenId) =>
    unifyAddressToId(tokenId || ''),
  )
}

export const getOnlyBrandTokensIds = (
  tokensType: TokenType = 'Token',
): string[] => {
  const networkId = getLastUsedNetworkId()
  const mattereumTokensIds = tokensType === 'Token' ? matrTokens : matrXTokens
  const fintivTokensIds = tokensType === 'Token' ? fintivTokens : fintivXTokens
  return [...mattereumTokensIds[networkId], ...fintivTokensIds[networkId]].map(
    unifyAddressToId,
  )
}
