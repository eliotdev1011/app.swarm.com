import { ProxyToken } from '@swarm/types/tokens'
import Big from 'big.js'
import CPKConstructor, {
  CPKConfig,
  EthersAdapter,
  ExecOptions,
  Transaction,
  TransactionResult,
} from 'contract-proxy-kit'
import { Address } from 'contract-proxy-kit/src/utils/basicTypes'
import { ethers, providers, utils } from 'ethers'
import { BehaviorSubject } from 'rxjs'

import useObservable from '@core/hooks/rxjs/useObservable'
import { getCPKEstimatedGasLimit } from '@core/services/gas-estimator'
import { verify } from '@core/shared/utils/crypto'
import { denormalize } from '@core/shared/utils/helpers'
import { account$, getSigner, walletProvider$ } from '@core/web3'

import { BPoolAddresses } from './BPoolAddresses'
import abi from './abi'

const deterministicAddresses = {
  masterCopyAddressVersions: [
    {
      version: '1.2.0',
      address: '0x6851D6fDFAfD08c0295C392436245E5bc78B0185',
    },
    {
      version: '1.1.1',
      address: '0x34CfAC646f301356fAa8B21e94227e3583Fe3F5F',
    },
  ],
  multiSendAddress: '0x8D29bE29923b68abfDD21e541b9374737B49cdAD',
  fallbackHandlerAddress: '0xd5D82B6aDDc9027B22dCA772Aa68D5d74cdBdF44',
}

const Erc20Interface = new utils.Interface(abi.ERC20)
const XTokenInterface = new utils.Interface(abi.XToken)
const XTokenWrapperInterface = new utils.Interface(abi.XTokenWrapper)

export class CPK extends CPKConstructor {
  private txs: Transaction[] = []

  private wrapperAddress = ''

  static async create(opts?: CPKConfig): Promise<CPK> {
    const cpk = new CPK(opts)
    if (opts) {
      await cpk.init()
    }

    cpk.txs = []

    return cpk
  }

  async setXTokenWrapperAddress() {
    if (!this.wrapperAddress) {
      const xTokenWrapperAddress =
        await BPoolAddresses.getXTokenWrapperAddress()
      verify(!!xTokenWrapperAddress, 'XTokenWrapper address is missing')
      this.wrapperAddress = xTokenWrapperAddress
    }
  }

  get xTokenWrapperAddress() {
    verify(!!this.wrapperAddress, 'XTokenWrapper address is missing')
    return this.wrapperAddress
  }

  patchTxs = (incomeTx: Transaction) => {
    this.txs = this.txs.concat(incomeTx)
  }

  execStoredTxs = async (
    slice?: { start?: number; end?: number },
    options?: ExecOptions,
  ): Promise<TransactionResult> => {
    const gasLimit = await getCPKEstimatedGasLimit(this, this.txs)
    return super.execTransactions(this.txs.slice(slice?.start, slice?.end), {
      ...options,
      gasLimit,
    })
  }

  transferToken = (receiver: string, tokenAddress: string, amount: Big) => {
    const tx = {
      to: tokenAddress,
      data: Erc20Interface.encodeFunctionData('transfer', [
        receiver,
        amount.toFixed(0),
      ]),
    }

    this.patchTxs(tx)
  }

  transferTokenFrom = (
    userAddress: string,
    tokenAddress: string,
    amount: Big,
  ) => {
    const tx = {
      to: tokenAddress,
      data: Erc20Interface.encodeFunctionData('transferFrom', [
        userAddress,
        this.address,
        amount.toFixed(0),
      ]),
    }

    this.patchTxs(tx)
  }

  approveCpkTokenFor = (
    tokenAddress: string,
    tokenInterface: 'erc20' | 'xToken',
    spender: string,
    amount: Big,
  ) => {
    const abiInterface =
      tokenInterface === 'erc20' ? Erc20Interface : XTokenInterface

    const tx = {
      to: tokenAddress,
      data: abiInterface.encodeFunctionData('approve', [
        spender,
        amount.toFixed(0),
      ]),
    }

    this.patchTxs(tx)
  }

  wrapToken = (tokenAddress: string, amount: Big) => {
    const tx = {
      to: this.wrapperAddress,
      data: XTokenWrapperInterface.encodeFunctionData('wrap', [
        tokenAddress,
        amount.toFixed(0),
      ]),
    }

    this.patchTxs(tx)
  }

  unwrapXToken = (xTokenAddress: string, amount: Big) => {
    const tx = {
      to: this.wrapperAddress,
      data: XTokenWrapperInterface.encodeFunctionData('unwrap', [
        xTokenAddress,
        amount.toFixed(0),
      ]),
    }

    this.patchTxs(tx)
  }

  claimAll = async (receiver: string, tokens: ProxyToken[]) => {
    await this.setXTokenWrapperAddress()

    tokens.forEach((token) => {
      const cpkBalance = denormalize(token.cpkTokenBalance ?? 0, token.decimals)
      const balance = denormalize(token.cpkXTokenBalance ?? 0, token.decimals)

      if (cpkBalance?.gt(0)) {
        this.transferToken(receiver, token.id, cpkBalance)
      }

      if (token.xToken && balance?.gt(0)) {
        this.approveCpkTokenFor(
          token.xToken.id,
          'erc20',
          this.wrapperAddress,
          balance,
        )
        this.unwrapXToken(token.xToken.id, balance)
        this.transferToken(receiver, token.id, balance)
      }
    })

    return this.execStoredTxs()
  }

  async calculateProxyAddress(ownerAccount: Address): Promise<Address> {
    if (!this.ethLibAdapter || !this.contractManager) {
      throw new Error('CPK unable to calculate proxy address')
    }

    const salt = this.ethLibAdapter.keccak256(
      this.ethLibAdapter.abiEncode(
        ['address', 'uint256'],
        [ownerAccount, this.saltNonce],
      ),
    )

    const initCode = this.ethLibAdapter.abiEncodePacked(
      {
        type: 'bytes',
        value: await this.contractManager.proxyFactory.call(
          'proxyCreationCode',
          [],
        ),
      },
      {
        type: 'bytes',
        value: this.ethLibAdapter.abiEncode(
          ['address'],
          [deterministicAddresses.masterCopyAddressVersions[0].address],
        ),
      },
    )
    const proxyAddress = this.ethLibAdapter.calcCreate2Address(
      this.contractManager.proxyFactory.address,
      salt,
      initCode,
    )
    return proxyAddress
  }

  resetStoredTxs = () => {
    this.txs = []
  }

  get storedTxs() {
    return this.txs
  }
}

export const createCpk = async (provider?: providers.Web3Provider) => {
  const signer = getSigner(provider)

  if (signer) {
    try {
      return await CPK.create({
        ethLibAdapter: new EthersAdapter({
          ethers,
          signer,
        }),
        networks: {
          137: {
            ...deterministicAddresses,
            proxyFactoryAddress: '0x1B5CFC0C4Ce241C9F7De29Ed60fEeA1a614A3457',
          },
        },
      })
    } catch {
      return null
    }
  }

  return null
}

/**
 * undefined means that no wallet is connected
 * null means the cpk is being loaded
 */
type CpkValue = CPK | null | undefined

export const cpk$ = new BehaviorSubject<CPK | null | undefined>(undefined)

walletProvider$.subscribe((provider) => {
  if (provider instanceof providers.Web3Provider) {
    cpk$.next(null)
    createCpk(provider).then((cpk) => cpk$.next(cpk))
  }
})

account$.subscribe((account) => {
  // If account is not empty set to null (cpk is loading)
  if (account) {
    cpk$.next(null)
    createCpk().then((cpk) => cpk$.next(cpk))
    // If account is empty set to undefined (no cpk)
  } else {
    cpk$.next(undefined)
  }
})

export const useCpk = (): CpkValue => useObservable(cpk$, null)

export const getCpk = () => {
  const cpk = cpk$.getValue()

  if (cpk === undefined) {
    throw new Error('No connected wallet to use its CPK')
  }

  if (cpk === null) {
    throw new Error('CPK is loading')
  }

  cpk.resetStoredTxs()

  return cpk
}
