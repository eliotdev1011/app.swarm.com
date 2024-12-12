import { ChildrenProps } from '@swarm/types'
import React, { createContext, useMemo } from 'react'

import { SmtDistributor } from '@core/contracts/SmtDistributor'
import { useCpk } from '@core/contracts/cpk'
import useAsyncMemo from '@core/hooks/async/useAsyncMemo'
import { useSmt } from '@core/hooks/data/useSmt'
import { ZERO } from '@core/shared/utils/helpers'
import { useAccount } from '@core/web3'

interface TokenBalance {
  erc20: number
  usd: number
}

export interface SmtContextType {
  smtBalance: {
    wallet: TokenBalance
    unclaimed: TokenBalance & { reload: () => Promise<void>; erc20CPK: number }
    total: TokenBalance
    balanceLoading: boolean
    claimInProgress: boolean
    setClaimInProgress: (claimInProgress: boolean) => void
  }
  price: number
}

export const SmtContext = createContext<SmtContextType>({
  smtBalance: {
    wallet: {
      erc20: 0,
      usd: 0,
    },
    unclaimed: {
      erc20: 0,
      erc20CPK: 0,
      usd: 0,
      reload: async () => {},
    },
    total: {
      erc20: 0,
      usd: 0,
    },
    balanceLoading: true,
    claimInProgress: false,
    setClaimInProgress: () => {},
  },
  price: 0,
})

export const SmtContextProvider = ({ children }: ChildrenProps) => {
  const [claimInProgress, setClaimInProgress] = React.useState(false)
  const account = useAccount()
  const cpk = useCpk()
  const {
    balanceOfCurrentUser: smtWalletBalance = ZERO,
    exchangeRate: smtPrice = 0,
    loading: smtLoading,
  } = useSmt()

  const [
    claimableSmt,
    {
      loading: reloadingSmtClaimableBalance,
      reload: reloadSmtClaimableBalance,
    },
  ] = useAsyncMemo(
    async () => SmtDistributor.getClaimableAmount(account),
    ZERO,
    [account],
  )

  const [
    claimableCpkSmt,
    {
      loading: reloadingSmtClaimableCpkBalance,
      reload: reloadSmtClaimableCpkBalance,
    },
  ] = useAsyncMemo(
    async () => SmtDistributor.getClaimableAmount(cpk?.address),
    ZERO,
    [cpk],
  )

  const smtSummaryBalance = useMemo(
    () =>
      smtWalletBalance
        ? claimableSmt.add(smtWalletBalance ?? 0).add(claimableCpkSmt ?? 0)
        : ZERO,
    [smtWalletBalance, claimableSmt, claimableCpkSmt],
  )

  const totalSmtBalance = useMemo<TokenBalance>(
    () => ({
      erc20: smtSummaryBalance.toNumber(),
      usd: smtSummaryBalance.times(smtPrice || 0).toNumber(),
    }),
    [smtSummaryBalance, smtPrice],
  )

  const value = React.useMemo(() => {
    return {
      smtBalance: {
        wallet: {
          erc20: smtWalletBalance?.toNumber() || 0,
          usd: smtWalletBalance?.times(smtPrice ?? 0).toNumber() || 0,
        },
        unclaimed: {
          erc20: claimableSmt.toNumber(),
          erc20CPK: claimableCpkSmt.toNumber(),
          usd: claimableSmt
            .add(claimableCpkSmt ?? 0)
            .times(smtPrice || 0)
            .toNumber(),
          reload: async () => {
            await reloadSmtClaimableCpkBalance()
            await reloadSmtClaimableBalance()
          },
        },
        total: totalSmtBalance,
        balanceLoading:
          smtLoading ||
          reloadingSmtClaimableBalance ||
          reloadingSmtClaimableCpkBalance,
        claimInProgress,
        setClaimInProgress,
      },
      price: Number(smtPrice),
    }
  }, [
    smtWalletBalance,
    smtPrice,
    claimableSmt,
    claimableCpkSmt,
    totalSmtBalance,
    smtLoading,
    reloadingSmtClaimableBalance,
    reloadingSmtClaimableCpkBalance,
    claimInProgress,
    reloadSmtClaimableCpkBalance,
    reloadSmtClaimableBalance,
  ])

  return <SmtContext.Provider value={value}>{children}</SmtContext.Provider>
}
