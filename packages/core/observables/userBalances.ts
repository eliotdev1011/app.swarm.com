import { AbstractToken } from '@swarm/types/tokens'
import { combineLatest } from 'rxjs'
import { map } from 'rxjs/operators'

import exchangeRateOf$ from './exchangeRateOf'
import tokenBalanceOf$ from './tokenBalanceOf'

const userBalances$ =
  (account?: string | null) => (token: Pick<AbstractToken, 'id'>) =>
    combineLatest([
      tokenBalanceOf$(account)(token),
      exchangeRateOf$(0)(token),
    ]).pipe(
      map(([balance, exchangeRate]) => ({
        native: balance?.toNumber() || 0,
        usd: balance?.times(exchangeRate || 0).toNumber() || 0,
      })),
    )

export default userBalances$
