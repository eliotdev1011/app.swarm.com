import { Obj } from '@swarm/types'
import { AppState, DispatchWithThunk } from '@swarm/types/state'

import walletAutoDisconnect$ from '@core/observables/walletAutoDisconnect'
import api from '@core/services/api'
import { kycProviderMap } from '@core/shared/consts/kyc-provider-map'
import { cachedWalletLocalStorage } from '@core/shared/localStorage'
import { jwtLocalStorage } from '@core/shared/localStorage/jwtLocalStorage'
import {
  connectWallet,
  getAccount,
  isSameEthereumAddress,
  setReady,
} from '@core/web3'

import {
  DISCONNECTED,
  ERROR_OCCURRED,
  INITIATED,
  PROFILE_UPDATED,
} from './action-types'
import { profileUpdated } from './users'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const errorOccurred = (error: any) => ({
  type: ERROR_OCCURRED,
  payload: {
    error,
  },
})

export const disconnected = () => ({
  type: DISCONNECTED,
})

export const initiated = () => ({
  type: INITIATED,
})

export const init = () => async (dispatch: DispatchWithThunk<AppState>) => {
  const lastWallet = cachedWalletLocalStorage.get()

  if (lastWallet) {
    const success = await connectWallet(lastWallet)

    if (!success) {
      cachedWalletLocalStorage.remove()
    }
  }

  const account = getAccount()

  if (!account) {
    if (walletAutoDisconnect$.getValue()) {
      dispatch(disconnected())
      dispatch(initiated())
    }
    setReady()

    return
  }

  const updatePublicUserData = async () => {
    let user: Obj | undefined

    try {
      const {
        attributes: { tier },
      } = await api.getTier(account)
      user = tier && { tier }
    } catch {
      // do nothing
    }

    try {
      const {
        attributes: { kyc_provider: kycProviderKey },
      } = await api.publicProfile(account)
      user = {
        ...user,
        ...(kycProviderKey && { kycProvider: kycProviderMap[kycProviderKey] }),
      }
    } catch {
      // do nothing
    }

    if (user && Object.keys(user).length > 0) {
      dispatch({ type: PROFILE_UPDATED, payload: { user } })
    }
  }

  const token = jwtLocalStorage.get()

  if (!token) {
    dispatch(disconnected())
    await updatePublicUserData()
    dispatch(initiated())
    setReady()
    return
  }

  let profile
  try {
    profile = await api.profile()
  } catch (e) {
    dispatch(disconnected())
  }

  if (profile) {
    const userMatchesWallet = profile?.attributes?.ethereum_addresses.some(
      (user) => {
        return isSameEthereumAddress(user.attributes.address, account)
      },
    )
    if (userMatchesWallet) {
      dispatch(profileUpdated(profile))
    } else {
      dispatch(disconnected())
      await updatePublicUserData()
    }
  } else {
    await updatePublicUserData()
  }

  dispatch(initiated())

  setReady()
}
