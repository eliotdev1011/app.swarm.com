import { TransactionResponse } from '@ethersproject/abstract-provider'
import { BigNumber, Signer } from 'ethers'
import { isAddress } from 'ethers/lib/utils'

import { ContractInstances } from '@core/contracts/AbstractContract'
import { Erc20 } from '@core/contracts/ERC20'
import abi from '@core/contracts/abi'
import { getCurrentConfig } from '@core/observables/configForNetwork'
import { DEFAULT_DECIMALS } from '@core/shared/consts'
import { denormalize, normalize } from '@core/shared/utils/helpers'

const { vSmtAddress } = getCurrentConfig()

export class VSMT extends Erc20 {
  static instances: ContractInstances<VSMT> = {}

  constructor(address: string, signer?: Signer) {
    super(address, abi.VSMTToken, signer)
  }

  static getVSMTInstance = async (): Promise<VSMT | undefined> => {
    if (!vSmtAddress) return undefined

    if (!VSMT.instances[vSmtAddress]) {
      VSMT.instances[vSmtAddress] = new VSMT(vSmtAddress)
      await VSMT.instances[vSmtAddress].init()
    }
    return VSMT.instances[vSmtAddress]
  }

  public async getClaimableAmount(address: string) {
    if (!isAddress(address)) return 0

    try {
      this.init()
      const dec = await Erc20.getDecimals(this.address)
      const amount: BigNumber = await this.contract?.getClaimableAmount(address)

      return normalize(amount.toString(), dec || DEFAULT_DECIMALS).toNumber()
    } catch {
      return 0
    }
  }

  public async claim(amount: number) {
    this.init()
    const dec = await Erc20.getDecimals(this.address)
    const denormAmount = denormalize(amount, dec || DEFAULT_DECIMALS)

    this.updateSigner()
    return this.contract?.claim(denormAmount.toString())
  }

  public async claimMaximumAmount(
    address: string,
  ): Promise<TransactionResponse | false> {
    try {
      this.init()
      const availableAmount = await this.getClaimableAmount(address)

      if (availableAmount > 0) {
        this.updateSigner()
        return this.contract?.claimMaximunAmount()
      }

      return false
    } catch {
      return false
    }
  }

  static getClaimableAmount = async (address: string): Promise<number> => {
    const vSmt = await VSMT?.getVSMTInstance()

    return vSmt?.getClaimableAmount(address) || 0
  }

  static claimMaximumAmount = async (address: string) => {
    const vSmt = await VSMT.getVSMTInstance()

    return vSmt?.claimMaximumAmount(address)
  }
}
