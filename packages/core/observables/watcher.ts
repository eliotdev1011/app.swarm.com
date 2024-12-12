import { createWatcher } from '@makerdao/multicall'
import isEqual from 'fast-deep-equal'
import _map from 'lodash/map'
import difference from 'lodash/difference'
import sortBy from 'lodash/sortBy'
import { BehaviorSubject, concat, fromEvent, of, Subject, timer } from 'rxjs'
import {
  bufferToggle,
  concatMap,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  pairwise,
  repeat,
  scan,
  shareReplay,
  skip,
} from 'rxjs/operators'

import { getBalanceCacheKey } from '@core/services/cache/utils'
import { captureException } from '@core/services/sentry'
import { INITIAL_POLL_INTERVAL, POLL_INTERVAL } from '@core/shared/consts'
import { propEquals, propNotIn } from '@core/shared/utils/collection'
import { toBehaviorSubject, waitForValue } from '@core/shared/utils/helpers'
import { account$, readyState$ } from '@core/web3'

import configForNetwork$, { getCurrentConfig } from './configForNetwork'

const getKey = (call: Call) => call.returns[0][0]

interface Call {
  target?: string
  call: [string, ...unknown[]]
  returns: [[string, ...unknown[]]]
}

interface Update<T = unknown> {
  type: string
  value: T
}

type BalanceUpdate<T> = {
  address: string
  tokenId?: string
  account: string
  value: T
}

interface WatcherConfig {
  rpcUrl: string
  multicallAddress: string
}

interface WatcherConfigs {
  rpcUrl: string
  multicallAddress: string
  interval: number
  errorRetryWait: number
}

interface Watcher {
  tap: (tapper: (calls: Call[]) => Call[]) => Promise<void>
  start: () => Promise<void>
  stop: () => Promise<void>
  batch: () => {
    subscribe: <T = unknown>(
      subscriber: (updates: Update<T>[]) => void,
    ) => { unsub: () => void }
  }
  recreate: (calls: Call[], config: WatcherConfig) => Promise<unknown>
  onNewBlock: (subscriber: (newBlockNumber: number) => void) => void
  subscribe: <T = unknown>(
    subscriber: (updates: Update<T>) => void,
  ) => { unsub: () => void }
  awaitInitialFetch: () => Promise<unknown>
  unsub?: () => void
  onError: (listener: (err: Error) => void) => void
  schemas: Call[]
}

export const watcherReady$ = new BehaviorSubject<Promise<Watcher> | null>(null)

let updateTypes: string[] = []

const cacheSrc = new BehaviorSubject<Update[] | null>([])

const cache = cacheSrc.pipe(
  distinctUntilChanged(isEqual),
  scan((acc, curr) => {
    if (curr === null) {
      return []
    }

    return sortBy(
      acc.filter(propNotIn('type', _map(curr, 'type'))).concat(curr),
      'type',
    )
  }, [] as Update[]),
  distinctUntilChanged<Update[]>(isEqual),
  shareReplay(1),
)

const calls$ = new Subject<Call>()

/**
 * Emit INITIAL_POLL_INTERVAL five times within an interval of INITIAL_POLL_INTERVAL
 * then emit POLL_INTERVAL within an interval of POLL_INTERVAL
 */

const dynamicPollInterval$ = concat(
  of(INITIAL_POLL_INTERVAL).pipe(
    repeat({ count: 4, delay: () => timer(INITIAL_POLL_INTERVAL) }),
  ),
  of(POLL_INTERVAL).pipe(repeat({ delay: () => timer(POLL_INTERVAL) })),
)

const throttledCalls$ = toBehaviorSubject(
  calls$.pipe(
    bufferToggle(dynamicPollInterval$, timer),
    filter((arr) => !!arr.length),
  ),
  [],
)

const getConfigForNetwork = (
  { rpcUrl, multicallAddress } = getCurrentConfig(),
) => ({
  rpcUrl,
  multicallAddress,
  interval: POLL_INTERVAL,
  errorRetryWait: POLL_INTERVAL,
})

/**
 * If watcher exists, recreate it. Otherwise, create it.
 *
 * @param options
 * @returns Promise<Watcher>
 */
const createWatcherInstance = async (options?: Partial<WatcherConfigs>) => {
  const initialCalls = throttledCalls$.getValue()
  const configs = { ...getConfigForNetwork(), ...options }
  const existingWatcher = await watcherReady$.getValue()

  if (existingWatcher) {
    await existingWatcher.recreate(initialCalls, configs)
    return existingWatcher
  }

  const watcher = createWatcher(initialCalls, configs) as Watcher

  configForNetwork$.pipe(skip(1)).subscribe(() => {
    const freshInitialCalls = throttledCalls$.getValue()
    const freshConfigs = { ...getConfigForNetwork(), ...options }

    watcher.recreate(freshInitialCalls, freshConfigs)
  })

  await waitForValue(readyState$, true)

  await watcher.start()

  await watcher.awaitInitialFetch()

  watcher.onError((err) => {
    const throttledCalls = throttledCalls$.getValue() as Call[]
    const removeCallsTypes = throttledCalls.map((call) => call.returns[0][0])
    const refetchCallsTypes = throttledCalls.slice(1)

    if (removeCallsTypes) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      removeCalls(...removeCallsTypes) // Exclude first failed call from future requests
    }
    const updates = cacheSrc.getValue() as Update[]
    const type = throttledCalls[0]?.returns?.[0]?.[0]

    if (type) {
      cacheSrc.next([
        ...updates,
        {
          type,
          value: null, // null is repesenting no data for this call
        },
      ])
    }

    captureException(err, {
      extra: {
        calls: throttledCalls$.getValue(),
      },
    })

    if (refetchCallsTypes.length) {
      // Update valid calls which will re-initialize batch request
      throttledCalls$.next(refetchCallsTypes)
    }
  })

  account$.pipe(skip(1), pairwise()).subscribe(([oldAccount]) => {
    if (oldAccount) {
      watcher.tap((calls) =>
        calls.filter(
          (call) =>
            !getKey(call)?.toLowerCase().includes(oldAccount?.toLowerCase()),
        ),
      )

      const updates = cacheSrc.getValue()

      const affectedUpdates =
        (updates?.filter(
          (update) =>
            !update.type.toLowerCase().includes(oldAccount?.toLowerCase()),
        ) as Update[]) || []

      const unaffectedUpdates =
        (updates?.filter((update) =>
          update.type.toLowerCase().includes(oldAccount?.toLowerCase()),
        ) as Update[]) || []

      cacheSrc.next([
        ...unaffectedUpdates,
        ...affectedUpdates.map((update) => ({
          ...update,
          value: null,
        })),
      ])
    }
  })

  return watcher
}

const getWatcher = async () => {
  const watcher = await watcherReady$.getValue()

  if (!watcher) {
    watcherReady$.next(
      createWatcherInstance({ interval: INITIAL_POLL_INTERVAL }),
    )

    // Recreate watcher when dynamicPollInterval changes
    dynamicPollInterval$
      .pipe(
        skip(1),
        distinctUntilChanged(),
        concatMap((pollInterval) =>
          createWatcherInstance({ interval: pollInterval }),
        ),
      )
      .subscribe()

    fromEvent(document, 'visibilitychange').subscribe(async () => {
      const currentWatcher = await watcherReady$.getValue()

      if (currentWatcher) {
        if (document.visibilityState === 'hidden') {
          currentWatcher.stop()
        } else {
          await currentWatcher.start()
        }
      }
    })
  }

  return watcherReady$.getValue() as Promise<Watcher>
}

throttledCalls$.subscribe(async (newCalls: Call[]) => {
  const watcher = await getWatcher()

  await watcher.tap((prevCalls) => {
    return [...prevCalls, ...newCalls]
  })

  if (watcher.unsub) {
    watcher.unsub()
  }
  const { unsub } = watcher
    .batch()
    .subscribe((updates) => cacheSrc.next(updates))

  watcher.unsub = unsub
})

const addCalls = async (...calls: Call[]) => {
  const newCalls = calls.filter(propNotIn(getKey, updateTypes))

  if (newCalls.length) {
    updateTypes = updateTypes.concat(_map(newCalls, getKey))

    newCalls.forEach((newCall) => calls$.next(newCall))
  }
}

export const removeCalls = async (...types: string[]) => {
  const watcher = await getWatcher()

  updateTypes = difference(updateTypes, types)

  await watcher.tap((prevCalls) => prevCalls.filter(propNotIn(getKey, types)))

  if (watcher.unsub) {
    watcher.unsub()
  }

  const { unsub } = watcher
    .batch()
    .subscribe((updates) => cacheSrc.next(updates))

  watcher.unsub = unsub
}

export function observeCall(
  call: [string, ...unknown[]],
  type: string,
  target?: string,
) {
  addCalls({
    target,
    call,
    returns: [[type]],
  })

  return cache.pipe(
    map((updates) => updates.find(propEquals('type', type))?.value),
    distinctUntilChanged(isEqual),
  )
}

export const refresh = async () => {
  const watcher = await watcherReady$.getValue()

  watcher?.stop()
  watcher?.start()

  return watcher?.awaitInitialFetch()
}

export const invalidateKeys = (...keys: string[]) => {
  const prevUpdates = cacheSrc.getValue()

  if (prevUpdates) {
    cacheSrc.next(
      prevUpdates.map((update) =>
        keys.includes(update.type) ? { ...update, value: null } : update,
      ),
    )
  }
}

const updateKeys = (updates: Update[]) => {
  const prevUpdates = cacheSrc.getValue() || []

  const updatesMap = new Map(prevUpdates.map((update) => [update.type, update]))
  // Apply new updates
  updates.forEach(({ type, value }) => {
    updatesMap.set(type, { type, value })
  })

  cacheSrc.next(Array.from(updatesMap.values()))
}

const balanceUpdateSubject = new Subject<Update[]>()

balanceUpdateSubject
  .pipe(
    scan(
      // Debounce and batch the balance updates before updating cacheSrc
      (allUpdates, currentUpdates) => [...allUpdates, ...currentUpdates],
      [] as Update[],
    ),
    debounceTime(100),
  )
  .subscribe((updates) => {
    updateKeys(updates)
  })

/**
 * Updates the balance key and emits the new balance update.
 *
 * This function should be used only in cases where it is necessary to overwrite or update the state of balances.
 * It constructs an update object containing the type (derived from account, address, and tokenId) and value.
 * This update object is then emitted through the balanceUpdateSubject.
 *
 * @param balanceUpdate - An object containing the account, address, tokenId, and value to update the balance key with.
 * @typeparam T - The type of the value, defaulting to Big.Big.
 */
export const updateBalanceKey = <T = Big.Big>(
  balanceUpdate: BalanceUpdate<T>,
) => {
  const { account, address, tokenId, value } = balanceUpdate
  const update = {
    type: getBalanceCacheKey(account, address, tokenId),
    value,
  }
  balanceUpdateSubject.next([update])
}
