import { HasBalance, HasType, NativeToken } from '@swarm/types/tokens'
import { useMemo } from 'react'

import { getCurrentConfig } from '@core/observables/configForNetwork'
import useTokensForOwner from '@core/services/alchemy/useTokensForOwner'
import { TokenType } from '@core/shared/enums'
import { useAccount } from '@core/web3'

type NativeSmt = NativeToken & HasType & HasBalance

const { smtAddress } = getCurrentConfig()

const useNativeSmt = () => {
  const account = useAccount()

  const { tokens, loading } = useTokensForOwner({
    account,
    initialFilter: {
      includeTokens: smtAddress ? [smtAddress] : [],
    },
  })

  const nativeSmt = useMemo<NativeSmt | null>(() => {
    return loading || !tokens.length
      ? null
      : { ...tokens[0], type: TokenType.erc20 }
  }, [tokens, loading])

  return { nativeSmt, loading }
}

export default useNativeSmt
