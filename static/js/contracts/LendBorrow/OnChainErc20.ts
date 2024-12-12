import { ContractInstances } from '@swarm/core/contracts/AbstractContract'
import { Erc20 } from '@swarm/core/contracts/ERC20'
import { normalize, ZERO } from '@swarm/core/shared/utils/helpers/big-helpers'
import Big from 'big.js'
import { BigNumber } from 'ethers'

import { ERC20 as Erc20Contract } from './typechain'

export class OnChainErc20 extends Erc20 {
  static instances: ContractInstances<OnChainErc20> = {}

  contract: Erc20Contract | undefined

  static getInstance = async (address: string): Promise<OnChainErc20> => {
    if (!OnChainErc20.instances[address]) {
      OnChainErc20.instances[address] = new OnChainErc20(address)
      await OnChainErc20.instances[address].init()
    }
    return OnChainErc20.instances[address]
  }

  public async getName(): Promise<string> {
    if (this.name !== undefined) {
      return this.name
    }

    try {
      this.init()

      if (this.contract === undefined) {
        return ''
      }

      const name = await this.contract.name()

      this.name = name

      return name
    } catch {
      return ''
    }
  }

  public async getSymbol(): Promise<string> {
    if (this.symbol !== undefined) {
      return this.symbol
    }

    try {
      this.init()

      if (this.contract === undefined) {
        return ''
      }

      const symbol = await this.contract.symbol()

      this.symbol = symbol

      return symbol
    } catch {
      return ''
    }
  }

  public async getDecimals(): Promise<number | null> {
    if (this.decimals !== undefined) {
      return this.decimals
    }

    try {
      this.init()

      if (this.contract === undefined) {
        return 0
      }

      // The typechain type is not correct because it's using some other version of ethers
      const decimals = (await this.contract.decimals()) as unknown as BigNumber

      this.decimals = decimals.toNumber()

      return decimals.toNumber()
    } catch {
      return 0
    }
  }

  public async normalizedBalanceOf(address?: string): Promise<Big> {
    try {
      this.init()

      if (this.contract === undefined) {
        return ZERO
      }

      if (address === undefined) {
        this.updateSigner()
      }

      const holderAddress =
        address !== undefined
          ? address
          : await this.contract.signer.getAddress()

      const balance = await this.contract.balanceOf(holderAddress)
      const decimals = await this.getDecimals()
      if (!decimals) return ZERO

      return normalize(balance.toString(), decimals)
    } catch (error) {
      return ZERO
    }
  }
}
