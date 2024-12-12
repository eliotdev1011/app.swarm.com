import get from 'lodash/get'

export function prop<T>(path: string) {
  return (object: T) => get(object, path)
}
