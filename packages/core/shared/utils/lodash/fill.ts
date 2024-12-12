import { GetFieldType } from './get'

export const fill = <T, Path extends string>(
  collection: T[],
  prop: Path,
  valueOrSetter: GetFieldType<T, Path> | ((item: T) => GetFieldType<T, Path>),
): T[] => {
  if (valueOrSetter instanceof Function) {
    return collection.map((item) => ({
      ...item,
      [prop]: valueOrSetter(item),
    }))
  }

  return collection.map((item) => ({
    ...item,
    [prop]: valueOrSetter,
  }))
}
