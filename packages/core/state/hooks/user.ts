import { useMemo } from 'react'

import {
  selectCpkAddresses,
  selectIsLoggedIn,
  selectKycProvider,
  selectTier,
  selectUser,
  selectUserAccounts,
  selectUserAddresses,
  selectUserId,
} from '@core/state/selectors'
import useSelector from '@core/state/useSelector'
import { useStoredNetworkId } from '@core/web3'

export const useTier = () => useSelector(selectTier)

export const useIsLoggedIn = () => useSelector(selectIsLoggedIn)

export const useKycProvider = () => useSelector(selectKycProvider)

export const useCpkAddress = (address?: string | null) => {
  const networkId = useStoredNetworkId()
  const cpkAddresses = useSelector(
    useMemo(() => selectCpkAddresses(address || ''), [address]),
  )

  return cpkAddresses?.[networkId]
}

export const useUserId = () => useSelector(selectUserId)

export const useUser = () => useSelector(selectUser)

export const useUserAccounts = () => useSelector(selectUserAccounts)

export const useUserAddresses = () => useSelector(selectUserAddresses)
