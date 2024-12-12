import { AbstractToken } from '@swarm/types/tokens'
import Big from 'big.js'
import { constants } from 'ethers'
import { Observable, of } from 'rxjs'
import { switchMap } from 'rxjs/operators'

import { isSameEthereumAddress } from '@core/web3'

import { observeCall } from './watcher'

/**
 * Returns an observable that emits
 * * undefined if no token address
 * * null if decimals is being loaded
 * * the last decimals of the token (Big)
 *
 * @param id
 */

const decimalsOf$ =
  () =>
  ({ id }: Pick<AbstractToken, 'id'>): Observable<Big | null | undefined> => {
    if (!id || isSameEthereumAddress(id, constants.AddressZero)) {
      return of(undefined)
    }

    const key = `decimals_${id}`

    const [target, method] = [id, 'decimals()(uint256)']

    return observeCall([method], key, target).pipe(
      switchMap((value: Big) => of(value) || of(null)),
    )
  }

export default decimalsOf$
