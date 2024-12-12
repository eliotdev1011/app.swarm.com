import { BigSource } from 'big.js'

import { B_TEN, big } from '../helpers/big-helpers'

import { formatBigInt } from './format-big-int'

export const formatBigBalance = (_balance: BigSource, precision = 4) => {
  const balance = big(_balance)

  if (balance.gte(B_TEN.pow(precision))) {
    return formatBigInt(balance)
  }

  const rounded = balance.toPrecision(precision)

  return Number(rounded)
}

// Add commas as thousands separators for the integer part of the figure
export const formatBalance = (balance: BigSource = 0) => {
  const [intPart, decimalPart] = balance.toString().split('.')
  const prettyIntPart = intPart.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')

  return decimalPart ? `${prettyIntPart}.${decimalPart}` : prettyIntPart
}
