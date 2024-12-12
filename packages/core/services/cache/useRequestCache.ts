import createCache from '@core/services/cache/CacheContext'

const { useCache, provider } = createCache()

const useRequestCache = <T>(
  url: string,
  dataHandler?: (res: T) => any,
  init?: RequestInit | undefined,
) =>
  useCache(url, async () => {
    const res = await fetch(url, init)
    const json = await res.json()
    if (dataHandler) {
      const resultToCache = dataHandler(json)
      return resultToCache
    }
    return json
  })

export { useRequestCache, provider as RequestCacheProvider }
