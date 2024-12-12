import abi from '@core/contracts/abi'
import { getCurrentConfig } from '@core/observables/configForNetwork'

import AbstractContract, { ContractInstances } from './AbstractContract'

const { bPoolProxyAddress } = getCurrentConfig()

type BPoolAddressesVars =
  | 'registry'
  | 'xTokenWrapper'
  | 'protocolFee'
  | 'utilityToken'
  | 'utilityTokenFeed'

export class BPoolAddresses extends AbstractContract {
  static instances: ContractInstances<BPoolAddresses> = {}

  static xTokenWrapperAddress: string

  static registryAddress: string

  static protocolFeeAddress: string

  static smtPriceFeedAddress: string

  static utilityToken: string

  constructor() {
    super(bPoolProxyAddress, abi.BPoolProxy)
  }

  static getInstance = async (): Promise<BPoolAddresses> => {
    if (!BPoolAddresses.instances[bPoolProxyAddress]) {
      BPoolAddresses.instances[bPoolProxyAddress] = new BPoolAddresses()
      await BPoolAddresses.instances[bPoolProxyAddress].init()
    }
    return BPoolAddresses.instances[bPoolProxyAddress]
  }

  private static getVar = async <T = string>(
    varName: BPoolAddressesVars,
  ): Promise<T> => {
    const bPoolProxy = await BPoolAddresses.getInstance()
    return bPoolProxy?.contract?.[varName]()
  }

  static getRegistryAddress = async () => {
    if (!BPoolAddresses.registryAddress) {
      BPoolAddresses.registryAddress = await BPoolAddresses.getVar('registry')
    }

    return BPoolAddresses.registryAddress
  }

  static getXTokenWrapperAddress = async () => {
    if (!BPoolAddresses.xTokenWrapperAddress) {
      BPoolAddresses.xTokenWrapperAddress = await BPoolAddresses.getVar(
        'xTokenWrapper',
      )
    }

    return BPoolAddresses.xTokenWrapperAddress
  }

  static getProtocolFeeAddress = async () => {
    if (!BPoolAddresses.protocolFeeAddress) {
      BPoolAddresses.protocolFeeAddress = await BPoolAddresses.getVar(
        'protocolFee',
      )
    }

    return BPoolAddresses.protocolFeeAddress
  }

  static getSmtPriceFeedAddress = async () => {
    if (!BPoolAddresses.smtPriceFeedAddress) {
      BPoolAddresses.smtPriceFeedAddress = await BPoolAddresses.getVar(
        'utilityTokenFeed',
      )
    }

    return BPoolAddresses.smtPriceFeedAddress
  }

  static getUtilityTokenAddress = async () => {
    if (!BPoolAddresses.utilityToken) {
      BPoolAddresses.utilityToken = await BPoolAddresses.getVar('utilityToken')
    }

    return BPoolAddresses.utilityToken
  }
}
