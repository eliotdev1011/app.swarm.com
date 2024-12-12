import {
  extract,
  isEqualCaseInsensitive,
  Iteratee,
} from '@core/shared/utils/lodash'

export const propEquals =
  <
    // eslint-disable-next-line @typescript-eslint/ban-types
    T extends object,
    U extends unknown = string,
  >(
    path: Iteratee<T, U>,
    value: U,
    caseSensitive = false,
  ) =>
  (item: T) => {
    const val = extract(item, path)

    return caseSensitive ? val === value : isEqualCaseInsensitive(val, value)
  }

export const propNotEqual =
  <
    // eslint-disable-next-line @typescript-eslint/ban-types
    T extends object,
    U extends unknown = string,
  >(
    path: Iteratee<T, U>,
    value: U,
    caseSensitive = false,
  ) =>
  (item: T) => {
    const val = extract(item, path)

    return caseSensitive ? val !== value : !isEqualCaseInsensitive(val, value)
  }

export const propIn =
  <
    // eslint-disable-next-line @typescript-eslint/ban-types
    T extends object,
    U extends unknown = string,
  >(
    path: Iteratee<T, U>,
    value: U[],
    caseSensitive = false,
  ) =>
  (item: T) => {
    const val = extract(item, path)

    return value.some((v) =>
      caseSensitive ? val === v : isEqualCaseInsensitive(val, v),
    )
  }

export const propNotIn =
  <
    // eslint-disable-next-line @typescript-eslint/ban-types
    T extends object,
    U extends unknown = string,
  >(
    path: Iteratee<T, U>,
    value: U[],
    caseSensitive = false,
  ) =>
  (item: T) => {
    const val = extract(item, path)

    return value.every((v) =>
      caseSensitive ? val !== v : !isEqualCaseInsensitive(val, v),
    )
  }
