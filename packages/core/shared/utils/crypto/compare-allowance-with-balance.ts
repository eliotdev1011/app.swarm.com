import { BigSource } from 'big.js'

import { AllowanceStatus } from '@core/shared/enums'

import { big } from '../helpers/big-helpers'

export const compareAllowanceWithBalance = (
  tokenBalance: BigSource,
  tokenAllowance: BigSource,
): AllowanceStatus => {
  const bigAllowance = big(tokenAllowance)

  return (
    (bigAllowance.eq(0) && AllowanceStatus.NOT_ALLOWED) ||
    (bigAllowance.gte(tokenBalance) && AllowanceStatus.INFINITE) ||
    AllowanceStatus.LIMITED
  )
}
