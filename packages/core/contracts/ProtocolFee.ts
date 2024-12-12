import { BigSource } from 'big.js'
import { BigNumber, Signer } from 'ethers'

import AbstractContract, {
  ContractInstances,
} from '@core/contracts/AbstractContract'
import { BPoolAddresses } from '@core/contracts/BPoolAddresses'
import abi from '@core/contracts/abi'
import { big } from '@core/shared/utils/helpers'

export class ProtocolFee extends AbstractContract {
  static instances: ContractInstances<ProtocolFee> = {}

  private static cache: Record<
    'minProtocolFee' | 'protocolFee' | 'ONE',
    BigSource
  > = {
    minProtocolFee: 0,
    ONE: 0,
    protocolFee: 0,
  }

  private constructor(address: string, signer?: Signer) {
    super(address, abi.ProtocolFee, signer)
  }

  static getInstance = async (): Promise<ProtocolFee> => {
    const protocolFeeAddress = await BPoolAddresses.getProtocolFeeAddress()

    if (!ProtocolFee.instances[protocolFeeAddress]) {
      ProtocolFee.instances[protocolFeeAddress] = new ProtocolFee(
        protocolFeeAddress,
      )
      await ProtocolFee.instances[protocolFeeAddress].init()
    }
    return ProtocolFee.instances[protocolFeeAddress]
  }

  static async minProtocolFee(): Promise<BigSource> {
    if (big(ProtocolFee.cache.minProtocolFee).eq(0)) {
      const protocolFee = await ProtocolFee.getInstance()
      const minProtocolFeeValue: BigNumber = await protocolFee.contract?.minProtocolFee()

      ProtocolFee.cache.minProtocolFee = minProtocolFeeValue.toString()
    }

    return ProtocolFee.cache.minProtocolFee
  }

  static async protocolFee(): Promise<BigSource> {
    if (big(ProtocolFee.cache.protocolFee).eq(0)) {
      const protocolFee = await ProtocolFee.getInstance()
      const protocolFeeValue: BigNumber = await protocolFee.contract?.protocolFee()

      ProtocolFee.cache.protocolFee = protocolFeeValue.toString()
    }

    return ProtocolFee.cache.protocolFee
  }

  static async ONE(): Promise<BigSource> {
    if (big(ProtocolFee.cache.ONE).eq(0)) {
      const protocolFee = await ProtocolFee.getInstance()
      const ONEValue: BigNumber = await protocolFee.contract?.ONE()

      ProtocolFee.cache.ONE = ONEValue.toString()
    }

    return ProtocolFee.cache.ONE
  }
}
