import { BigSource } from 'big.js'
import { ContractInterface, providers, Signer } from 'ethers'

import { ContractInstances } from '@core/contracts/AbstractContract'
import { Erc20 } from '@core/contracts/ERC20'
import { getEstimatedGasLimit } from '@core/services/gas-estimator'
import { big, normalize } from '@core/shared/utils/helpers/big-helpers'

import abi from './abi'

export class AssetToken extends Erc20 {
  static instances: ContractInstances<AssetToken> = {}

  constructor(
    address: string,
    tokenAbi: ContractInterface = abi.AssetToken,
    signer?: Signer,
  ) {
    super(address, tokenAbi, signer)
  }

  static getInstance = async (address: string): Promise<AssetToken> => {
    if (!AssetToken.instances[address]) {
      AssetToken.instances[address] = new AssetToken(address)
      await AssetToken.instances[address].init()
    }
    return AssetToken.instances[address]
  }

  public getKya = async (): Promise<string | undefined> => {
    try {
      this.init()
      const kya = await this.contract?.kya()

      return kya
    } catch (e) {
      return undefined
    }
  }

  public requestRedeem = async (
    amount: BigSource,
    destination: string,
  ): Promise<providers.TransactionResponse> => {
    this.init()
    this.updateSigner()

    if (this.contract === undefined) {
      throw new Error(`AssetToken Contract is not initialized`)
    }

    const populatedTransaction =
      await this.contract?.populateTransaction.requestRedemption(
        big(amount).toFixed(0),
        destination,
      )

    const gasLimit = await getEstimatedGasLimit(
      populatedTransaction,
      this.signer,
    )

    return this.contract?.requestRedemption(
      big(amount).toFixed(0),
      destination,
      { gasLimit },
    )
  }

  public static parseMintTransactionAmountMinted(
    receipt: providers.TransactionReceipt,
    decimals: number,
  ) {
    try {
      const logs = AssetToken.parseLogs(abi.AssetToken, receipt.logs, [
        'MintApproved',
      ])

      const rawAmount = logs?.[0]?.args[2]

      return rawAmount ? normalize(rawAmount, decimals) : null
    } catch (e) {
      return null
    }
  }
}
