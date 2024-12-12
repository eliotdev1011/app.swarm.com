import { extract, Iteratee } from '@core/shared/utils/lodash'
import identity from 'lodash/identity'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapBy = <T, Value extends (el: T) => any>(
  arr: T[],
  path: Iteratee<T, string>,
  value?: Value,
): Map<string, Value extends undefined ? T : ReturnType<Value>> => {
  const extractValue = value ?? identity

  return new Map(
    arr.map((el) => [(extract(el, path) as string).toLowerCase(), extractValue(el)]),
  )
}
