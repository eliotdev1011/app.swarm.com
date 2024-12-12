import { Action, UserProfile } from '@swarm/types/state'

import walletAutoDisconnect$ from '@core/observables/walletAutoDisconnect'
import { InitialState } from '@core/state/AppContext'
import {
  ACCOUNT_CHANGED,
  DISCONNECTED,
  DOC_SCAN_OUTCOME_REASON,
  DOC_SCAN_SESSION_WAITING,
  ERROR_OCCURRED,
  LOGIN_FAILED,
  PROFILE_UPDATED,
  REGISTER_FAILED,
  SESSION_EXPIRED,
} from '@core/state/actions/action-types'
import { isSameEthereumAddress } from '@core/web3'

const userReducer = (state: UserProfile, action: Action) => {
  switch (action.type) {
    case PROFILE_UPDATED:
      return {
        ...state,
        ...action.payload?.user,
      }
    case REGISTER_FAILED:
    case LOGIN_FAILED:
    case DOC_SCAN_SESSION_WAITING:
      return {
        ...state,
        docScanSessionWaiting: action.payload?.status,
      }
    case DOC_SCAN_OUTCOME_REASON:
      return {
        ...state,
        docScanOutcomeReason: action.payload?.reason,
      }
    case SESSION_EXPIRED:
      return {
        ...state,
        error: action.payload?.error,
      }
    case ERROR_OCCURRED:
      if (action.payload?.error === 'unauthorized') {
        return {
          ...InitialState.user,
        }
      }
      return { ...state }
    case ACCOUNT_CHANGED: {
      if (
        walletAutoDisconnect$.getValue() &&
        !state.accounts.some((account) => {
          return isSameEthereumAddress(account.address, action.payload?.account)
        })
      ) {
        return {
          ...InitialState.user,
          ...(action.payload?.tier && { tier: action.payload?.tier }),
          ...(action.payload?.kycProvider && {
            kycProvider: action.payload?.kycProvider,
          }),
        }
      }
      return state
    }
    case DISCONNECTED:
      return { ...InitialState.user, tier: state.tier }
    default:
      return { ...state }
  }
}

export default userReducer
