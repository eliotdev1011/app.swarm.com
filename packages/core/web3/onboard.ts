import { AbstractToken } from '@swarm/types/tokens'
import { useSnackbar } from '@swarm/ui/swarm/Snackbar'
import { AlertVariant } from '@swarm/ui/swarm/Snackbar/types'
import Onboard, {
  ConnectedChain,
  WalletState as Wallet,
} from '@web3-onboard/core'
import { ethers, providers } from 'ethers'
import { useCallback } from 'react'
import { Subscription } from 'rxjs'
import { distinctUntilChanged } from 'rxjs/operators'

import { wallets } from '@core/config/wallets'
import useSafeCallback from '@core/hooks/state/useSafeCallback'
import walletAutoDisconnect$ from '@core/observables/walletAutoDisconnect'
import { commonEVMNetworks } from '@core/shared/consts'
import {
  cachedWalletLocalStorage,
  walletConnectLocalStorage,
} from '@core/shared/localStorage'
import { jwtLocalStorage } from '@core/shared/localStorage/jwtLocalStorage'
import { disconnected } from '@core/state/actions/app'
import { alertAdded } from '@core/state/actions/snackbar'
import { accountChanged } from '@core/state/actions/users'
import store from '@core/state/store'
import { isSameEthereumAddress, provider$, readOnlyProvider$ } from '@core/web3'

import { account$ } from './account'
import { walletNetworkId$ } from './networkId'
import { walletProvider$ } from './provider'
import { unifyAddress } from './utils'

let lastSelectedWalletLabel: string | null = cachedWalletLocalStorage.get()
let isDisconnecting = false

export const onboard = Onboard({
  wallets,
  accountCenter: {
    desktop: { enabled: false },
    mobile: { enabled: false },
  },
  notify: { enabled: false },
  chains: commonEVMNetworks.map((network) => {
    return {
      id: network.chainId,
      label: network.networkName,
      rpcUrl: network.rpcUrls[0],
      token: network.nativeCurrency.symbol,
    }
  }),
  appMetadata: {
    name: 'Swarm',
    icon: '<svg><svg/>',
    description:
      'A unified exchange for securities and crypto. Swarm is a regulated DeFi protocol — the convenience and transparency of DeFi with the confidence of financial market compliance.',
    recommendedInjectedWallets: [
      { name: 'MetaMask', url: 'https://metamask.io' },
      { name: 'Coinbase', url: 'https://wallet.coinbase.com/' },
    ],
  },
})

function getConnectedWallet(connectedWallets: Wallet[]): Wallet | null {
  const connectedWallet = connectedWallets[0]

  if (connectedWallet === undefined) {
    return null
  }

  return connectedWallet
}

function getConnectedChain(connectedWallet: Wallet): ConnectedChain | null {
  const connectedChain = connectedWallet.chains[0]

  if (connectedChain === undefined) {
    return null
  }

  return connectedChain
}

function getConnectedAccount(connectedWallet: Wallet): string | null {
  const connectedAccount = connectedWallet.accounts[0]

  if (connectedAccount === undefined) {
    return null
  }

  return connectedAccount.address
}

let readOnlyProviderSubscription: Subscription | null = null
function onWalletChange(newConnectedWallet: Wallet): void {
  walletConnectLocalStorage.remove()

  if (readOnlyProviderSubscription !== null) {
    readOnlyProviderSubscription.unsubscribe()
  }

  if (newConnectedWallet.label === 'MetaMask') {
    provider$.next(new providers.Web3Provider(newConnectedWallet.provider))
  } else {
    provider$.next(readOnlyProvider$.getValue())

    // Make sure the provider is updated if the read only provider changes in the future
    readOnlyProviderSubscription = readOnlyProvider$.subscribe(
      (newReadOnlyProvider) => {
        provider$.next(newReadOnlyProvider)
      },
    )
  }

  if (newConnectedWallet.provider) {
    walletProvider$.next(
      new providers.Web3Provider(
        newConnectedWallet.provider as unknown as providers.JsonRpcFetchFunc,
        'any',
      ),
    )
    lastSelectedWalletLabel = newConnectedWallet.label
  } else {
    walletProvider$.next(null)
    lastSelectedWalletLabel = null
    jwtLocalStorage.remove()
  }
}

function onChainChange(newConnectedChain: ConnectedChain): void {
  const connectedChainId = parseInt(newConnectedChain.id, 16)

  walletNetworkId$.next(connectedChainId)
}

function onAccountChange(newConnectedAccount: string): void {
  const cleanAddress = unifyAddress(newConnectedAccount)

  account$.next(cleanAddress)

  cachedWalletLocalStorage.set(lastSelectedWalletLabel)
  store.dispatch(accountChanged(cleanAddress))
}

export async function connectWallet(walletLabel?: string): Promise<boolean> {
  try {
    if (walletLabel) {
      await onboard.connectWallet({
        autoSelect: {
          label: walletLabel,
          disableModals: true,
        },
      })
    } else {
      await onboard.connectWallet()
    }

    return true
  } catch {
    return false
  }
}

export async function disconnectWallet(): Promise<boolean> {
  if (lastSelectedWalletLabel === null || isDisconnecting) {
    return false
  }

  isDisconnecting = true

  try {
    await onboard.disconnectWallet({ label: lastSelectedWalletLabel })

    lastSelectedWalletLabel = null

    account$.next(undefined)

    walletConnectLocalStorage.remove()
    cachedWalletLocalStorage.remove()

    if (walletAutoDisconnect$.getValue()) {
      jwtLocalStorage.remove()
      store.dispatch(disconnected())
    }

    return true
  } catch {
    return false
  } finally {
    isDisconnecting = false
  }
}

export const useConnectWallet = (callback?: (success: boolean) => void) => {
  const safeCallback = useSafeCallback(callback)
  const { addError } = useSnackbar()

  return useCallback(
    async (walletSelect?: string) => {
      try {
        const success = await connectWallet(walletSelect)
        safeCallback(success)
        return success
      } catch (error) {
        addError(error as Error)
        safeCallback(false)
        return false
      }
    },
    [addError, safeCallback],
  )
}

export const useDisconnectWallet = (callback?: (success: boolean) => void) => {
  const safeCallback = useSafeCallback(callback)
  const { addError } = useSnackbar()

  return useCallback(async () => {
    try {
      const success = await disconnectWallet()
      safeCallback(success)
      return success
    } catch (error) {
      addError(error as Error)
      safeCallback(false)
      return false
    }
  }, [addError, safeCallback])
}

// Subscribe for changes
const connectedWalletsSlice = onboard.state.select('wallets')
connectedWalletsSlice
  .pipe(
    distinctUntilChanged((previousWallets: Wallet[], newWallets: Wallet[]) => {
      const previousConnectedWallet = getConnectedWallet(previousWallets)
      const newConnectedWallet = getConnectedWallet(newWallets)

      if (previousConnectedWallet !== null && newConnectedWallet !== null) {
        const isSameWalletLabel =
          previousConnectedWallet.label === newConnectedWallet.label

        const isSameConnectedAccount = isSameEthereumAddress(
          getConnectedAccount(previousConnectedWallet),
          getConnectedAccount(newConnectedWallet),
        )

        const isSameChain =
          getConnectedChain(previousConnectedWallet) ===
          getConnectedChain(newConnectedWallet)

        return isSameWalletLabel && isSameConnectedAccount && isSameChain
      }

      return false
    }),
  )
  .subscribe((connectedWallets: Wallet[]) => {
    // Handle wallet changes
    const connectedWallet = getConnectedWallet(connectedWallets)
    if (connectedWallet === null) {
      disconnectWallet()
      return
    }
    onWalletChange(connectedWallet)

    // Handle chain changes
    const connectedChain = getConnectedChain(connectedWallet)
    if (connectedChain === null) {
      return
    }
    onChainChange(connectedChain)

    // Handle account changes
    const connectedAccount = getConnectedAccount(connectedWallet)
    if (connectedAccount === null) {
      return
    }

    onAccountChange(connectedAccount)
  })

export async function switchNetwork(networkId: number): Promise<boolean> {
  if (account$.getValue() === undefined) {
    walletNetworkId$.next(networkId)
    return true
  }

  try {
    const success = await onboard.setChain({
      chainId: ethers.utils.hexValue(networkId),
    })
    return success
  } catch (error) {
    store.dispatch(
      alertAdded({
        message: (error as Error).message,
        variant: AlertVariant.error,
      }),
    )
    return false
  }
}

export const addToken = async (
  token: Pick<AbstractToken, 'id' | 'decimals' | 'symbol'>,
  tokenLogo?: string,
) => {
  if (!walletProvider$.getValue()) {
    throw new Error('No wallet connected')
  }

  const wallet = walletProvider$.getValue()

  try {
    await wallet?.provider.request?.({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: token.id,
          symbol: token.symbol,
          decimals: token.decimals,
          image: tokenLogo,
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)
  } catch (e) {
    throw new Error('Could not add token to wallet')
  }
}
