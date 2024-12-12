import { AbstractToken } from '@swarm/types/tokens'
import { combineLatest } from 'rxjs'
import { map, startWith } from 'rxjs/operators'

import exchangeRateOf$ from './exchangeRateOf'
import tokenBalanceOf$ from './tokenBalanceOf'

const usdBalanceOf$ =
  (account?: string | null, initialValue?: number) =>
  (token: Pick<AbstractToken, 'id'>) =>
    combineLatest({
      balance: tokenBalanceOf$(account)(token),
      exchangeRate: exchangeRateOf$(0)(token),
    }).pipe(
      map(
        ({ balance, exchangeRate }) =>
          balance?.times(Number(exchangeRate || 0)).toNumber() || 0,
      ),
      startWith(initialValue),
    )

export default usdBalanceOf$
