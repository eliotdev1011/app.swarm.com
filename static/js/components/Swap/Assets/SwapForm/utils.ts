import {
  isNativeToken,
  isWrappedNativeToken,
} from '@swarm/core/shared/utils/tokens/filters'
import { ExtendedNativeToken } from '@swarm/types/tokens'

export function matchIsWrappingNativeToken(
  tokenIn: ExtendedNativeToken | undefined,
  tokenOut: ExtendedNativeToken | undefined,
) {
  return (
    tokenIn !== undefined &&
    tokenOut !== undefined &&
    isNativeToken(tokenIn) &&
    isWrappedNativeToken(tokenOut)
  )
}

export function matchIsUnwrappingNativeToken(
  tokenIn: ExtendedNativeToken | undefined,
  tokenOut: ExtendedNativeToken | undefined,
) {
  return (
    tokenIn !== undefined &&
    tokenOut !== undefined &&
    isWrappedNativeToken(tokenIn) &&
    isNativeToken(tokenOut)
  )
}
