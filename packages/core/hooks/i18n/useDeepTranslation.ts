import { useTranslation, UseTranslationOptions } from 'react-i18next'

const useDeepTranslation = (
  ns: string,
  chain: string[] = [],
  options?: UseTranslationOptions,
) => {
  return useTranslation(ns, { ...options, keyPrefix: chain.join('.') })
}

export default useDeepTranslation
