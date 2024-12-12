import { AbstractToken } from '@swarm/types/tokens'
import Big from 'big.js'
import { constants } from 'ethers'
import { useMemo } from 'react'
import { combineLatest, Observable, of } from 'rxjs'
import {
  distinctUntilChanged,
  map,
  shareReplay,
  switchMap,
} from 'rxjs/operators'

import useObservable from '@core/hooks/rxjs/useObservable'
import tokenBalanceOf$ from '@core/observables/tokenBalanceOf'
import { getAllowanceCacheKey } from '@core/services/cache/utils'
import { AllowanceStatus } from '@core/shared/enums'
import { compareAllowanceWithBalance } from '@core/shared/utils'
import { normalize } from '@core/shared/utils/helpers'
import { isNativeToken } from '@core/shared/utils/tokens'
import { isSameEthereumAddress } from '@core/web3'

import decimalsOf$ from './decimalsOf'
import { observeCall } from './watcher'

const allowanceOf$ =
  (account?: string | null, spenderAddress?: string) =>
  (token: Pick<AbstractToken, 'id'>): Observable<Big | null | undefined> => {
    const id = token?.id
    if (
      !account ||
      !spenderAddress ||
      !id ||
      isSameEthereumAddress(id, constants.AddressZero)
    ) {
      return of(undefined)
    }

    if (isNativeToken({ id })) {
      return tokenBalanceOf$(account)({ id })
    }

    const [target, method] = [id, 'allowance(address,address)(uint256)']
    const key = getAllowanceCacheKey(account, spenderAddress, id)

    return decimalsOf$()({ id }).pipe(
      switchMap((decimalsFromObservable) => {
        if (
          decimalsFromObservable !== null &&
          decimalsFromObservable !== undefined
        ) {
          return observeCall(
            [method, account, spenderAddress],
            key,
            target,
          ).pipe(
            switchMap((value) => {
              return value
                ? of(
                    normalize(
                      value.toString(),
                      decimalsFromObservable.toNumber(),
                    ),
                  )
                : of(null)
            }),
          )
        }

        return of(null)
      }),
    )
  }

export const useAllowanceOf = (
  account?: string | null,
  spenderAddress?: string,
  tokenAddress?: string,
) =>
  useObservable(
    useMemo(
      () =>
        tokenAddress
          ? allowanceOf$(account, spenderAddress)({ id: tokenAddress })
          : of(undefined),
      [account, spenderAddress, tokenAddress],
    ),
    undefined,
  )

export const allowanceStatusOf$ =
  (account?: string | null, spenderAddress?: string) =>
  ({
    id,
  }: Pick<AbstractToken, 'id'>): Observable<
    AllowanceStatus | undefined | null
  > => {
    return combineLatest([
      tokenBalanceOf$(account)({ id }),
      allowanceOf$(account, spenderAddress)({ id }),
    ]).pipe(
      map(
        ([balance, allowance]) =>
          (balance &&
            allowance &&
            compareAllowanceWithBalance(balance, allowance)) ??
          AllowanceStatus.NOT_AVAILABLE,
      ),
      distinctUntilChanged(),
      shareReplay(1),
    )
  }

export const useAllowanceStatusOf = (
  account?: string | null,
  spenderAddress?: string,
  tokenAddress?: string,
) =>
  useObservable(
    useMemo(
      () =>
        tokenAddress
          ? allowanceStatusOf$(account, spenderAddress)({ id: tokenAddress })
          : of(undefined),
      [account, spenderAddress, tokenAddress],
    ),
  )

export default allowanceOf$
