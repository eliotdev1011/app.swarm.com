import Big from 'big.js'

export function getBalanceUnderlyingBalance(
  balance: Big,
  exchangeRate: Big,
): Big {
  return balance.mul(exchangeRate)
}
