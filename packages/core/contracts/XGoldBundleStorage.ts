import { BigNumber } from 'ethers'

import AbstractContract, {
  ContractInstances,
} from '@swarm/core/contracts/AbstractContract'
import { getCurrentConfig } from '@swarm/core/observables/configForNetwork'

import abi from './abi'
import type { XGoldBundleStorage as Contract } from './typechain/XGoldBundleStorage'

const { xGoldBundleStorageAddress } = getCurrentConfig()

export interface XGoldInfo {
  xGoldTokensForGoldKg?: BigNumber
  xGoldTokensForGoldOz?: BigNumber
  goldKgAddress?: string
  goldOzAddress?: string
}

export class XGoldBundleStorageContract extends AbstractContract {
  contract: Contract | undefined

  static instances: ContractInstances<XGoldBundleStorageContract> = {}

  constructor() {
    super(xGoldBundleStorageAddress, abi.XGoldBundleStorage)
  }

  static getInstance = async (): Promise<XGoldBundleStorageContract> => {
    if (!XGoldBundleStorageContract.instances[xGoldBundleStorageAddress]) {
      XGoldBundleStorageContract.instances[xGoldBundleStorageAddress] =
        new XGoldBundleStorageContract()
      await XGoldBundleStorageContract.instances[
        xGoldBundleStorageAddress
      ].init()
    }
    return XGoldBundleStorageContract.instances[xGoldBundleStorageAddress]
  }

  static getGoldBundleInfo = async (): Promise<XGoldInfo | undefined> => {
    try {
      const { contract } = await XGoldBundleStorageContract.getInstance()

      const xGoldTokensForGoldKg = await contract?.ONE_GOLD_KILO_IN_OUNCES()
      const xGoldTokensForGoldOz = await contract?.ONE_GOLD_OUNCE()
      const goldKgAddress = await contract?.xGoldKiloAddresses()
      const goldOzAddress = await contract?.xGoldOunceAddresses()

      return {
        xGoldTokensForGoldKg,
        xGoldTokensForGoldOz,
        goldKgAddress: goldKgAddress?.[0],
        goldOzAddress: goldOzAddress?.[0],
      }
    } catch (e) {
      return undefined
    }
  }
}
