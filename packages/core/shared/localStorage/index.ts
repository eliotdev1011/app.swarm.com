import { Transaction } from '@swarm/types'
import { AlertSkeleton } from '@swarm/ui/swarm/Snackbar/types'
import { differenceInHours } from 'date-fns'
import { useMemo } from 'react'

import { useWindowStorage } from '@core/hooks/useWindowStorage'
import { CachedAccountAddresssNames } from '@core/observables/accountAddressName'
import { ExchangeRateMap } from '@core/services/exchange-rates'
import {
  arrayDecoder,
  arrayEncoder,
  booleanDecoder,
  booleanEncoder,
  jsonDecoder,
  jsonEncoder,
  LocalStorageService,
  stringDecoder,
  stringEncoder,
} from '@core/services/window-storage/local-storage'
import { provider$ } from '@core/web3/provider'
import { isSameEthereumAddress } from '@core/web3/utils'

export const yotiDocScanSessionIdLocalStorage = new LocalStorageService<
  string | null
>('yotiDocScanSessionID', stringEncoder(), stringDecoder(null))
export const useYotiDocScanSessionIdLocalStorage = () =>
  useWindowStorage(yotiDocScanSessionIdLocalStorage)

export const polygonInfoShowOnReloadLocalStorage =
  new LocalStorageService<boolean>(
    'show-polygon-info-on-reload',
    booleanEncoder(),
    booleanDecoder(false),
  )

export const flashLocalStorage = new LocalStorageService<AlertSkeleton[]>(
  'FLASH',
  arrayEncoder(),
  arrayDecoder([]),
)

export const lastSavedAmountKeyLocalStorage = new LocalStorageService<
  string | null
>('Swarm.Vouchers.LastSavedAmount', stringEncoder(), stringDecoder(null))

export const primaryExchangeRatesLocalStorage =
  new LocalStorageService<ExchangeRateMap | null>(
    'exchange-rates',
    jsonEncoder(),
    jsonDecoder(null),
  )

export const polygonExchangeRatesLocalStorage =
  new LocalStorageService<ExchangeRateMap | null>(
    'exchange-rates-polygon',
    jsonEncoder(),
    jsonDecoder(null),
  )

export const cachedAccountAddressNamesLocalStorage =
  new LocalStorageService<CachedAccountAddresssNames>(
    'accountsAddressNames',
    jsonEncoder(),
    jsonDecoder({}),
  )

export const cachedWalletLocalStorage = new LocalStorageService<string | null>(
  'SELECTED_WALLET',
  stringEncoder(),
  stringDecoder(null),
)

export const walletConnectLocalStorage = new LocalStorageService<unknown>(
  'walletconnect',
  jsonEncoder(),
  jsonDecoder(null),
)

export const polygonInfoLocalStorage = new LocalStorageService<boolean>(
  'polygon-info-popup-do-not-show-again',
  booleanEncoder(),
  booleanDecoder(false),
)

export const usePolygonInfoLocalStorage = () =>
  useWindowStorage(polygonInfoLocalStorage)

export const termsAndAgreementsStorage = new LocalStorageService<boolean>(
  'terms-and-agreements-accepted',
  booleanEncoder(),
  booleanDecoder(false),
)

export const useTermsAndAgreementsStorage = () =>
  useWindowStorage(termsAndAgreementsStorage)

export const transactionsLocalStorage = new LocalStorageService<Transaction[]>(
  'pending-transactions',
  arrayEncoder(),
  arrayDecoder([]),
  async (txs) => {
    const recentTxs = txs.filter(
      (tx) => differenceInHours(Date.now(), tx.timestamp) >= 24,
    )

    const transactionResponses = await Promise.all(
      recentTxs.map((tx) => provider$.getValue().getTransaction(tx.id)),
    )

    return recentTxs.filter(
      (_, idx) => transactionResponses[idx].confirmations === 0,
    )
  },
)

export const useTransactionsLocalStorage = (account?: string) => {
  const { value, setValue, removeValue } = useWindowStorage(
    transactionsLocalStorage,
  )

  const filteredValue = useMemo(() => {
    if (account) {
      return value.filter((tx) =>
        isSameEthereumAddress(tx.userAddress?.id, account),
      )
    }

    return value
  }, [account, value])

  return useMemo(
    () => ({
      value: filteredValue,
      setValue,
      removeValue,
    }),
    [filteredValue, removeValue, setValue],
  )
}

export const affiliateProgramLocalStorage = new LocalStorageService<
  Record<string, string | undefined | null>
>('Swarm.affiliateProgram', jsonEncoder(), jsonDecoder({}))

export const ttdIdLocalStorage = new LocalStorageService<string | null>(
  'ttd_id',
  stringEncoder(),
  stringDecoder(null),
)
