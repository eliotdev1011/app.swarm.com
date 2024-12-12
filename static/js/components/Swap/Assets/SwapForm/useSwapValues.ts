import useAsyncMemo from '@swarm/core/hooks/async/useAsyncMemo'
import { getCurrentConfig } from '@swarm/core/observables/configForNetwork'
import { swapFeeToProtocolFee } from '@swarm/core/shared/utils/calculations/pool-calc'
import {
  big,
  denormalize,
  normalize,
} from '@swarm/core/shared/utils/helpers/big-helpers'
import { SwapTxSettings } from '@swarm/types'
import { ExtendedNativeToken } from '@swarm/types/tokens'
import SwapRouter, {
  SwapError,
  SwapTxType,
} from '@swarmmarkets/smart-order-router'
import { BigSource } from 'big.js'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryParam } from 'use-query-params'

import { NativeTokenWrapper } from 'src/contracts/NativeTokenWrapper'
import { transformSwapToken } from 'src/shared/utils/swap/transform-swap-token'

import { SwapOptimisationStrategy } from './OptimizationSwitch'
import {
  matchIsUnwrappingNativeToken,
  matchIsWrappingNativeToken,
} from './utils'

interface SwapValues {
  amountIn: number
  amountOut: number
}

const DefaultSwapValues: SwapValues = {
  amountIn: 0,
  amountOut: 0,
}

const emptySwapRoute = {
  swaps: [],
  totalReturn: 0,
  totalSwapLimitInput: 0,
  totalSwapFeeAmount: 0,
  totalAvailableReturnAmount: 0,
  swapStrategiesDiff: null,
  swapPrice: 0,
  error: null,
}

const MAX_NUMBER_OF_POOLS = 5

const useSwapValues = (
  tokenIn: ExtendedNativeToken | undefined,
  tokenOut: ExtendedNativeToken | undefined,
  // eslint-disable-next-line @typescript-eslint/default-param-last
  swapType: SwapTxType = SwapTxType.exactIn,
  settings: SwapTxSettings | undefined,
  // eslint-disable-next-line @typescript-eslint/default-param-last
  isProtocolFeePaid = false,
  optimizationStrategy: SwapOptimisationStrategy,
  initialValue: SwapValues = DefaultSwapValues,
) => {
  const { swapRouter, error: routerError } = useMemo(() => {
    if (tokenIn && tokenOut && tokenIn.xToken && tokenOut.xToken) {
      const tIn = transformSwapToken(tokenIn)
      const tOut = transformSwapToken(tokenOut)

      try {
        const router = new SwapRouter(tIn, tOut, MAX_NUMBER_OF_POOLS)
        return { swapRouter: router, error: null }
      } catch (e) {
        if (e instanceof SwapError) {
          return { swapRouter: null, error: e.hash }
        }
        throw e // re-throw the error unchanged
      }
    }

    return { swapRouter: null, error: null }
  }, [tokenIn, tokenOut])

  const { t } = useTranslation('errors')
  const [, setAmountOutValue] = useQueryParam<string | undefined>('amountOut')

  const isWrappingNativeToken = matchIsWrappingNativeToken(tokenIn, tokenOut)
  const isUnwrappingNativeToken = matchIsUnwrappingNativeToken(
    tokenIn,
    tokenOut,
  )

  const [{ amountIn, amountOut }, setValues] =
    useState<SwapValues>(initialValue)

  const swapAmount = useMemo<BigSource>(() => {
    if (swapType === SwapTxType.exactIn) {
      return denormalize(amountIn, tokenIn?.decimals).toString()
    }

    return denormalize(amountOut, tokenOut?.decimals).toString()
  }, [swapType, tokenIn?.decimals, tokenOut?.decimals, amountIn, amountOut])

  const {
    swaps,
    totalReturn,
    totalSwapFeeAmount,
    totalSwapLimitInput,
    totalAvailableReturnAmount,
    error: swapRouteError,
    swapStrategiesDiff,
    swapPrice,
  } = useMemo(() => {
    if (isWrappingNativeToken || isUnwrappingNativeToken) {
      return {
        swaps: [], // no swaps required as we hit directly the wrapping contract
        totalReturn: swapAmount, // swap amount and totalReturn are 1:1 as there is no fee
        totalSwapFeeAmount: 0, // no fees for wrapping / unwrapping native tokens
        totalSwapLimitInput: 0, // there is no limit based on pool liquidity as we don't use pools for wrapping / unwrapping native tokens
        totalAvailableReturnAmount: swapAmount, // swap amount and totalAvailableReturnAmount are 1:1 as there is no fee
        error: null,
        swapStrategiesDiff: null,
        swapPrice: 1,
      }
    }

    if (swapRouter) {
      try {
        const { shortestRoute, bestSpotPriceRoute, routesDiff } =
          swapRouter.getOptimizedRoutes(swapType, swapAmount)

        const successfulResponse = {
          error: null,
          swapStrategiesDiff: routesDiff,
        }

        if (
          routesDiff !== null &&
          optimizationStrategy === SwapOptimisationStrategy.price
        ) {
          return { ...bestSpotPriceRoute, ...successfulResponse }
        }

        return { ...shortestRoute, ...successfulResponse }
      } catch (e) {
        if (e instanceof SwapError) {
          return { ...emptySwapRoute, error: e.hash }
        }

        throw e // re-throw the error unchanged
      }
    } else {
      return emptySwapRoute
    }
  }, [
    swapRouter,
    optimizationStrategy,
    swapAmount,
    swapType,
    isWrappingNativeToken,
    isUnwrappingNativeToken,
  ])

  const [protocolFee] = useAsyncMemo<BigSource>(
    async () => {
      if (isWrappingNativeToken || isUnwrappingNativeToken) {
        return 0
      }

      const denormAmountIn = denormalize(amountIn, tokenIn?.decimals)
      const bigProtocolFee = await swapFeeToProtocolFee(
        denormAmountIn,
        totalSwapFeeAmount,
      )

      return bigProtocolFee.toFixed(0)
    },
    0,
    [
      isWrappingNativeToken,
      isUnwrappingNativeToken,
      tokenIn?.decimals,
      amountIn,
      totalSwapFeeAmount,
    ],
  )

  const [maxAmountIn] = useAsyncMemo<number>(
    async () => {
      const denormTokenInBalance = denormalize(
        tokenIn?.balance || 0,
        tokenIn?.decimals,
      )

      if (isWrappingNativeToken || isUnwrappingNativeToken) {
        return normalize(denormTokenInBalance, tokenIn?.decimals).toNumber()
      }

      try {
        if (swapRouter) {
          const exactInLimits =
            swapRouter.getExactInLimits(denormTokenInBalance)

          if (isProtocolFeePaid) {
            const bigProtocolFee = await swapFeeToProtocolFee(
              exactInLimits.totalSwapLimitInput,
              exactInLimits.totalSwapFeeAmount,
            )

            return normalize(
              big(exactInLimits.totalSwapLimitInput).minus(bigProtocolFee),
              tokenIn?.decimals,
            ).toNumber()
          }

          return normalize(
            exactInLimits.totalSwapLimitInput,
            tokenIn?.decimals,
          ).toNumber()
        }

        return 0
      } catch {
        return 0
      }
    },
    0,
    [
      swapRouter,
      tokenIn,
      isWrappingNativeToken,
      isUnwrappingNativeToken,
      isProtocolFeePaid,
    ],
  )

  const [maxNativeTokenAmountIn, setMaxNativeTokenAmountIn] =
    useState<number>(0)

  const updateMaxNativeTokenAmountIn = useCallback<
    () => Promise<void>
  >(async () => {
    if (maxAmountIn === 0) {
      setMaxNativeTokenAmountIn(0)
      return
    }

    const networkConfig = getCurrentConfig()

    const nativeTokenWrapper = new NativeTokenWrapper(
      networkConfig.nativeTokenWrapperAddress,
    )

    const depositGasFeePriceEstimate =
      await nativeTokenWrapper.getDepositGasFeePriceEstimate(maxAmountIn)

    const normalizedDepositGasFeePriceEstimate = normalize(
      depositGasFeePriceEstimate.toString(),
      tokenIn?.decimals,
    ).toNumber()

    setMaxNativeTokenAmountIn(
      maxAmountIn - normalizedDepositGasFeePriceEstimate,
    )
  }, [maxAmountIn, tokenIn])

  useEffect(() => {
    if (isWrappingNativeToken) {
      updateMaxNativeTokenAmountIn()
    }
  }, [isWrappingNativeToken, updateMaxNativeTokenAmountIn])

  const lastPrice = useMemo(() => {
    if (isWrappingNativeToken || isUnwrappingNativeToken) {
      return 0
    }

    const [maxTokenIn, maxTokenOut] =
      swapType === SwapTxType.exactIn
        ? [totalSwapLimitInput, totalAvailableReturnAmount]
        : [totalAvailableReturnAmount, totalSwapLimitInput]

    if (big(maxTokenOut).eq(0)) return 0

    return normalize(maxTokenOut, tokenOut?.decimals)
      .div(normalize(maxTokenIn, tokenIn?.decimals))
      .toNumber()
  }, [
    isWrappingNativeToken,
    isUnwrappingNativeToken,
    swapType,
    totalSwapLimitInput,
    totalAvailableReturnAmount,
    tokenIn?.decimals,
    tokenOut?.decimals,
  ])

  const validation = useMemo(() => {
    const protocolFeeAmount = isProtocolFeePaid
      ? normalize(protocolFee, tokenIn?.decimals).toNumber()
      : 0

    const getInsufficientBalance = (): boolean => {
      if (
        tokenIn === undefined ||
        tokenIn.balance === null ||
        tokenIn.balance === undefined
      ) {
        return false
      }

      const hasEnoughBalance =
        tokenIn.balance.toNumber() < amountIn + protocolFeeAmount

      if (isWrappingNativeToken) {
        return hasEnoughBalance && amountIn > maxNativeTokenAmountIn
      }

      return hasEnoughBalance
    }

    const insufficientBalance = getInsufficientBalance()

    const zeroAmount = amountIn === 0 || amountOut === 0
    const { tolerance = 0 } = settings || {}
    const invalidSettings = tolerance < 0 || tolerance > 100

    return {
      valid:
        !routerError &&
        !insufficientBalance &&
        !swapRouteError &&
        !zeroAmount &&
        !invalidSettings,
      error:
        (routerError && t(`swap.${routerError}`)) ||
        (insufficientBalance &&
          t('insufficientBalance', { symbol: tokenIn?.symbol })) ||
        (swapRouteError && t(`swap.${swapRouteError}`)),
    }
  }, [
    tokenIn,
    protocolFee,
    isProtocolFeePaid,
    amountIn,
    amountOut,
    settings,
    swapRouteError,
    routerError,
    t,
    isWrappingNativeToken,
    maxNativeTokenAmountIn,
  ])

  const setAmountIn = useCallback(
    (value: number) => {
      setValues({
        amountIn: value,
        amountOut: normalize(totalReturn, tokenOut?.decimals)
          .round(tokenOut?.decimals, 0)
          .toNumber(),
      })
      setAmountOutValue(undefined)
    },
    [tokenOut?.decimals, totalReturn, setAmountOutValue],
  )

  const setAmountOut = useCallback(
    (value: number) => {
      setValues({
        amountIn: normalize(totalReturn, tokenIn?.decimals)
          .round(tokenIn?.decimals, 0)
          .toNumber(),
        amountOut: value,
      })
      setAmountOutValue(String(value))
    },
    [totalReturn, tokenIn?.decimals, setAmountOutValue],
  )

  useEffect(() => {
    setValues((prevValues) =>
      swapType === SwapTxType.exactIn
        ? {
            amountIn: prevValues.amountIn,
            amountOut: normalize(totalReturn, tokenOut?.decimals)
              .round(tokenOut?.decimals, 0)
              .toNumber(),
          }
        : {
            amountIn: normalize(totalReturn, tokenIn?.decimals)
              .round(tokenIn?.decimals, 0)
              .toNumber(),
            amountOut: prevValues.amountOut,
          },
    )
  }, [totalReturn, tokenIn?.decimals, tokenOut?.decimals, swapType])

  return useMemo(() => {
    return {
      amountIn,
      amountOut,
      maxAmountIn,
      maxNativeTokenAmountIn,
      protocolFee,
      swaps,
      totalSwapFeeAmount,
      totalReturn,
      lastPrice,
      ...validation,
      setAmountIn,
      setAmountOut,
      swapStrategiesDiff,
      swapPrice,
    }
  }, [
    amountIn,
    amountOut,
    maxAmountIn,
    maxNativeTokenAmountIn,
    protocolFee,
    swaps,
    totalSwapFeeAmount,
    totalReturn,
    lastPrice,
    validation,
    setAmountIn,
    setAmountOut,
    swapStrategiesDiff,
    swapPrice,
  ])
}

export default useSwapValues
