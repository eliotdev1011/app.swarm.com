import { HasBalance, HasCpkBalance } from '@swarm/types/tokens'
import Big from 'big.js'

export const isLoading = (
  value?: Big | null,
  ...accounts: (string | null | undefined)[]
) =>
  value === null ||
  (typeof value === 'undefined' && accounts.some((account) => !!account))

export const balanceLoading = (token: HasBalance, account?: string | null) =>
  isLoading(token.balance, account)

export const balancesLoading = (
  tokens: HasBalance[],
  account?: string | null,
) => tokens.some((token) => balanceLoading(token, account))

export const cpkBalanceLoading = (
  token: HasCpkBalance,
  account?: string | null,
) => isLoading(token.cpkBalance, account)
