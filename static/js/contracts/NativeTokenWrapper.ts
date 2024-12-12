import { TransactionResponse } from '@ethersproject/abstract-provider'
import AbstractContract from '@swarm/core/contracts/AbstractContract'
import { getTransactionGasFeePriceEstimate } from '@swarm/core/web3'
import { ethers, Signer } from 'ethers'

import abi from 'src/contracts/abi'

export class NativeTokenWrapper extends AbstractContract {
  constructor(address: string, signer?: Signer) {
    super(address, abi.NativeTokenWrapper, signer)
  }

  private getDepositTransaction(
    amount: number,
  ): Promise<ethers.PopulatedTransaction> | undefined {
    return this.contract?.populateTransaction.deposit({
      value: ethers.utils.parseEther(String(amount)),
    })
  }

  public async getDepositGasFeePriceEstimate(
    amount: number,
  ): Promise<ethers.BigNumber> {
    this.init()
    this.updateSigner()

    const transaction = await this.getDepositTransaction(amount)

    if (transaction === undefined || this.signer === undefined) {
      return ethers.utils.parseEther('0')
    }

    return getTransactionGasFeePriceEstimate(this.signer, transaction)
  }

  public async deposit(
    amount: number,
  ): Promise<TransactionResponse | undefined> {
    this.init()
    this.updateSigner()

    const transaction = await this.getDepositTransaction(amount)

    if (transaction === undefined) {
      return undefined
    }

    return this.signer?.sendTransaction(transaction)
  }

  public withdraw(amount: number): Promise<TransactionResponse> {
    this.init()
    this.updateSigner()
    return this.contract?.withdraw(ethers.utils.parseEther(String(amount)))
  }
}
