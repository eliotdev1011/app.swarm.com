import { TransactionResponse } from '@ethersproject/abstract-provider'
import BaseContract, {
  ContractInstances,
} from '@swarm/core/contracts/AbstractContract'
import { normalize } from '@swarm/core/shared/utils/helpers/big-helpers'
import Big from 'big.js'
import { ContractInterface, Signer } from 'ethers'

import { PriceFeedOracle } from './PriceFeedOracle'
import abi from './abi'
import type { Comptroller as ComptrollerContract } from './typechain'

interface MarketInfo {
  isListed: boolean
  collateralFactor: Big
}

export class Comptroller extends BaseContract {
  static instances: ContractInstances<Comptroller> = {}

  contract: ComptrollerContract | undefined

  private priceFeedOracleContract?: PriceFeedOracle

  constructor(
    address: string,
    tokenAbi: ContractInterface = abi.Comptroller,
    signer?: Signer,
  ) {
    super(address, tokenAbi, signer)
  }

  static async getInstance(address: string): Promise<Comptroller> {
    if (Comptroller.instances[address] === undefined) {
      Comptroller.instances[address] = new Comptroller(address)
      await Comptroller.instances[address].init()
    }
    return Comptroller.instances[address]
  }

  public async getPriceFeedOracleContract(): Promise<
    PriceFeedOracle | undefined
  > {
    if (this.priceFeedOracleContract !== undefined) {
      return this.priceFeedOracleContract
    }

    try {
      this.init()

      if (this.contract === undefined) {
        return undefined
      }

      const priceFeedOracleContractAddress = await this.contract.oracle()
      const priceFeedOracleContract = await PriceFeedOracle.getInstance(
        priceFeedOracleContractAddress,
      )

      this.priceFeedOracleContract = priceFeedOracleContract

      return priceFeedOracleContract
    } catch {
      return undefined
    }
  }

  public async getMarketInfo(
    marketAddress: string,
  ): Promise<MarketInfo | undefined> {
    try {
      this.init()

      if (this.contract === undefined) {
        return undefined
      }

      const marketInfo = await this.contract.markets(marketAddress)

      const mantissaDecimals = 18

      return {
        isListed: marketInfo.isListed,
        collateralFactor: normalize(
          marketInfo.collateralFactorMantissa.toString(),
          mantissaDecimals,
        ),
      }
    } catch {
      return undefined
    }
  }

  public async getAllMarkets(): Promise<string[] | undefined> {
    try {
      this.init()

      if (this.contract === undefined) {
        return undefined
      }

      const allMarkets = await this.contract.getAllMarkets()
      return allMarkets
    } catch {
      return undefined
    }
  }

  public async matchHasEnteredMarket(
    marketAddress: string,
  ): Promise<boolean | undefined> {
    try {
      this.init()
      this.updateSigner()

      if (this.contract === undefined || this.signer === undefined) {
        return undefined
      }

      const account = await this.signer.getAddress()

      const hasEnteredMarket = await this.contract.checkMembership(
        account,
        marketAddress,
      )

      return hasEnteredMarket
    } catch {
      return undefined
    }
  }

  public async enterMarket(
    marketAddress: string,
  ): Promise<TransactionResponse | undefined> {
    this.init()

    if (this.contract === undefined) {
      return undefined
    }

    this.updateSigner()

    return this.contract.enterMarkets([marketAddress])
  }
}
