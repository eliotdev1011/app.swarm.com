import { AbstractToken } from '@swarm/types/tokens'
import { BigSource } from 'big.js'
import { BigNumber, Signer } from 'ethers'

import AbstractContract, {
  ContractInstances,
} from '@core/contracts/AbstractContract'
import { getEstimatedGasLimit } from '@core/services/gas-estimator'
import {
  big,
  denormalize,
  safeDiv,
  ZERO,
} from '@core/shared/utils/helpers/big-helpers'

import abi from './abi'

export class AssetTokenIssuer extends AbstractContract {
  static SWARM_ISSUER_NAME = 'AssetTokenIssuer'

  static instances: ContractInstances<AssetTokenIssuer> = {}

  #ONE?: BigSource

  protected fee?: BigNumber

  constructor(address: string, signer?: Signer) {
    super(address, abi.AssetTokenIssuer, signer)
  }

  static getInstance = async (address: string): Promise<AssetTokenIssuer> => {
    if (!AssetTokenIssuer.instances[address]) {
      AssetTokenIssuer.instances[address] = new AssetTokenIssuer(address)
      await AssetTokenIssuer.instances[address].init()
    }
    return AssetTokenIssuer.instances[address]
  }

  public getOne = async () => {
    if (this.#ONE === undefined) {
      const one: BigNumber = await this.contract?.DECIMALS()
      this.#ONE = one.toString()
    }

    return this.#ONE
  }

  public getFee = async () => {
    if (this.fee === undefined) {
      this.fee = await this.contract?.feeBPS()
    }

    return this.fee
  }

  public calculateAmountToRequestMint = async (
    assetAddress: string,
    amount: BigSource,
  ) => {
    if (big(amount).eq(0)) {
      return big(0)
    }

    const amountTeRequest = await this.contract?.calculateAmountToRequestMint(
      assetAddress,
      big(amount).toFixed(0),
    )

    return safeDiv(amountTeRequest, await this.getOne())
  }

  public mint = async (asset: AbstractToken, amount: BigSource) => {
    this.init()
    this.updateSigner()

    if (this.contract === undefined) {
      throw new Error(
        `AssetTokenIssuer at (${this.address}) Contract is not initialized`,
      )
    }

    const denormalizedAmountFixed = denormalize(amount, asset.decimals).toFixed(
      0,
    )

    const populatedTransaction = await this.contract?.populateTransaction.mint(
      asset.id,
      denormalizedAmountFixed,
      '1',
    )

    const gasLimit = await getEstimatedGasLimit(
      populatedTransaction,
      this.signer,
    )

    return this.contract?.mint(asset.id, denormalizedAmountFixed, '1', {
      gasLimit,
    })
  }

  public getAmountToMint = async (
    paymentTokenAddress: string,
    paymentTokenDecimals: number,
    amount: BigSource,
  ) => {
    if (big(amount).eq(0)) {
      return ZERO
    }

    const amountToPay = denormalize(amount, paymentTokenDecimals)

    const amountToMint = await this?.contract?.getAmountToMint(
      paymentTokenAddress,
      amountToPay.toFixed(0),
    )

    return amountToMint ? safeDiv(amountToMint, await this.getOne()) : null
  }
}
