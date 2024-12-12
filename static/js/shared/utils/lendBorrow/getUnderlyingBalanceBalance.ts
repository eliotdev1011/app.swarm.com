import Big from 'big.js'

export function getUnderlyingBalanceBalance(
  underlyingBalance: Big,
  exchangeRate: Big,
): Big {
  return underlyingBalance.div(exchangeRate)
}
