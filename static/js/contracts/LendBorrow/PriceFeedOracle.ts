import BaseContract, {
  ContractInstances,
} from '@swarm/core/contracts/AbstractContract'
import { normalize } from '@swarm/core/shared/utils/helpers/big-helpers'
import Big from 'big.js'
import { ContractInterface, Signer } from 'ethers'

import abi from './abi'
import type { PriceFeedOracle as PriceFeedOracleContract } from './typechain'

export class PriceFeedOracle extends BaseContract {
  static instances: ContractInstances<PriceFeedOracle> = {}

  contract: PriceFeedOracleContract | undefined

  constructor(
    address: string,
    tokenAbi: ContractInterface = abi.PriceFeedOracle,
    signer?: Signer,
  ) {
    super(address, tokenAbi, signer)
  }

  static async getInstance(address: string): Promise<PriceFeedOracle> {
    if (PriceFeedOracle.instances[address] === undefined) {
      PriceFeedOracle.instances[address] = new PriceFeedOracle(address)
      await PriceFeedOracle.instances[address].init()
    }
    return PriceFeedOracle.instances[address]
  }

  public async getMarketDollarsPrice(
    address: string,
    underlyingDecimals: number,
  ): Promise<Big | undefined> {
    try {
      this.init()

      if (this.contract === undefined) {
        return undefined
      }

      const marketPrice = await this.contract.getCTokenPrice(address)
      const mantissaDecimals = 18
      const dollarsDecimals = 18

      return normalize(
        marketPrice.toString(),
        mantissaDecimals - underlyingDecimals + dollarsDecimals,
      )
    } catch (error) {
      return undefined
    }
  }
}
