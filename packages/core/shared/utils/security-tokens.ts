import { Swap } from '@swarm/types'
import { AbstractToken } from '@swarm/types/tokens'
import { InvestAssetSG, InvestAssetType } from '@swarm/types/tokens/invest'
import { isIndex } from 'mathjs'

import { isSameEthereumAddress } from '@core/web3'

import { getCurrentBrandingTokens } from '../subgraph'

export const swapHasToken = (tokenId: string) => (swap: Swap) =>
  isSameEthereumAddress(tokenId, swap.tokenIn) ||
  isSameEthereumAddress(tokenId, swap.tokenOut)

export const getSwapTokenAmount = (swap?: Swap, xTokenId?: string) => {
  if (xTokenId && swap) {
    if (isSameEthereumAddress(xTokenId, swap.tokenIn)) {
      return swap?.tokenAmountIn
    }
    if (isSameEthereumAddress(xTokenId, swap.tokenOut)) {
      return swap?.tokenAmountOut
    }
  }

  return null
}

export const isStakingNode = (token: Pick<InvestAssetSG, 'assetType'>) =>
  token.assetType === 'liquidStaking'

export const isStockToken = (token: Pick<InvestAssetSG, 'assetType'>) =>
  token.assetType === 'stock'

export const isBond = (token: Pick<InvestAssetSG, 'assetType'>) =>
  token.assetType === 'bond'

export const isIndexToken = (token: Pick<InvestAssetSG, 'assetType'>) =>
  token.assetType === 'index'

export const isBrandingToken = (
  token: Pick<InvestAssetSG, 'assetType' | 'id'>,
) => {
  const brandingTokens = getCurrentBrandingTokens('Token')
  return brandingTokens.some((btAddress) =>
    isSameEthereumAddress(btAddress, token.id),
  )
}

export const isStakingNodeOrStockToken = (
  token: Pick<InvestAssetSG, 'assetType'>,
) => isStakingNode(token) || isStockToken(token)

export const isSecurityToken = (token: Pick<InvestAssetSG, 'assetType'>) =>
  isStockToken(token) || isBond(token) || isIndexToken(token)

const ETH2snSymbol = 'eth2sn'

export const isETH2sn = <T extends Pick<AbstractToken, 'symbol'>>(token: T) =>
  token.symbol.toLowerCase() === ETH2snSymbol

export const getType = (kyaAssetType = ''): InvestAssetType => {
  if (kyaAssetType.includes('Staking') || kyaAssetType.includes('staking')) {
    return 'liquidStaking'
  }
  if (kyaAssetType.includes('Stock') || kyaAssetType.includes('stock')) {
    return 'stock'
  }
  if (kyaAssetType.includes('Bond') || kyaAssetType.includes('bond')) {
    return 'bond'
  }
  if (kyaAssetType.includes('Index') || kyaAssetType.includes('index')) {
    return 'index'
  }
  return 'unknown'
}
