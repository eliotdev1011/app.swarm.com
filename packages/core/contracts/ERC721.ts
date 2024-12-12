import { ContractInterface, Signer } from 'ethers'

import abi from '@core/contracts/abi'
import { invalidateKeys } from '@core/observables/watcher'
import { getAllowanceCacheKey } from '@core/services/cache/utils'

import AbstractContract, { ContractInstances } from './AbstractContract'
import { ERC721 as ERC721Contract } from './typechain/ERC721'

export class Erc721 extends AbstractContract {
  contract: ERC721Contract | undefined

  static instances: ContractInstances<Erc721> = {}

  constructor(
    address: string,
    tokenAbi: ContractInterface = abi.ERC721,
    signer?: Signer,
  ) {
    super(address, tokenAbi, signer)
  }

  static getInstance = async (address: string): Promise<Erc721> => {
    if (!Erc721.instances[address]) {
      Erc721.instances[address] = new Erc721(address)
      await Erc721.instances[address].init()
    }
    return Erc721.instances[address]
  }

  setApprovalForAll = async (spender: string, approved: boolean) => {
    if (this.contract === undefined) {
      throw new Error('Erc721 contract is not initialized')
    }

    const account = await this.signer?.getAddress()
    const resp = await this.contract.setApprovalForAll(spender, approved)

    if (account) {
      invalidateKeys(getAllowanceCacheKey(account, spender, this.address))
    }
    return resp
  }
}
