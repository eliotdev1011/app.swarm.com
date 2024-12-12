import { Signer } from 'ethers'

import AbstractContract, {
  ContractInstances,
} from '@core/contracts/AbstractContract'

import { BPoolAddresses } from './BPoolAddresses'
import abi from './abi'

export class XTokenWrapper extends AbstractContract {
  static instances: ContractInstances<XTokenWrapper> = {}

  static mapping: Record<string, string> = {}

  static reverseMapping: Record<string, string> = {}

  constructor(address: string, signer?: Signer) {
    super(address, abi.XTokenWrapper, signer)
  }

  private tokenToXToken = async (tokenAddress: string): Promise<string> => {
    this.init()

    if (!XTokenWrapper.mapping[tokenAddress]) {
      try {
        XTokenWrapper.mapping[tokenAddress] = (
          await this.contract?.tokenToXToken(tokenAddress)
        )?.toLowerCase()

        XTokenWrapper.reverseMapping[
          XTokenWrapper.mapping[tokenAddress]
        ] = tokenAddress
      } catch {
        // do nothing
      }
    }

    return XTokenWrapper.mapping[tokenAddress]
  }

  getTokenFromXToken = async (xTokenAddress: string): Promise<string> => {
    this.init()

    if (!XTokenWrapper.reverseMapping[xTokenAddress]) {
      try {
        XTokenWrapper.reverseMapping[xTokenAddress] = (
          await this.contract?.xTokenToToken(xTokenAddress)
        )?.toLowerCase()

        XTokenWrapper.mapping[
          XTokenWrapper.reverseMapping[xTokenAddress]
        ] = xTokenAddress
      } catch {
        // do nothing
      }
    }

    return XTokenWrapper.reverseMapping[xTokenAddress]
  }

  static getInstance = async (): Promise<XTokenWrapper> => {
    const xTokenWrapperAddress = await BPoolAddresses.getXTokenWrapperAddress()

    if (!XTokenWrapper.instances[xTokenWrapperAddress]) {
      XTokenWrapper.instances[xTokenWrapperAddress] = new XTokenWrapper(
        xTokenWrapperAddress,
      )
      await XTokenWrapper.instances[xTokenWrapperAddress].init()
    }
    return XTokenWrapper.instances[xTokenWrapperAddress]
  }

  static tokenToXToken = async (address: string) => {
    const xTokenWrapper = await XTokenWrapper.getInstance()

    return xTokenWrapper.tokenToXToken(address)
  }

  static xTokenToToken = async (xAddress: string) => {
    const xTokenWrapper = await XTokenWrapper.getInstance()

    return xTokenWrapper.getTokenFromXToken(xAddress)
  }
}
