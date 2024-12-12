import { useEffect, useState } from 'react'

import { Comptroller } from 'src/contracts/LendBorrow/Comptroller'

export type Contract = Comptroller | undefined

export function useComptrollerContract(address: string): Contract {
  const [contract, setContract] = useState<Contract>(undefined)

  useEffect(() => {
    const setContractInstance = async () => {
      const contractInstance = await Comptroller.getInstance(address)
      setContract(contractInstance)
    }
    setContractInstance()
  }, [address])

  return contract
}
