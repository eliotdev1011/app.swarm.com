import { TransactionResponse } from '@ethersproject/abstract-provider'
import Big from 'big.js'
import { useCallback } from 'react'

import { Erc20 } from '@core/contracts/ERC20'
import { VSMT } from '@core/contracts/VSMT'
import { useCpk } from '@core/contracts/cpk'
import useObservable from '@core/hooks/rxjs/useObservable'
import { useAllowanceOf } from '@core/observables/allowanceOf'
import contractOf$ from '@core/observables/contractOf'
import exchangeRateOf$ from '@core/observables/exchangeRateOf'
import { useTokenBalanceOf } from '@core/observables/tokenBalanceOf'
import { ZERO } from '@core/shared/utils/helpers'
import { useAccount } from '@core/web3'

import useAsyncMemo from '../async/useAsyncMemo'

export interface UseErc20Return {
  address?: string
  contract?: VSMT | Erc20
  name: string
  symbol: string
  decimals?: number | null
  exchangeRate?: number | null
  totalSupply: Big | null
  balanceOf: (userAddress: string) => Promise<Big>
  balanceOfCurrentUser?: Big | null
  allowanceOfCurrentUser?: Big | null
  enable: () => Promise<'' | TransactionResponse | undefined>
  disable: () => Promise<'' | TransactionResponse | undefined>
  loading: boolean
}

export const useErc20 = (address?: string): UseErc20Return => {
  const contract = useObservable(() =>
    address ? contractOf$()({ address, id: address }) : undefined,
  )

  const [symbol, { loading: symbolLoading }] = useAsyncMemo(
    async () => (contract ? contract.getSymbol() : ''),
    '',
    [contract],
  )

  const [name, { loading: nameLoading }] = useAsyncMemo(
    async () => (contract ? contract.getName() : ''),
    '',
    [contract],
  )

  const [decimals, { loading: decimalsLoading }] = useAsyncMemo(
    async () => (contract ? contract.getDecimals() : 0),
    0,
    [contract],
  )

  const [totalSupply, { loading: totalSupplyLoading }] = useAsyncMemo(
    async () => (contract ? contract.getTotalSupply() : ZERO),
    ZERO,
    [contract],
  )

  const exchangeRate = useObservable(() =>
    address ? exchangeRateOf$(0)({ id: address }) : undefined,
  )

  const balanceOf = useCallback(
    async (userAddress: string) =>
      contract ? contract.normalizedBalanceOf(userAddress) : ZERO,
    [contract],
  )

  const account = useAccount()
  const cpk = useCpk()

  const balanceOfCurrentUser = useTokenBalanceOf(account, address)

  const enable = useCallback(
    async () => cpk?.address && contract?.enableToken(cpk?.address),
    [cpk?.address, contract],
  )

  const disable = useCallback(
    async () => cpk?.address && contract?.disableToken(cpk?.address),
    [cpk?.address, contract],
  )

  const allowanceOfCurrentUser = useAllowanceOf(account, cpk?.address, address)

  return {
    address,
    contract,
    symbol,
    name,
    decimals,
    totalSupply,
    exchangeRate,
    balanceOf,
    balanceOfCurrentUser,
    enable,
    disable,
    allowanceOfCurrentUser,
    loading:
      nameLoading || symbolLoading || decimalsLoading || totalSupplyLoading,
  }
}
