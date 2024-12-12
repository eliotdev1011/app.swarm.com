import { TransactionResponse } from '@ethersproject/abstract-provider'
import Big from 'big.js'
import { TransactionResult } from 'contract-proxy-kit'
import { BigNumber, utils } from 'ethers'
import { isAddress } from 'ethers/lib/utils'

import abi from '@core/contracts/abi'
import { getCpk } from '@core/contracts/cpk'
import { getCurrentConfig } from '@core/observables/configForNetwork'
import { getEstimatedGasLimit } from '@core/services/gas-estimator'
import { DEFAULT_DECIMALS } from '@core/shared/consts'
import { verify } from '@core/shared/utils/crypto'
import { big, denormalize, normalize, ZERO } from '@core/shared/utils/helpers'

import AbstractContract, { ContractInstances } from './AbstractContract'
import { BPoolAddresses } from './BPoolAddresses'
import { Erc20 } from './ERC20'
import type { SmtDistributor as SmtDistributorContractType } from './typechain/SmtDistributor'

const { smtDistributorAddress } = getCurrentConfig()
const SmtDistributorInterface = new utils.Interface(abi.SmtDistributor)

export class SmtDistributor extends AbstractContract {
  contract: SmtDistributorContractType | undefined

  static instances: ContractInstances<SmtDistributor> = {}

  constructor() {
    super(smtDistributorAddress, abi.SmtDistributor)
  }

  static getInstance = async (): Promise<SmtDistributor> => {
    if (!SmtDistributor.instances[smtDistributorAddress]) {
      SmtDistributor.instances[smtDistributorAddress] = new SmtDistributor()
      await SmtDistributor.instances[smtDistributorAddress].init()
    }
    return SmtDistributor.instances[smtDistributorAddress]
  }

  private getToken = async () => {
    this.init()

    if (this.contract === undefined) {
      throw new Error('SmtDistributor contract is not initialized')
    }

    try {
      const tokenAddress: string = await this.contract.token()
      return tokenAddress
    } catch {
      return ''
    }
  }

  private getClaimableAmount = async (userAddress?: string): Promise<Big> => {
    if (!userAddress || !isAddress(userAddress)) return ZERO
    this.init()

    if (this.contract === undefined) {
      throw new Error('SmtDistributor contract is not initialized')
    }

    try {
      const amount: BigNumber = await this.contract.beneficiaries(userAddress)

      const tokenAddress = await this.getToken()
      const decimals = await Erc20.getDecimals(tokenAddress)

      return normalize(big(amount.toString()), decimals || DEFAULT_DECIMALS)
    } catch {
      return ZERO
    }
  }

  private claim = async (
    userAddress: string,
  ): Promise<TransactionResponse | TransactionResult | undefined> => {
    try {
      this.init()
      this.updateSigner()

      // Verify the CPK is defined
      const cpk = getCpk()
      verify(!!cpk, 'Could not obtain CPK')

      if (this.contract === undefined) {
        throw new Error('SmtDistributor contract is not initialized')
      }

      const availableAmount = await this.getClaimableAmount(userAddress)
      const availableCpkAmount = await this.getClaimableAmount(cpk.address)

      if (availableCpkAmount.gt(0)) {
        const smtId = await BPoolAddresses.getUtilityTokenAddress()
        const decimals = await Erc20.getDecimals(smtId)

        cpk?.patchTxs({
          to: smtDistributorAddress,
          data: SmtDistributorInterface.encodeFunctionData('claim'),
        })

        cpk.transferToken(
          userAddress,
          smtId,
          denormalize(availableCpkAmount, decimals || DEFAULT_DECIMALS),
        )

        return await cpk.execStoredTxs()
      }

      if (availableAmount.gt(0)) {
        this.updateSigner()

        const populatedTransaction =
          await this.contract?.populateTransaction.claim()

        const gasLimit = await getEstimatedGasLimit(
          populatedTransaction,
          this.signer,
        )
        return await this.contract?.claim({ gasLimit })
      }
      return undefined
    } catch {
      return undefined
    }
  }

  static getClaimableAmount = async (userAddress?: string) => {
    const smtDistributor = await SmtDistributor.getInstance()
    return smtDistributor.getClaimableAmount(userAddress)
  }

  static claimRewards = async (userAddress: string) => {
    const smtDistributor = await SmtDistributor.getInstance()

    return smtDistributor.claim(userAddress)
  }
}
