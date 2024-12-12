export const unifyKeyValueObj = (obj: Record<string, string>) => {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key.toLowerCase(),
      value.toLowerCase(),
    ]),
  )
}
