import { NetworkId } from '@swarm/types/config'
import {
  Alchemy,
  AlchemySettings,
  GetNftsForOwnerOptions,
  GetTokensForOwnerOptions,
  Network,
  OwnedNft,
  OwnedToken,
} from 'alchemy-sdk'

import { getCurrentConfig } from '@core/observables/configForNetwork'
import { SupportedNetworkId } from '@core/shared/enums/supported-network-id'
import wait from '@core/shared/utils/helpers/wait'
import { getLastUsedNetworkId } from '@core/web3'

import { isAlchemyNFTType, isAlchemyTokenType, testIsSpamAsset } from './utils'

const AlchemyNetwork: Record<NetworkId, Network> = {
  [SupportedNetworkId.Ethereum]: Network.ETH_MAINNET,
  [SupportedNetworkId.Polygon]: Network.MATIC_MAINNET,
  [SupportedNetworkId.Base]: Network.BASE_MAINNET,
  [SupportedNetworkId.ArbitrumSepolia]: Network.ARB_SEPOLIA,
}

class AlchemyAPI {
  private static getCurrentNetworkSettings() {
    const config = getCurrentConfig()
    const networkId = getLastUsedNetworkId()

    return {
      apiKey: config.alchemyApiKey,
      network: AlchemyNetwork[networkId],
    }
  }

  private static createAlchemyInstance = (
    additionalSettings?: AlchemySettings,
  ) => {
    const settings = this.getCurrentNetworkSettings()
    return new Alchemy({ ...settings, ...additionalSettings })
  }

  // Function to check if a token is spam based on name or symbol
  static isSpamToken(token: OwnedToken): boolean {
    if ('decimals' in token && !token.decimals) return true
    return testIsSpamAsset(token.name, token.symbol)
  }

  static isSpamNFT(token: OwnedNft): boolean {
    const { symbol, isSpam } = token.contract
    return isSpam !== true || testIsSpamAsset(token.name, symbol)
  }

  static isSpam(asset: OwnedNft | OwnedToken): boolean {
    if (isAlchemyNFTType(asset)) {
      return this.isSpamNFT(asset)
    } else if (isAlchemyTokenType(asset)) {
      return this.isSpamToken(asset)
    }
    return true
  }

  static getTokenMetadata(address: string) {
    const alchemy = this.createAlchemyInstance()
    return alchemy.core.getTokenMetadata(address)
  }

  static getTokensForOwner(
    address: string,
    options?: GetTokensForOwnerOptions,
  ) {
    const alchemy = this.createAlchemyInstance()
    return alchemy.core.getTokensForOwner(address, options)
  }

  static async getAllTokensForOwner(address: string) {
    const alchemy = this.createAlchemyInstance()
    let response = await alchemy.core.getTokensForOwner(address)
    const allTokens = [...response.tokens]
    while (response.pageKey) {
      await wait(1000)
      response = await alchemy.core.getTokensForOwner(address, {
        pageKey: response.pageKey,
      })
      allTokens.push(...response.tokens)
    }
    return {
      tokens: allTokens,
    }
  }

  static getNftsForOwner(address: string, options?: GetNftsForOwnerOptions) {
    const alchemy = this.createAlchemyInstance()
    return alchemy.nft.getNftsForOwner(address, options)
  }
}

export default AlchemyAPI
