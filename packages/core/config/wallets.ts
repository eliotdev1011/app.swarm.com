import coinbaseWalletModule from '@web3-onboard/coinbase'
import { InitOptions } from '@web3-onboard/core'
import safeModule from '@web3-onboard/gnosis'
import injectedModule from '@web3-onboard/injected-wallets'
import ledgerModule, { LedgerOptions } from '@web3-onboard/ledger'
import trezorModule from '@web3-onboard/trezor'
import walletConnectModule from '@web3-onboard/walletconnect'

import config from '.'

const projectId = config.walletConnectProjectId

const wcInitOptions = {
  projectId,
}

const ledgerInitOptions: LedgerOptions = {
  projectId,
  walletConnectVersion: 2,
}

const injected = injectedModule()
const walletConnect = walletConnectModule(wcInitOptions)
const ledger = ledgerModule(ledgerInitOptions)
const trezor = trezorModule({
  email: 'swarm@swarm.com',
  appUrl: document.location.host,
})
const coinbase = coinbaseWalletModule()
const safe = safeModule({
  whitelistedDomains: [/^.+$/],
})

export const wallets: InitOptions['wallets'] = [
  injected,
  walletConnect,
  ledger,
  trezor,
  coinbase,
  safe,
]
