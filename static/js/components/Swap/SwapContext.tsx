import useDeepMemo from '@swarm/core/hooks/memo/useDeepMemo'
import useSwaps, {
  DEFAULT_DATE_FROM,
  INITIAL_SWAP_QUERY_RESULT,
  SwapsQueryResult,
} from '@swarm/core/hooks/pool/useSwaps'
import { propEquals } from '@swarm/core/shared/utils/collection'
import {
  isNativeToken,
  isWrappedNativeToken,
} from '@swarm/core/shared/utils/tokens/filters'
import { useAccount } from '@swarm/core/web3'
import { SwapPair, SwapTxSettings } from '@swarm/types'
import { ExtendedNativeToken } from '@swarm/types/tokens'
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  DecodedValueMap,
  NumberParam,
  QueryParamConfig,
  StringParam,
  useQueryParams,
} from 'use-query-params'

import { defaultSettings } from 'src/shared/consts/swap-settings'
import { getStoredSettings } from 'src/shared/utils/swap-settings'

import useSwapTokens from './Assets/SwapForm/useSwapTokens'

type SwapQueryStringValues = {
  tokenIn: QueryParamConfig<string | null | undefined>
  tokenOut: QueryParamConfig<string | null | undefined>
  amountOut: QueryParamConfig<number | null | undefined>
}

export interface SwapContextType {
  tokenIn?: ExtendedNativeToken
  tokenOut?: ExtendedNativeToken
  setTokenPair: (pair: SwapPair) => void
  settings: SwapTxSettings
  setSwapSettings: (newSettings: SwapTxSettings) => void
  swaps: SwapsQueryResult
  xTokenPair?: [string, string]
  queryParams: DecodedValueMap<SwapQueryStringValues>
  fullTokens: ExtendedNativeToken[]
  reloadTokens: () => Promise<void>
  loading: boolean
  balancesLoading: boolean
  initiated: boolean
}

const SwapContext = createContext<SwapContextType>({
  setTokenPair: () => {},
  setSwapSettings: () => {},
  settings: defaultSettings,
  swaps: INITIAL_SWAP_QUERY_RESULT,
  queryParams: {
    tokenIn: undefined,
    tokenOut: undefined,
    amountOut: undefined,
  },
  fullTokens: [],
  reloadTokens: async () => {},
  loading: false,
  balancesLoading: false,
  initiated: false,
})

export const useSwapContext = () => useContext(SwapContext)

export const SwapContextProvider = ({ children }: { children: ReactNode }) => {
  const account = useAccount()

  const {
    fullTokens,
    reloadTokens,
    loading: tokensLoading,
    balancesLoading,
  } = useSwapTokens()

  const [initiated, setInitiated] = useState(false)
  const [settings, setSwapSettings] = useState<SwapTxSettings>(() =>
    getStoredSettings(),
  )

  const [queryParams, setQueryParams] = useQueryParams<SwapQueryStringValues>({
    tokenIn: StringParam,
    tokenOut: StringParam,
    amountOut: NumberParam,
  })

  const { tokenIn, tokenOut } = useMemo(() => {
    if (!initiated) {
      return {}
    }

    return {
      tokenIn:
        fullTokens.find(propEquals('id', queryParams.tokenIn)) || fullTokens[0],
      tokenOut: fullTokens.find(propEquals('id', queryParams.tokenOut)),
    }
  }, [fullTokens, initiated, queryParams.tokenIn, queryParams.tokenOut])

  const xTokenPair: [string, string] | undefined = useDeepMemo(() => {
    if (tokenIn?.xToken?.id && tokenOut?.xToken?.id) {
      return [tokenIn.xToken.id, tokenOut.xToken.id].sort() as [string, string]
    }

    return undefined
  }, [tokenIn?.xToken?.id, tokenOut?.xToken?.id])

  const setTokenPair = useCallback(
    (pair: SwapPair) => {
      if (!initiated) {
        return
      }

      const matchingTokenIn = pair.tokenInAddress
        ? fullTokens.find(propEquals('address', pair.tokenInAddress))
        : undefined
      const matchingTokenOut = pair.tokenOutAddress
        ? fullTokens.find(propEquals('address', pair.tokenOutAddress))
        : undefined

      if (matchingTokenIn !== undefined) {
        if (matchingTokenOut !== undefined) {
          setQueryParams({
            tokenIn: matchingTokenIn.id,
            tokenOut: matchingTokenOut?.id,
          })

          return
        }

        if (isNativeToken(matchingTokenIn)) {
          const newTokenOut = fullTokens.find(isWrappedNativeToken)

          setQueryParams({
            tokenIn: matchingTokenIn.id,
            tokenOut: newTokenOut?.id,
          })

          return
        }

        setQueryParams({
          tokenIn: matchingTokenIn.id,
          tokenOut: tokenOut?.id,
        })
      }

      if (matchingTokenOut !== undefined) {
        if (isNativeToken(matchingTokenOut)) {
          const newTokenIn = fullTokens.find(isWrappedNativeToken)

          setQueryParams({
            tokenIn: newTokenIn?.id,
            tokenOut: matchingTokenOut.id,
          })

          return
        }

        setQueryParams({
          tokenIn: tokenIn?.id,
          tokenOut: matchingTokenOut.id,
        })
      }
    },
    [fullTokens, initiated, setQueryParams, tokenIn?.id, tokenOut?.id],
  )

  const swaps = useSwaps(
    useMemo(
      () => ({
        tokens: xTokenPair,
        userAddress: account,
        dateFrom: DEFAULT_DATE_FROM,
        limit: 3,
        ignore: !account,
      }),
      [account, xTokenPair],
    ),
  )

  useEffect(() => {
    if (!tokensLoading && !balancesLoading && !initiated) {
      setInitiated(true)
    }
  }, [balancesLoading, initiated, tokensLoading])

  const value = useMemo(() => {
    return {
      tokenIn,
      tokenOut,
      setTokenPair,
      settings,
      setSwapSettings,
      swaps,
      xTokenPair,
      queryParams,
      fullTokens,
      reloadTokens: async () => {
        await reloadTokens()
      },
      loading: tokensLoading,
      balancesLoading,
      initiated,
    }
  }, [
    tokenIn,
    tokenOut,
    setTokenPair,
    settings,
    swaps,
    xTokenPair,
    queryParams,
    fullTokens,
    tokensLoading,
    balancesLoading,
    initiated,
    reloadTokens,
  ])

  return <SwapContext.Provider value={value}>{children}</SwapContext.Provider>
}
