import { useCpk } from '@swarm/core/contracts/cpk'
import useNativeTokens from '@swarm/core/hooks/data/useNativeTokens'
import { NATIVE_ETH, NATIVE_MATIC } from '@swarm/core/shared/consts'
import { POLL_INTERVAL } from '@swarm/core/shared/consts/time'
import {
  excludeDOTCTokensFilter,
  getTokensFilter,
} from '@swarm/core/shared/subgraph'
import { isPolygon } from '@swarm/core/shared/utils/config'
import { balancesLoading } from '@swarm/core/shared/utils/tokens/balance'
import {
  injectContract,
  injectCpkAllowance,
  injectExchangeRate,
  injectTokenBalance,
  injectUserBalances,
  injectXTokenCpkBalance,
  useInjections,
} from '@swarm/core/shared/utils/tokens/injectors'
import { useAccount, useNetwork, useReadyState } from '@swarm/core/web3'
import { ExtendedNativeToken } from '@swarm/types/tokens'
import { useMemo } from 'react'

const getAddedTokens = (networkId: number): ExtendedNativeToken[] =>
  isPolygon(networkId)
    ? [
        {
          userBalances: {
            usd: 0,
            native: 0,
          },
          ...NATIVE_MATIC,
        },
      ]
    : [
        {
          userBalances: {
            usd: 0,
            native: 0,
          },
          ...NATIVE_ETH,
        },
      ]

const useSwapTokens = () => {
  const { networkId } = useNetwork()
  const account = useAccount()
  const cpk = useCpk()
  const ready = useReadyState()

  const {
    nativeTokens,
    loading: tokensLoading,
    refetch: reloadTokens,
  } = useNativeTokens<ExtendedNativeToken>({
    skip: !ready,
    variables: {
      filter: getTokensFilter('Token', {
        isLPT: false,
        paused: false,
        ...excludeDOTCTokensFilter(),
      }),
      includePoolTokens: true,
    },
    pollInterval: POLL_INTERVAL,
  })

  const addedTokens = useMemo(() => getAddedTokens(networkId), [networkId])

  const fullTokens = useInjections<ExtendedNativeToken>(
    useMemo(
      () => [...nativeTokens, ...addedTokens],
      [addedTokens, nativeTokens],
    ),
    useMemo(
      () => [
        injectContract(),
        injectExchangeRate(),
        injectTokenBalance(account),
        injectTokenBalance(cpk?.address, 'cpkBalance'),
        injectUserBalances(account),
        injectCpkAllowance(account),
        injectXTokenCpkBalance(cpk?.address),
      ],
      [account, cpk?.address],
    ),
  )

  return {
    fullTokens,
    reloadTokens,
    loading: !ready || tokensLoading,
    balancesLoading: balancesLoading(fullTokens, account),
  }
}

export default useSwapTokens
