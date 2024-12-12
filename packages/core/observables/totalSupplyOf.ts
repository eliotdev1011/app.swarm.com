import { AbstractToken } from '@swarm/types/tokens'
import Big from 'big.js'
import { constants } from 'ethers'
import { useMemo } from 'react'
import { Observable, of } from 'rxjs'
import { switchMap } from 'rxjs/operators'

import useObservable from '@core/hooks/rxjs/useObservable'
import { normalize } from '@core/shared/utils/helpers'
import { isSameEthereumAddress } from '@core/web3'

import decimalsOf$ from './decimalsOf'
import { observeCall } from './watcher'

const totalSupplyOf$ =
  () =>
  ({ id }: Pick<AbstractToken, 'id'>): Observable<Big | null | undefined> => {
    if (!id || isSameEthereumAddress(id, constants.AddressZero)) {
      return of(undefined)
    }

    const key = `totalSupply_${id}`

    const [target, method] = [id, 'totalSupply()(uint256)']

    return decimalsOf$()({ id }).pipe(
      switchMap((decimalsFromObservable) => {
        if (
          decimalsFromObservable !== null &&
          decimalsFromObservable !== undefined
        ) {
          // Decimals found with decimalsOf$(), proceed with observeCall
          return observeCall([method], key, target).pipe(
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
  }

export const useTotalSupplyOf = (id?: string) =>
  useObservable(
    useMemo(() => (id ? totalSupplyOf$()({ id }) : of(undefined)), [id]),
  )

export default totalSupplyOf$
