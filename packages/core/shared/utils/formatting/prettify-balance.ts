import { BigSource } from 'big.js'

import autoRound from '../math/autoRound'

import { formatBalance } from './format-balance'

export const prettifyBalance = (
  balance: BigSource,
  base = 2,
  accuracy = 4,
): string =>
  formatBalance(
    autoRound(balance, {
      minDecimals: base,
      maxDecimals: 7,
      accuracy,
    }),
  )
