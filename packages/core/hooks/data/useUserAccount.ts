import { useMemo } from 'react'

import { useCpk } from '@core/contracts/cpk'
import { useCpkAddress } from '@core/state/hooks'
import { isSameEthereumAddress, useAccount } from '@core/web3'

const useUserAccount = (selectedAddress?: string | null) => {
  const account = useAccount()
  const cpk = useCpk()
  const cpkAddress = useCpkAddress(selectedAddress)

  return useMemo(() => {
    if (selectedAddress && cpkAddress) {
      return {
        address: selectedAddress,
        cpkAddress,
      }
    }

    if (
      account &&
      isSameEthereumAddress(selectedAddress, account) &&
      cpk?.address
    ) {
      return {
        address: account,
        cpkAddress: cpk?.address,
      }
    }

    return undefined
  }, [account, selectedAddress, cpk?.address, cpkAddress])
}

export default useUserAccount
