import { BehaviorSubject, from, Observable, switchMap } from 'rxjs'

export const toBehaviorSubject = <T, I = undefined>(
  observable: Observable<T>,
  init: I,
) => {
  const subject = new BehaviorSubject<T | I>(init)

  observable.subscribe(subject)

  return subject
}

export const toPromise = <T, R = void>(
  observable: Observable<T>,
  handler: (
    value: T,
    resolve: (value: R | PromiseLike<R>) => void,
    reject: (reason?: unknown) => void,
  ) => void,
) => {
  let resolve: (value: R | PromiseLike<R>) => void
  let reject: (reason?: unknown) => void

  const deferred = new Promise<R>((deferredResolve, deferredReject) => {
    resolve = deferredResolve
    reject = deferredReject
  })

  const subscription = observable.subscribe((val) => {
    handler(val, resolve, reject)
  })

  deferred.then(() => subscription.unsubscribe())

  return deferred
}

export const waitUntil = async <T>(
  observable: Observable<T>,
  predicate: (value: T) => boolean,
) =>
  toPromise<T, T>(observable, (val, resolve) => {
    if (predicate(val)) {
      resolve(val)
    }
  })

export const waitForValue = async <T>(
  observable: Observable<T>,
  value: T,
  compare: (a: unknown, b: unknown) => boolean = (a: unknown, b: unknown) =>
    a === b,
) => waitUntil(observable, (val) => compare(val, value))

export const fromAsync = <T>(asyncFunc: () => Promise<Observable<T>>) =>
  from(asyncFunc()).pipe(switchMap((ob) => ob))
