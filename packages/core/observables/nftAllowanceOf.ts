import { AbstractNFT } from '@swarm/types/tokens'
import { constants } from 'ethers'
import { useMemo } from 'react'
import { Observable, of } from 'rxjs'
import { switchMap } from 'rxjs/operators'

import useObservable from '@core/hooks/rxjs/useObservable'
import { getAllowanceCacheKey } from '@core/services/cache/utils'
import { big, ZERO } from '@core/shared/utils/helpers'
import { isSameEthereumAddress } from '@core/web3'

import { observeCall } from './watcher'

/**
 * Returns an observable that emits
 * * undefined if no account
 * * null if allowance is being loaded
 * * boolean if allowance is fetched
 *
 * @param account
 */

const nftAllowanceOf$ =
  (account?: string | null, spenderAddress?: string) =>
  (nft: Pick<AbstractNFT, 'address'>): Observable<Big | null | undefined> => {
    const nftAddress = nft.address
    if (
      !account ||
      !spenderAddress ||
      !nftAddress ||
      isSameEthereumAddress(nftAddress, constants.AddressZero)
    ) {
      return of(undefined)
    }

    const key = getAllowanceCacheKey(account, spenderAddress, nftAddress)
    const [target, method] = [
      nftAddress,
      'isApprovedForAll(address,address)(bool)',
    ]

    return observeCall([method, account, spenderAddress], key, target).pipe(
      switchMap((value) => {
        return value !== undefined
          ? of(Boolean(value) ? big(Number.MAX_SAFE_INTEGER) : ZERO)
          : of(null)
      }),
    )
  }

export const useNFTAllowanceOf = (
  account?: string | null,
  spenderAddress?: string,
  nftAddress?: string,
) =>
  useObservable(
    useMemo(
      () =>
        nftAddress
          ? nftAllowanceOf$(account, spenderAddress)({ address: nftAddress })
          : of(undefined),
      [account, spenderAddress, nftAddress],
    ),
    undefined,
  )

export default nftAllowanceOf$
