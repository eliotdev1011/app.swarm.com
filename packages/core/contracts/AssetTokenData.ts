import { bignumber, BigNumber as MathjsBigNumber } from 'mathjs'

import AbstractContract, {
  ContractInstances,
} from '@core/contracts/AbstractContract'
import { SECONDS_PER_YEAR } from '@core/shared/consts'
import { big } from '@core/shared/utils/helpers/big-helpers'
import { unifyAddress } from '@core/web3'

import abi from '../contracts/abi'

/**
 * The interest rate stored in the AssetTokenData contract for particular AssetToken is the net rate,
 * representing the rewards that the user will receive when eventually redeeming the asset.
 * For user we want to display the original APY that includes Swarm commission - 10 %
 */
export const SWARM_STAKING_COMMISSION_PERCENTAGE = 0.1

export class AssetTokenData extends AbstractContract {
  static instances: ContractInstances<AssetTokenData> = {}

  protected decimals?: MathjsBigNumber

  protected interestRates: Map<
    string,
    {
      blockNumber: number
      rate: MathjsBigNumber
    }
  > = new Map()

  private constructor(public address: string) {
    super(address, abi.AssetTokenData)
  }

  static getInstance = async (address: string): Promise<AssetTokenData> => {
    if (!AssetTokenData.instances[address]) {
      AssetTokenData.instances[address] = new AssetTokenData(address)
      await AssetTokenData.instances[address].init()
    }
    return AssetTokenData.instances[address]
  }

  public getDecimals = async () => {
    if (this.decimals === undefined) {
      try {
        this.decimals = bignumber((await this?.contract?.DECIMALS()).toString())
      } catch (e) {
        return bignumber(10 ** 27)
      }
    }

    return this.decimals as MathjsBigNumber
  }

  public getInterestRate = async (
    tokenAddress: string,
  ): Promise<MathjsBigNumber | null> => {
    const unifiedTokenAddress = unifyAddress(tokenAddress)
    if (this?.contract) {
      const currentBlockNumber = await this.contract?.provider.getBlockNumber()

      if (
        !this.interestRates.has(unifiedTokenAddress) ||
        Number(this.interestRates.get(unifiedTokenAddress)?.blockNumber) >
          currentBlockNumber
      ) {
        try {
          const [[rate, sign], blockNumber, decimals] = await Promise.all([
            this.contract?.getInterestRate(unifiedTokenAddress),
            this.contract?.provider.getBlockNumber(),
            this.getDecimals(),
          ])

          this.interestRates.set(unifiedTokenAddress, {
            rate: bignumber(rate.toString())
              .times(sign ? 1 : -1)
              .div(decimals),
            blockNumber,
          })
        } catch (e) {
          return null
        }
      }

      return this.interestRates.get(unifiedTokenAddress)?.rate ?? null
    }

    return null
  }

  // Net APY that user receives
  public getNetApy = async (tokenAddress: string) => {
    const interestRate = await this.getInterestRate(tokenAddress)

    if (interestRate === null) {
      return null
    }

    const netApy = interestRate.add(1).pow(SECONDS_PER_YEAR).sub(1)

    return big(netApy.toString())
  }

  // The actual staking APY that includes Swarm commission
  public getApy = async (tokenAddress: string) => {
    const netApy = await this.getNetApy(tokenAddress)

    if (netApy === null) {
      return null
    }

    return netApy.div(1 - SWARM_STAKING_COMMISSION_PERCENTAGE)
  }
}
