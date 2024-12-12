import { AbstractAsset } from '@swarm/types/tokens'
import { constants } from 'ethers'
import { useMemo } from 'react'
import { from, Observable, of } from 'rxjs'
import { switchMap } from 'rxjs/operators'

import useObservable from '@core/hooks/rxjs/useObservable'
import { isIpfsUrl, requestIpfs } from '@core/shared/utils/crypto'
import { isSameEthereumAddress } from '@core/web3'

import { observeCall } from './watcher'
import { getCurrentConfig } from './configForNetwork'

const { xGoldBundleAddress } = getCurrentConfig()

/**
 * Returns an observable that emits
 * * undefined if no token address or loading state
 * * null if kya is not available
 * * the kya of the token
 *
 * @param id
 */

const kyaOf$ =
  () =>
  ({
    id,
    tokenId,
  }: Partial<Pick<AbstractAsset, 'id' | 'tokenId'>>): Observable<
    string | null | undefined
  > => {
    if (!id || isSameEthereumAddress(id, constants.AddressZero)) {
      return of(undefined)
    }

    const key = tokenId ? `kya_${id}_${tokenId}` : `kya_${id}`

    const [target, method] = tokenId
      ? [id, 'tokenKya(uint256)(string)']
      : [
          id,
          // temp solution to show xGold info
          isSameEthereumAddress(id, xGoldBundleAddress)
            ? 'tokenKya()(string)'
            : 'kya()(string)',
        ]

    return observeCall(
      [method, ...(tokenId ? [tokenId] : [])],
      key,
      target,
    ).pipe(
      switchMap((value: string) => {
        return of(value)
      }),
    )
  }

export const useKyaOf = (tokenAddress?: string) =>
  useObservable(
    useMemo(() => kyaOf$()({ id: tokenAddress }), [tokenAddress]),
    undefined,
  )

interface UseKyaDataOptions {
  tokenAddress?: string
  tokenId?: string
  ipfsUri?: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useKyaDataOf = ({
  tokenAddress,
  tokenId,
  ipfsUri,
}: UseKyaDataOptions): undefined | null | any => {
  return useObservable(
    useMemo(() => {
      if (!tokenAddress) {
        return of(undefined)
      }

      if (ipfsUri && isIpfsUrl(ipfsUri)) {
        return from(requestIpfs(ipfsUri))
      }

      // Use kyaOf$ to get the KYA data
      return kyaOf$()({ id: tokenAddress, tokenId }).pipe(
        switchMap((kya) => {
          // If the kya is an IPFS URL, request the IPFS data
          if (kya && isIpfsUrl(kya)) {
            return from(requestIpfs(kya))
          }
          return of(kya)
        }),
      )
    }, [tokenAddress, tokenId, ipfsUri]),
  )
}

export default kyaOf$
