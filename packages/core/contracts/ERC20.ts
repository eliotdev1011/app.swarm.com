import { TransactionResponse } from '@ethersproject/abstract-provider'
import Big from 'big.js'
import { BigNumber, ContractInterface, Signer } from 'ethers'
import { constants as EthConstants } from 'ethers/lib/ethers'

import abi from '@core/contracts/abi'
import { invalidateKeys } from '@core/observables/watcher'
import { getAllowanceCacheKey } from '@core/services/cache/utils'
import { getTokenInfo } from '@core/services/token-info'
import { NATIVE_ETH } from '@core/shared/consts/known-tokens'
import { big, normalize, ZERO } from '@core/shared/utils/helpers'

import AbstractContract, { ContractInstances } from './AbstractContract'

const { MaxUint256, Zero } = EthConstants

export class Erc20 extends AbstractContract {
  static instances: ContractInstances<Erc20> = {}

  protected static cachedDecimals: Record<string, number> = {}

  protected name?: string

  protected symbol?: string

  protected decimals?: number | null

  private totalSupply?: Big

  constructor(
    address: string,
    tokenAbi: ContractInterface = abi.ERC20,
    signer?: Signer,
  ) {
    super(address, tokenAbi, signer)
  }

  static getInstance = async (address: string): Promise<Erc20> => {
    if (!Erc20.instances[address]) {
      Erc20.instances[address] = new Erc20(address)
      await Erc20.instances[address].init()
    }
    return Erc20.instances[address]
  }

  public setTokenInfo = async () => {
    try {
      const tokenInfo = await getTokenInfo(this.address)
      this.name = tokenInfo.name
      this.decimals = tokenInfo.decimals
      this.symbol = tokenInfo.symbol
    } catch {
      this.name = ''
      this.decimals = null
      this.symbol = ''
    }
  }

  public async getName(): Promise<string> {
    if (typeof this.name === 'undefined') {
      await this.setTokenInfo()
    }

    return this.name as string
  }

  public async getSymbol(): Promise<string> {
    if (typeof this.symbol === 'undefined') {
      await this.setTokenInfo()
    }

    return this.symbol as string
  }

  public async balanceOf(addr?: string) {
    try {
      this.init()
      if (addr === undefined) {
        this.updateSigner()
      }
      const a = addr || (await this.contract?.signer.getAddress())
      const balance: BigNumber = await this.contract?.balanceOf(a)
      return big(balance.toString())
    } catch {
      return ZERO
    }
  }

  public async normalizedBalanceOf(addr?: string) {
    try {
      this.init()
      if (addr === undefined) {
        this.updateSigner()
      }
      const a = addr || (await this.contract?.signer.getAddress())
      const balance: BigNumber = await this.contract?.balanceOf(a)
      const decimals = await this.getDecimals()
      if (!decimals) return ZERO
      return normalize(balance.toString(), decimals)
    } catch {
      return ZERO
    }
  }

  public async mint(denormAmount?: Big): Promise<TransactionResponse> {
    this.init()
    this.updateSigner()
    return this.contract?.mint(denormAmount?.toFixed(0))
  }

  public getAllowance = async (account?: string, spender?: string) => {
    if (!account || !spender) return ZERO

    try {
      this.init()

      if (this.contract?.address === NATIVE_ETH.address) {
        return big(-1)
      }

      const allowance: BigNumber = await this.contract?.allowance(
        account,
        spender,
      )

      return big(allowance?.toString())
    } catch {
      return ZERO
    }
  }

  async allowance(userAddress?: string, cpkAddress?: string) {
    try {
      const bigAllowance = await this.getAllowance(userAddress, cpkAddress)
      const decimals = await this.getDecimals()
      if (!decimals) return 0
      return normalize(bigAllowance, decimals).toNumber()
    } catch {
      return 0
    }
  }

  public approve(
    cpkAddress: string,
    amount: BigNumber,
  ): Promise<TransactionResponse> {
    this.init()
    this.updateSigner()
    return this.contract?.approve(cpkAddress, amount)
  }

  enableToken = async (cpkAddress: string) => {
    const resp = await this.approve(cpkAddress, MaxUint256)

    const account = await this.signer?.getAddress()

    if (account) {
      invalidateKeys(getAllowanceCacheKey(account, cpkAddress, this.address))
    }

    return resp
  }

  disableToken = async (cpkAddress: string) => {
    const resp = await this.approve(cpkAddress, Zero)

    const account = await this.signer?.getAddress()

    if (account) {
      invalidateKeys(getAllowanceCacheKey(account, cpkAddress, this.address))
    }

    return resp
  }

  static async getDecimals(address: string): Promise<number | null> {
    try {
      const tokenInfo = await getTokenInfo(address)
      return tokenInfo.decimals
    } catch {
      return null
    }
  }

  public async getDecimals(): Promise<number | null> {
    if (typeof this.decimals === 'undefined') {
      await this.setTokenInfo()
    }

    return this.decimals as number | null
  }

  public getTotalSupply = async () => {
    if (this.totalSupply) return this.totalSupply

    try {
      this.init()
      const total: BigNumber = await this.contract?.totalSupply()
      const decimals = await this.getDecimals()
      if (!decimals) return null

      return normalize(total.toString(), decimals)
    } catch {
      return ZERO
    }
  }
}
