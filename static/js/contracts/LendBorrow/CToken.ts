import { TransactionResponse } from '@ethersproject/abstract-provider'
import AbstractContract from '@swarm/core/contracts/AbstractContract'
import { big, normalize } from '@swarm/core/shared/utils/helpers/big-helpers'
import Big from 'big.js'
import { ContractInterface, ethers, Signer } from 'ethers'

import { Comptroller } from './Comptroller'
import abi from './abi'
import type {
  CErc20 as CErc20Contract,
  CEther as CNativeTokenContract,
} from './typechain'

export abstract class CToken extends AbstractContract {
  contract: CErc20Contract | CNativeTokenContract | undefined

  private comptrollerContract?: Comptroller

  private name?: string

  private symbol?: string

  private decimals?: number

  constructor(
    address: string,
    tokenAbi: ContractInterface = abi.CToken,
    signer?: Signer,
  ) {
    super(address, tokenAbi, signer)
  }

  public async getName(): Promise<string | undefined> {
    if (this.name !== undefined) {
      await this.name
    }

    try {
      this.init()

      if (this.contract === undefined) {
        return undefined
      }

      const name = await this.contract.name()

      this.name = name

      return name
    } catch {
      return undefined
    }
  }

  public async getSymbol(): Promise<string | undefined> {
    if (this.symbol !== undefined) {
      return this.symbol
    }

    try {
      this.init()

      if (this.contract === undefined) {
        return undefined
      }

      const symbol = await this.contract.symbol()

      this.symbol = symbol

      return symbol
    } catch {
      return undefined
    }
  }

  public async getDecimals(): Promise<number | undefined> {
    if (this.decimals !== undefined) {
      return this.decimals
    }

    try {
      this.init()

      if (this.contract === undefined) {
        return undefined
      }

      const decimals = await this.contract.decimals()

      this.decimals = decimals

      return decimals
    } catch {
      return undefined
    }
  }

  public async getComptrollerContract(): Promise<Comptroller | undefined> {
    if (this.comptrollerContract !== undefined) {
      return this.comptrollerContract
    }

    try {
      this.init()

      if (this.contract === undefined) {
        return undefined
      }

      const comptrollerAddress = await this.contract.comptroller()
      const comptrollerContract = await Comptroller.getInstance(
        comptrollerAddress,
      )

      this.comptrollerContract = comptrollerContract

      return comptrollerContract
    } catch {
      return undefined
    }
  }

  public async normalizedBalanceOf(address?: string): Promise<Big | undefined> {
    try {
      this.init()

      if (this.contract === undefined) {
        return undefined
      }

      if (address === undefined) {
        this.updateSigner()
      }

      const holderAddress =
        address !== undefined
          ? address
          : await this.contract.signer.getAddress()

      const balance = await this.contract.balanceOf(holderAddress)
      const decimals = await this.getDecimals()

      return normalize(balance.toString(), decimals)
    } catch {
      return undefined
    }
  }

  public async getTotalSupply(): Promise<Big | undefined> {
    try {
      this.init()

      if (this.contract === undefined) {
        return undefined
      }

      const total = await this.contract.totalSupply()
      const decimals = await this.getDecimals()

      return normalize(total.toString(), decimals)
    } catch {
      return undefined
    }
  }

  protected async getNonNormalizedCurrentExchangeRate(): Promise<
    Big | undefined
  > {
    try {
      this.init()

      if (this.contract === undefined) {
        return undefined
      }

      this.updateSigner()

      const currentExchangeRate =
        await this.contract.callStatic.exchangeRateCurrent()

      return big(currentExchangeRate.toString())
    } catch {
      return undefined
    }
  }

  public async getSupplyRatePerBlock(): Promise<Big | undefined> {
    try {
      this.init()

      if (this.contract === undefined) {
        return undefined
      }

      const supplyRatePerBlock = await this.contract.supplyRatePerBlock()

      return big(supplyRatePerBlock.toString())
    } catch {
      return undefined
    }
  }

  public async getSupplyAPY(blocksPerDay: number): Promise<Big | undefined> {
    try {
      this.init()

      if (this.contract === undefined) {
        return undefined
      }

      const supplyRatePerBlock = await this.getSupplyRatePerBlock()

      if (supplyRatePerBlock === undefined) {
        return undefined
      }

      const mantissa = big(10).pow(18)
      const daysPerYear = 365

      return big(supplyRatePerBlock.div(mantissa).mul(blocksPerDay).plus(1))
        .pow(daysPerYear)
        .minus(1)
        .mul(100)
    } catch {
      return undefined
    }
  }

  public async getBorrowRatePerBlock(): Promise<Big | undefined> {
    try {
      this.init()

      if (this.contract === undefined) {
        return undefined
      }

      const borrowRatePerBlock = await this.contract.borrowRatePerBlock()

      return big(borrowRatePerBlock.toString())
    } catch {
      return undefined
    }
  }

  public async getBorrowAPY(blocksPerDay: number): Promise<Big | undefined> {
    try {
      this.init()

      if (this.contract === undefined) {
        return undefined
      }

      const borrowRatePerBlock = await this.getBorrowRatePerBlock()

      if (borrowRatePerBlock === undefined) {
        return undefined
      }

      const mantissa = big(10).pow(18)
      const daysPerYear = 365

      return big(borrowRatePerBlock.div(mantissa).mul(blocksPerDay).plus(1))
        .pow(daysPerYear)
        .minus(1)
        .mul(100)
    } catch {
      return undefined
    }
  }

  protected async getNonNormalizedCurrentBorrowedBalance(): Promise<
    Big | undefined
  > {
    try {
      this.init()
      this.updateSigner()

      if (this.contract === undefined || this.signer === undefined) {
        return undefined
      }

      const account = await this.signer.getAddress()

      const currentBorrowedBalance =
        await this.contract.callStatic.borrowBalanceCurrent(account)

      return big(currentBorrowedBalance.toString())
    } catch {
      return undefined
    }
  }

  protected async getNonNormalizedProtocolUnderlyingBalance(): Promise<
    Big | undefined
  > {
    try {
      this.init()

      if (this.contract === undefined) {
        return undefined
      }

      const protocolUnderlyingBalance = await this.contract.getCash()

      return big(protocolUnderlyingBalance.toString())
    } catch {
      return undefined
    }
  }

  public async mint(
    amount: ethers.BigNumber,
  ): Promise<TransactionResponse | undefined> {
    this.init()

    if (this.contract === undefined) {
      return undefined
    }

    this.updateSigner()

    return this.contract.mint(amount)
  }

  public async redeem(
    amount: ethers.BigNumber,
  ): Promise<TransactionResponse | undefined> {
    this.init()

    if (this.contract === undefined) {
      return undefined
    }

    this.updateSigner()

    return this.contract.redeemUnderlying(amount)
  }

  public async borrow(
    amount: ethers.BigNumber,
  ): Promise<TransactionResponse | undefined> {
    this.init()

    if (this.contract === undefined) {
      return undefined
    }

    this.updateSigner()

    return this.contract.borrow(amount)
  }

  public async repayBorrow(
    amount: ethers.BigNumber,
  ): Promise<TransactionResponse | undefined> {
    this.init()

    if (this.contract === undefined) {
      return undefined
    }

    this.updateSigner()

    return this.contract.repayBorrow(amount)
  }
}
