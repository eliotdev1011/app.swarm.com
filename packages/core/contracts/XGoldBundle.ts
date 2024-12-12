import { AbstractNFT } from '@swarm/types/tokens'
import { TransactionResult } from 'contract-proxy-kit'

import AbstractContract, {
  ContractInstances,
} from '@swarm/core/contracts/AbstractContract'
import { getCurrentConfig } from '@swarm/core/observables/configForNetwork'

import abi from './abi'
import type {
  AssetStruct,
  XGoldBundle as Contract,
} from './typechain/XGoldBundle'

const { xGoldBundleAddress } = getCurrentConfig()

export class XGoldBundleContract extends AbstractContract {
  contract: Contract | undefined

  static instances: ContractInstances<XGoldBundleContract> = {}

  constructor() {
    super(xGoldBundleAddress, abi.XGoldBundle)
  }

  static getInstance = async (): Promise<XGoldBundleContract> => {
    if (!XGoldBundleContract.instances[xGoldBundleAddress]) {
      XGoldBundleContract.instances[xGoldBundleAddress] =
        new XGoldBundleContract()
      await XGoldBundleContract.instances[xGoldBundleAddress].init()
    }
    return XGoldBundleContract.instances[xGoldBundleAddress]
  }

  private depositNewAssets = async (
    goldNfts: AbstractNFT[],
  ): Promise<TransactionResult | undefined> => {
    this.init()
    this.updateSigner()

    const newAssets = goldNfts.map<AssetStruct>((nft) => ({
      assetAddress: nft.address,
      tokenId: nft.tokenId,
      amount: 1,
      assetType: 2,
    }))

    return this.contract?.addNewAssets(newAssets)
  }

  static depositNewAssets = async (
    goldNfts: AbstractNFT[],
  ): Promise<TransactionResult | undefined> => {
    const instance = await XGoldBundleContract.getInstance()

    return instance.depositNewAssets(goldNfts)
  }

  private withdrawAssets = async (
    goldNfts: AbstractNFT[],
  ): Promise<TransactionResult | undefined> => {
    this.init()
    this.updateSigner()

    const assets = goldNfts.map<AssetStruct>((nft) => ({
      assetAddress: nft.address,
      tokenId: nft.tokenId,
      amount: 1,
      assetType: 2,
    }))

    return this.contract?.withdrawAssets(assets)
  }

  static withdrawAssets = async (
    goldNfts: AbstractNFT[],
  ): Promise<TransactionResult | undefined> => {
    const instance = await XGoldBundleContract.getInstance()

    return instance.withdrawAssets(goldNfts)
  }
}
