import Big from 'big.js'
import { constants } from 'ethers'
import { useMemo } from 'react'
import { Observable, of } from 'rxjs'
import { switchMap } from 'rxjs/operators'

import useObservable from '@core/hooks/rxjs/useObservable'
import { getBalanceCacheKey } from '@core/services/cache/utils'
import { big } from '@core/shared/utils/helpers/big-helpers'
import { isSameEthereumAddress, unifyAddress } from '@core/web3'

import { observeCall } from './watcher'

/**
 * Returns an observable that emits
 * * undefined if no account
 * * null if balance is being loaded
 * * the last balance of the token (Big)
 *
 * @param account
 */

interface NftBalanceOfProps {
  contractAddress: string
  tokenId?: string
}

const nftBalanceOf$ =
  (account?: string | null) =>
  ({
    contractAddress: nftAddress,
    tokenId,
  }: NftBalanceOfProps): Observable<Big | null | undefined> => {
    if (
      !account ||
      !nftAddress ||
      !tokenId ||
      isSameEthereumAddress(nftAddress, constants.AddressZero)
    ) {
      return of(undefined) // Early return if invalid input
    }

    const isErc1155 = !!tokenId

    const unifiedAccount = unifyAddress(account)
    const unifiedContract = unifyAddress(nftAddress)

    const cacheKey = getBalanceCacheKey(
      unifiedAccount,
      unifiedContract,
      tokenId,
    )

    const [target, method] = isErc1155
      ? [nftAddress, 'balanceOf(address,uint256)(uint256)']
      : [nftAddress, 'balanceOf(address)(uint256)']

    return observeCall([method, account, tokenId], cacheKey, target).pipe(
      switchMap((value) => (value ? of(big(value)) : of(null))),
    )
  }

export default nftBalanceOf$

export const useNFTBalanceOf = (
  account?: string | null,
  contractAddress?: string,
  tokenId?: string,
): Big | null | undefined =>
  useObservable(
    useMemo(
      () =>
        contractAddress
          ? nftBalanceOf$(account)({ contractAddress, tokenId })
          : of(undefined),
      [account, contractAddress, tokenId],
    ),
  )
