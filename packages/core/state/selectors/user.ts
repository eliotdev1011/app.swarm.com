import { AppState } from '@swarm/types/state'

import { VerificationStatus } from '@core/shared/enums'
import { hasCompletedVerification } from '@core/shared/utils'
import { propEquals } from '@core/shared/utils/collection'

export const selectTier = (state: AppState) => state.user.tier

export const selectKycProvider = (state: AppState) => state.user.kycProvider

export const selectIsLoggedIn = (state: AppState) =>
  hasCompletedVerification(VerificationStatus.addressVerified)(
    state.user.verificationStatus,
  )

export const selectCpkAddresses = (address: string) => (state: AppState) =>
  state.user.accounts.find(propEquals('address', address))?.cpkAddresses

export const selectUserId = (state: AppState) => state.user.id

export const selectUser = (state: AppState) => state.user

export const selectUserAccounts = (state: AppState) => state.user.accounts

export const selectUserAddresses = (state: AppState) =>
  state.user.accounts.map((userAccount) => userAccount.address)
