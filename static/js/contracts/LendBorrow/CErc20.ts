import { TransactionResponse } from '@ethersproject/abstract-provider'
import { ContractInstances } from '@swarm/core/contracts/AbstractContract'
import { Erc20 } from '@swarm/core/contracts/ERC20'
import { normalize } from '@swarm/core/shared/utils/helpers/big-helpers'
import Big from 'big.js'
import { ContractInterface, ethers, Signer } from 'ethers'

import { CToken } from './CToken'
import { OnChainErc20 } from './OnChainErc20'
import abi from './abi'
import type { CErc20 as CErc20Contract } from './typechain'

export class CErc20 extends CToken {
  static instances: ContractInstances<CErc20> = {}

  contract: CErc20Contract | undefined

  private underlyingAssetContract?: OnChainErc20

  constructor(
    address: string,
    tokenAbi: ContractInterface = abi.CErc20,
    signer?: Signer,
  ) {
    super(address, tokenAbi, signer)
  }

  static async getInstance(address: string): Promise<CErc20> {
    if (CErc20.instances[address] === undefined) {
      CErc20.instances[address] = new CErc20(address)
      await CErc20.instances[address].init()
    }
    return CErc20.instances[address]
  }

  public async getUnderlyingAssetContract(): Promise<Erc20 | undefined> {
    if (this.underlyingAssetContract !== undefined) {
      return this.underlyingAssetContract
    }

    try {
      this.init()

      if (this.contract === undefined) {
        return undefined
      }

      const underlyingAssetAddress = await this.contract.underlying()
      const underlyingAssetContract = await OnChainErc20.getInstance(
        underlyingAssetAddress,
      )

      this.underlyingAssetContract = underlyingAssetContract

      return underlyingAssetContract
    } catch {
      return undefined
    }
  }

  public async getAllowance(spenderAddress: string): Promise<Big | undefined> {
    try {
      this.init()
      this.updateSigner()

      if (this.contract === undefined || this.signer === undefined) {
        return undefined
      }

      const account = await this.signer.getAddress()
      const allowance = await this.contract.allowance(account, spenderAddress)
      const decimals = await this.getDecimals()

      return normalize(allowance.toString(), decimals)
    } catch {
      return undefined
    }
  }

  public async getCurrentExchangeRate(): Promise<Big | undefined> {
    try {
      const nonNormalizedCurrentExchangeRate =
        await this.getNonNormalizedCurrentExchangeRate()
      if (nonNormalizedCurrentExchangeRate === undefined) {
        return undefined
      }

      const mantissaDecimals = 18

      const decimals = await this.getDecimals()
      if (decimals === undefined) {
        return undefined
      }

      const underlyingAssetContract = await this.getUnderlyingAssetContract()
      if (underlyingAssetContract === undefined) {
        return undefined
      }

      const underlyingDecimals = await underlyingAssetContract.getDecimals()
      if (!underlyingDecimals) return undefined

      return normalize(
        nonNormalizedCurrentExchangeRate.toString(),
        mantissaDecimals - decimals + underlyingDecimals,
      )
    } catch {
      return undefined
    }
  }

  public async getCurrentBorrowedBalance(): Promise<Big | undefined> {
    try {
      const nonNormalizedCurrentBorrowedBalance =
        await this.getNonNormalizedCurrentBorrowedBalance()
      if (nonNormalizedCurrentBorrowedBalance === undefined) {
        return undefined
      }

      const underlyingAssetContract = await this.getUnderlyingAssetContract()
      if (underlyingAssetContract === undefined) {
        return undefined
      }

      const underlyingDecimals = await underlyingAssetContract.getDecimals()
      if (!underlyingDecimals) return undefined

      return normalize(
        nonNormalizedCurrentBorrowedBalance.toString(),
        underlyingDecimals,
      )
    } catch {
      return undefined
    }
  }

  public async getProtocolUnderlyingBalance(): Promise<Big | undefined> {
    try {
      const nonNormalizedProtocolUnderlyingBalance =
        await this.getNonNormalizedProtocolUnderlyingBalance()
      if (nonNormalizedProtocolUnderlyingBalance === undefined) {
        return undefined
      }

      const underlyingAssetContract = await this.getUnderlyingAssetContract()
      if (underlyingAssetContract === undefined) {
        return undefined
      }

      const underlyingDecimals = await underlyingAssetContract.getDecimals()
      if (!underlyingDecimals) return undefined

      return normalize(
        nonNormalizedProtocolUnderlyingBalance.toString(),
        underlyingDecimals,
      )
    } catch {
      return undefined
    }
  }

  public async approve(
    spenderAddress: string,
    amount: ethers.BigNumber,
  ): Promise<TransactionResponse | undefined> {
    this.init()

    if (this.contract === undefined) {
      return undefined
    }

    this.updateSigner()

    return this.contract.approve(spenderAddress, amount)
  }
}
