import AbstractContract, {
  ContractInstances,
} from '@swarm/core/contracts/AbstractContract'
import { XTokenWrapper } from '@swarm/core/contracts/XTokenWrapper'
import { getCpk } from '@swarm/core/contracts/cpk'
import { Transaction, TransactionResult } from 'contract-proxy-kit'
import { ethers, Signer } from 'ethers'

import abi from './abi'
import type { CRPool as CRPoolContract } from './typechain'

export class CRPool extends AbstractContract {
  static instances: ContractInstances<CRPool> = {}

  contract: CRPoolContract | undefined

  constructor(address: string, signer?: Signer) {
    super(address, abi.CRPool, signer)
  }

  static async getInstance(address: string): Promise<CRPool> {
    if (CRPool.instances[address] === undefined) {
      CRPool.instances[address] = new CRPool(address)
      await CRPool.instances[address].init()
    }
    return CRPool.instances[address]
  }

  public async updateSwapFee(
    swapFee: ethers.BigNumber,
  ): Promise<TransactionResult | undefined> {
    this.init()

    if (this.contract === undefined) {
      return undefined
    }

    this.updateSigner()

    const cpk = await getCpk()
    if (cpk === null || cpk === undefined) {
      return undefined
    }

    const setSwapFeeTransaction =
      await this.contract.populateTransaction.setSwapFee(swapFee)

    cpk.patchTxs(setSwapFeeTransaction as Transaction)

    return cpk.execStoredTxs()
  }

  public async updateLiquidityCap(
    liquidityCap: ethers.BigNumber,
  ): Promise<TransactionResult | undefined> {
    this.init()

    if (this.contract === undefined) {
      return undefined
    }

    this.updateSigner()

    const cpk = await getCpk()
    if (cpk === null || cpk === undefined) {
      return undefined
    }

    const setCapTransaction = await this.contract.populateTransaction.setCap(
      liquidityCap,
    )

    cpk.patchTxs(setCapTransaction as Transaction)

    return cpk.execStoredTxs()
  }

  public async updatePublicSwap(
    publicSwap: boolean,
  ): Promise<TransactionResult | undefined> {
    this.init()

    if (this.contract === undefined) {
      return undefined
    }

    this.updateSigner()

    const cpk = await getCpk()
    if (cpk === null || cpk === undefined) {
      return undefined
    }

    const setCapTransaction =
      await this.contract.populateTransaction.setPublicSwap(publicSwap)

    cpk.patchTxs(setCapTransaction as Transaction)

    return cpk.execStoredTxs()
  }

  public async commitToken(
    tokenAddress: string,
    initialSupply: ethers.BigNumber,
    weight: ethers.BigNumber,
  ): Promise<TransactionResult | undefined> {
    this.init()

    if (this.contract === undefined) {
      return undefined
    }

    this.updateSigner()

    const cpk = await getCpk()
    if (cpk === null || cpk === undefined) {
      return undefined
    }

    const xTokenAddress = await XTokenWrapper.tokenToXToken(tokenAddress)

    const commitAddTokenTransaction =
      await this.contract.populateTransaction.commitAddToken(
        xTokenAddress,
        initialSupply,
        weight,
      )

    cpk.patchTxs(commitAddTokenTransaction as Transaction)

    return cpk.execStoredTxs()
  }

  public async updateWeightsGradually(
    weights: ethers.BigNumber[],
    startBlock: number,
    endBlock: number,
  ): Promise<TransactionResult | undefined> {
    this.init()

    if (this.contract === undefined) {
      return undefined
    }

    this.updateSigner()

    const cpk = await getCpk()
    if (cpk === null || cpk === undefined) {
      return undefined
    }

    const updateWeightsGraduallyTransaction =
      await this.contract.populateTransaction.updateWeightsGradually(
        weights,
        startBlock,
        endBlock,
      )

    cpk.patchTxs(updateWeightsGraduallyTransaction as Transaction)

    return cpk.execStoredTxs()
  }

  public async pokeWeights(): Promise<TransactionResult | undefined> {
    this.init()

    if (this.contract === undefined) {
      return undefined
    }

    this.updateSigner()

    const cpk = await getCpk()
    if (cpk === null || cpk === undefined) {
      return undefined
    }

    // 1. The CPK calls `pokeWeights` on the CRPool contract
    const pokeWeightsTransaction =
      await this.contract.populateTransaction.pokeWeights()
    cpk.patchTxs(pokeWeightsTransaction as Transaction)

    return cpk.execStoredTxs()
  }

  public async addToWhitelist(
    address: string,
  ): Promise<TransactionResult | undefined> {
    this.init()

    if (this.contract === undefined) {
      return undefined
    }

    this.updateSigner()

    const cpk = await getCpk()
    if (cpk === null || cpk === undefined) {
      return undefined
    }

    const whitelistLiquidityProviderTransaction =
      await this.contract.populateTransaction.whitelistLiquidityProvider(
        address,
      )

    cpk.patchTxs(whitelistLiquidityProviderTransaction as Transaction)

    return cpk.execStoredTxs()
  }

  public async removeFromWhitelist(
    address: string,
  ): Promise<TransactionResult | undefined> {
    this.init()

    if (this.contract === undefined) {
      return undefined
    }

    this.updateSigner()

    const cpk = await getCpk()
    if (cpk === null || cpk === undefined) {
      return undefined
    }

    const removeWhitelistedLiquidityProviderTransaction =
      await this.contract.populateTransaction.removeWhitelistedLiquidityProvider(
        address,
      )

    cpk.patchTxs(removeWhitelistedLiquidityProviderTransaction as Transaction)

    return cpk.execStoredTxs()
  }
}
