import type { Market } from '@swarm/types/lend-borrow'
import Big from 'big.js'

import { getBalanceUnderlyingBalance } from './getBalanceUnderlyingBalance'
import { getDollarsAmountUnderlyingBalance } from './getDollarsAmountUnderlyingBalance'

export function getMaxRedeemableUnderlyingBalance(
  market: Market,
  availableDollarsCollateral: Big,
): Big {
  const suppliedUnderlyingBalance = getBalanceUnderlyingBalance(
    market.balance,
    market.exchangeRate,
  )

  // If we want to redeem the equivalent of removing available dollars collateral from the supply balance,
  // we need to apply the inverse of the collateral factor.
  //
  // Example: if we have $100 in available dollars collateral and the collateral factor is 0.5,
  // we actually need to redeem for the equivalent of $150 to reduce the supply balance by $100.
  const availableDollarsCollateralWithFactor = availableDollarsCollateral.div(
    market.collateralFactor,
  )

  const availableDollarsCollateralWithFactorUnderlyingBalance =
    getDollarsAmountUnderlyingBalance(
      availableDollarsCollateralWithFactor,
      market,
    )

  if (
    suppliedUnderlyingBalance.lt(
      availableDollarsCollateralWithFactorUnderlyingBalance,
    )
  ) {
    return suppliedUnderlyingBalance
  }

  return availableDollarsCollateralWithFactorUnderlyingBalance
}
