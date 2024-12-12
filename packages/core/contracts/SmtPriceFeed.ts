import Big, { BigSource } from 'big.js'
import { BigNumber, Signer } from 'ethers'

import AbstractContract, {
  ContractInstances,
} from '@core/contracts/AbstractContract'
import { BPoolAddresses } from '@core/contracts/BPoolAddresses'
import abi from '@core/contracts/abi'
import { big, normalize, ZERO } from '@core/shared/utils/helpers'

export class SmtPriceFeed extends AbstractContract {
  static instances: ContractInstances<SmtPriceFeed> = {}

  constructor(address: string, signer?: Signer) {
    super(address, abi.SmtPriceFeed, signer)
  }

  static getInstance = async (): Promise<SmtPriceFeed> => {
    const smtPriceFeedAddress = await BPoolAddresses.getSmtPriceFeedAddress()

    if (!SmtPriceFeed.instances[smtPriceFeedAddress]) {
      SmtPriceFeed.instances[smtPriceFeedAddress] = new SmtPriceFeed(
        smtPriceFeedAddress,
      )
      await SmtPriceFeed.instances[smtPriceFeedAddress].init()
    }
    return SmtPriceFeed.instances[smtPriceFeedAddress]
  }

  getDecimals = async () => {
    try {
      this.init()
      const bigDecimals: BigNumber = await this.contract?.decimals()
      return bigDecimals.toNumber()
    } catch {
      return 0
    }
  }

  // gets normalized price of `xTokenAddress` in SMT.
  getPrice = async (xTokenAddress: string): Promise<Big> => {
    try {
      this.init()
      const decimals = await this.getDecimals()
      const price: BigNumber = await this.contract?.getPrice(xTokenAddress)

      return normalize(price.toString(), decimals)
    } catch {
      // There is no price for this address
      return ZERO
    }
  }

  // gets normalized price of `xTokenAddress` in SMT.
  static getPrice = async (xTokenAddress: string): Promise<Big> => {
    try {
      const smtPriceFeed = await SmtPriceFeed.getInstance()
      return await smtPriceFeed.getPrice(xTokenAddress)
    } catch {
      return ZERO
    }
  }

  // Gets how many SMT represents the `amountIn` of `xTokenAddress`.
  // xTokenAddress of asset to get the amount.
  static calculateAmount = async (
    xTokenAddress: string,
    denormAmountIn: BigSource,
  ): Promise<BigSource> => {
    try {
      const smtPriceFeed = await SmtPriceFeed.getInstance()
      const price: BigNumber = await smtPriceFeed?.contract?.calculateAmount(
        xTokenAddress,
        big(denormAmountIn).toFixed(0),
      )

      return price.toString()
    } catch {
      return '0'
    }
  }
}
