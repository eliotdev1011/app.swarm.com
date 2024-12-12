import { merge, of } from 'rxjs'
import { distinctUntilChanged, switchMap } from 'rxjs/operators'

import { cachedAccountAddressNamesLocalStorage } from '@core/shared/localStorage'
import { account$, readOnlyProvider$ } from '@core/web3'

export type CachedAccountAddresssNames = Record<
  string,
  string | null | undefined
>

function setCachedAccountAddressName(
  account: string,
  name: string | null,
): void {
  const currentCachedAccountsAddressNames = cachedAccountAddressNamesLocalStorage.get()
  cachedAccountAddressNamesLocalStorage.set({
    ...currentCachedAccountsAddressNames,
    [account]: name,
  })
}

const accountAddressName$ = merge(
  account$.pipe(
    distinctUntilChanged(),
    switchMap((account) => {
      if (account === undefined) {
        return of(null)
      }

      const cachedAccountsAddressNames = cachedAccountAddressNamesLocalStorage.get()

      const cachedAccountAddressName = cachedAccountsAddressNames[account]

      if (cachedAccountAddressName === undefined) {
        return of(null)
      }

      return of(cachedAccountAddressName)
    }),
    distinctUntilChanged(),
  ),
  account$.pipe(
    distinctUntilChanged(),
    switchMap(async (account) => {
      if (account === undefined) {
        return null
      }

      try {
        const resolvedAccountAddressName = await readOnlyProvider$
          .getValue()
          .lookupAddress(account)

        setCachedAccountAddressName(account, resolvedAccountAddressName)

        return resolvedAccountAddressName
      } catch (error) {
        // ENS operations are not supported on side chains like Polygon
        return null
      }
    }),
    distinctUntilChanged(),
  ),
)

export default accountAddressName$
