import { combineLatest, defer, EMPTY, from, of } from 'rxjs'
import { delay, expand, switchMap, withLatestFrom } from 'rxjs/operators'

const repeat = async <T = unknown>(
  callback: (stop: (value?: T) => void, repetition: number) => Promise<T>,
  interval: number,
  count?: number,
) =>
  new Promise((resolve, reject) => {
    let shouldStop = false

    const stop = (value?: T) => {
      shouldStop = true
      resolve(value)
    }

    const execute = async (counter: number) => {
      let value
      try {
        value = await callback(stop, counter)
      } catch {
        stop()
        reject()
      }

      return value
    }

    defer(async () => execute(0))
      .pipe(
        withLatestFrom(of(0)),
        expand(([result, counter]) => {
          if (shouldStop) {
            return EMPTY
          }

          if (count !== undefined && counter >= count) {
            stop(result)
            return EMPTY
          }

          return of(0).pipe(
            delay(interval),
            switchMap(() =>
              combineLatest([from(execute(counter + 1)), of(counter + 1)]),
            ),
          )
        }),
      )
      .subscribe()
  })

export default repeat
