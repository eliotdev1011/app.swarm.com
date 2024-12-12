import { Contract, ContractInterface, providers, Signer, utils } from 'ethers'
import { isAddress } from 'ethers/lib/utils'

import { verify } from '@core/shared/utils/crypto'
import { getSigner, readOnlyProvider$, walletProvider$ } from '@core/web3'

export type ContractInstances<
  T extends AbstractContract = AbstractContract
> = Record<string, T>

abstract class AbstractContract {
  static instances: ContractInstances = {}

  address: string

  abi: ContractInterface

  signer?: Signer

  contract: Contract | undefined

  initiated = false

  protected constructor(
    address: string,
    abi: ContractInterface,
    signer: Signer | undefined = getSigner(),
  ) {
    verify(
      isAddress(address),
      'Address of contract not provided for constructor',
    )
    verify(!!abi, 'ABI of contract not provided for constructor')

    this.address = address
    this.abi = abi
    this.signer = signer
  }

  protected init = () => {
    if (this.initiated) return

    if (!this.contract && this.address) {
      this.contract = new Contract(
        this.address,
        this.abi,
        readOnlyProvider$.getValue(),
      )

      // Update contract instance on read only provider changes
      readOnlyProvider$.subscribe(async (newReadOnlyProvider) => {
        this.contract = new Contract(
          this.address,
          this.abi,
          newReadOnlyProvider,
        )
        this.updateSigner()
      })

      this.initiated = true
    }
  }

  protected updateSigner = () => {
    const walletProvider = walletProvider$.getValue()
    if (walletProvider) {
      const signer = getSigner(walletProvider)

      if (signer && signer !== this.signer) {
        try {
          this.contract = new Contract(this.address, this.abi, signer)
          this.contract.connect(signer)
          this.signer = signer
        } catch {
          this.contract = new Contract(
            this.address,
            this.abi,
            readOnlyProvider$.getValue(),
          )
        }
      }
    }
  }

  public static parseLogs(
    abi: ContractInterface,
    logs: providers.Log[],
    events: string[],
  ) {
    const iface =
      abi instanceof utils.Interface ? abi : new utils.Interface(abi)

    const topics = events.map((event) => iface.getEventTopic(event))

    const filteredLogs = logs.filter((log) =>
      topics.some((topic) => log.topics.includes(topic)),
    )

    return filteredLogs.map((log) => {
      try {
        return iface.parseLog(log)
      } catch {
        return null
      }
    })
  }
}

export default AbstractContract
