import { useErc20, UseErc20Return } from './useErc20'
import useNativeSmt from './useNativeSmt'

export const useSmt = (): UseErc20Return => {
  const { nativeSmt, loading: smtLoading } = useNativeSmt()

  const smtAddress = nativeSmt?.id
  const smt = useErc20(smtAddress)
  return {
    ...smt,
    ...nativeSmt,
    loading: smtLoading || smt.loading || smtLoading,
  }
}
