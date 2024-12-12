import { AbstractToken } from '@swarm/types/tokens'
import Big from 'big.js'
import { constants } from 'ethers'
import { useMemo } from 'react'
import { from, Observable, of } from 'rxjs'
import { switchMap } from 'rxjs/operators'

import { Erc20 } from '@core/contracts/ERC20'
import useObservable from '@core/hooks/rxjs/useObservable'
import { getBalanceCacheKey } from '@core/services/cache/utils'
import { normalize } from '@core/shared/utils/helpers'
import { isNativeToken } from '@core/shared/utils/tokens'
import { isSameEthereumAddress } from '@core/web3'

import decimalsOf$ from './decimalsOf'
import { observeCall } from './watcher'

/**
 * Returns an observable that emits
 * * undefined if no account
 * * null if balance is being loaded
 * * the last balance of the token (Big)
 *
 * @param account
 */
const tokenBalanceOf$ =
  (account?: string | null) =>
  ({ id }: Pick<AbstractToken, 'id'>): Observable<Big | null | undefined> => {
    if (!account || !id || isSameEthereumAddress(id, constants.AddressZero)) {
      return of(undefined) // Early return if invalid input
    }

    const key = getBalanceCacheKey(account, id)

    const [target, method] = isNativeToken({ id })
      ? [undefined, 'getEthBalance(address)(uint256)']
      : [id, 'balanceOf(address)(uint256)']

    // First try getting decimals using Erc20.getDecimals()
    return from(Erc20.getDecimals(id)).pipe(
      switchMap((decimalsFromPromise) => {
        if (decimalsFromPromise !== null && decimalsFromPromise !== undefined) {
          // Decimals found with Erc20.getDecimals(), proceed with observeCall
          return observeCall([method, account], key, target).pipe(
            switchMap((value) =>
              value
                ? of(normalize(value.toString(), decimalsFromPromise))
                : of(null),
            ),
          )
        }
        // Decimals not found, fallback to decimalsOf$()
        return decimalsOf$()({ id }).pipe(
          switchMap((decimalsFromObservable) => {
            if (
              decimalsFromObservable !== null &&
              decimalsFromObservable !== undefined
            ) {
              // Decimals found with decimalsOf$(), proceed with observeCall
              return observeCall([method, account], key, target).pipe(
                switchMap((value) =>
                  value
                    ? of(
                        normalize(
                          value.toString(),
                          decimalsFromObservable.toNumber(),
                        ),
                      )
                    : of(null),
                ),
              )
            }
            // Decimals truly not available
            return of(null)
          }),
        )
      }),
    )
  }

export default tokenBalanceOf$

export const useTokenBalanceOf = (
  account?: string | null,
  tokenAddress?: string,
): Big | null | undefined =>
  useObservable(
    useMemo(
      () =>
        tokenAddress
          ? tokenBalanceOf$(account)({ id: tokenAddress })
          : of(undefined),
      [account, tokenAddress],
    ),
  )
