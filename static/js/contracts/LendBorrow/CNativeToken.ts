import { ContractInstances } from '@swarm/core/contracts/AbstractContract'
import { normalize } from '@swarm/core/shared/utils/helpers/big-helpers'
import Big from 'big.js'
import { ContractInterface, Signer } from 'ethers'

import { CToken } from './CToken'
import abi from './abi'
import type { CEther as CNativeTokenContract } from './typechain'

export class CNativeToken extends CToken {
  static instances: ContractInstances<CNativeToken> = {}

  contract: CNativeTokenContract | undefined

  constructor(
    address: string,
    tokenAbi: ContractInterface = abi.CNativeToken,
    signer?: Signer,
  ) {
    super(address, tokenAbi, signer)
  }

  static async getInstance(address: string): Promise<CNativeToken> {
    if (CNativeToken.instances[address] === undefined) {
      CNativeToken.instances[address] = new CNativeToken(address)
      await CNativeToken.instances[address].init()
    }
    return CNativeToken.instances[address]
  }

  public async getCurrentExchangeRate(
    underlyingDecimals: number,
  ): Promise<Big | undefined> {
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

      return normalize(
        nonNormalizedCurrentExchangeRate.toString(),
        mantissaDecimals - decimals + underlyingDecimals,
      )
    } catch {
      return undefined
    }
  }

  public async getCurrentBorrowedBalance(
    underlyingDecimals: number,
  ): Promise<Big | undefined> {
    try {
      const nonNormalizedCurrentBorrowedBalance =
        await this.getNonNormalizedCurrentBorrowedBalance()
      if (nonNormalizedCurrentBorrowedBalance === undefined) {
        return undefined
      }

      return normalize(
        nonNormalizedCurrentBorrowedBalance.toString(),
        underlyingDecimals,
      )
    } catch {
      return undefined
    }
  }

  public async getProtocolUnderlyingBalance(
    underlyingDecimals: number,
  ): Promise<Big | undefined> {
    try {
      const nonNormalizedProtocolUnderlyingBalance =
        await this.getNonNormalizedProtocolUnderlyingBalance()
      if (nonNormalizedProtocolUnderlyingBalance === undefined) {
        return undefined
      }

      return normalize(
        nonNormalizedProtocolUnderlyingBalance.toString(),
        underlyingDecimals,
      )
    } catch {
      return undefined
    }
  }
}
