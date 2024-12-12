import { HasAllowance, HasCpkAllowance } from '@swarm/types/tokens'
import { BigSource } from 'big.js'

import { isLoading } from './balance'

export const allowanceLoading = (
  token: HasAllowance,
  account?: string | null,
  spender?: string | null,
) => isLoading(token.allowance, account, spender)

export const cpkAllowanceLoading = (
  token: HasCpkAllowance,
  account?: string | null,
  spender?: string | null,
) => isLoading(token.cpkAllowance, account, spender)

export const allowancesLoading = (
  tokens: HasAllowance[],
  account?: string | null,
  spender?: string | null,
) => tokens.some((token) => token && allowanceLoading(token, account, spender))

export const cpkAllowancesLoading = (
  tokens: HasCpkAllowance[],
  account?: string | null,
  spender?: string | null,
) =>
  tokens.some((token) => token && cpkAllowanceLoading(token, account, spender))

export const isLocked = (token: HasCpkAllowance, amount: BigSource = 0) =>
  token.cpkAllowance?.lt(amount) ?? true

export const isEnabled = (token: HasCpkAllowance, amount: BigSource = 0) =>
  token.cpkAllowance?.gte(amount) ?? false
