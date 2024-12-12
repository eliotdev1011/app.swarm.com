import { Pool } from '@swarm/types/pool'
import {
  ExtendedPoolToken,
  HasBalance,
  HasExchangeRate,
} from '@swarm/types/tokens'
import Big, { BigSource } from 'big.js'

import { ProtocolFee } from '@core/contracts/ProtocolFee'
import {
  BALANCE_BUFFER,
  MAX_OUT_RATIO,
  SPT_DECIMALS,
} from '@core/shared/consts/math'

import {
  big,
  denormalize,
  max,
  normalize,
  safeDiv,
  toWei,
  ZERO,
} from '../helpers/big-helpers'

export const calcPoolTokensByRatio = (
  ratio: number,
  totalShares: string,
  tolerance = BALANCE_BUFFER,
): Big => {
  if (Number.isNaN(ratio) || ratio === 0) {
    return ZERO
  }

  const buffer = 100
  return normalize(
    big(ratio).times(toWei(totalShares)).minus(buffer),
    SPT_DECIMALS,
  ).times(1 - tolerance)
}

export const calcPoolOutGivenSingleIn = (
  amount: BigSource,
  token: ExtendedPoolToken,
  pool: Pool,
  slippage = BALANCE_BUFFER,
): Big => {
  if (!token.decimals || big(amount).eq(0) || big(pool.totalWeight).eq(0)) {
    return ZERO
  }
  const tokenBalanceIn = denormalize(token?.poolBalance || 0, token.decimals)
  const poolSupply = denormalize(pool.totalShares, SPT_DECIMALS)
  const tokenAmountIn = denormalize(amount, token.decimals).round(0, 1)

  const normalizedWeight = big(token.denormWeight).div(pool.totalWeight)
  const zaz = big(1).minus(normalizedWeight).times(pool.swapFee)

  const tokenAmountInAfterFee = tokenAmountIn.times(big(1).minus(zaz))

  const newTokenBalanceIn = tokenBalanceIn.plus(tokenAmountInAfterFee)
  const tokenInRatio = newTokenBalanceIn.div(tokenBalanceIn)

  /**
   * @TODO use Binomial approximation
   * https://github.com/balancer-labs/pool-management-vue/blob/HEAD/src/helpers/math.ts#L101
   * https://docs.balancer.finance/core-concepts/protocol/index/approxing)
   * https://blog.openzeppelin.com/balancer-contracts-audit/
   * https://en.wikipedia.org/wiki/Binomial_approximation#Using_Taylor_Series
   */
  const poolRatio = tokenInRatio.toNumber() ** normalizedWeight.toNumber()

  const newPoolSupply = big(poolRatio).times(poolSupply)
  const poolAmountOut = newPoolSupply.minus(poolSupply)

  return normalize(poolAmountOut.times(1 - slippage), SPT_DECIMALS)
}

export const calcMaxRatio = (tokens: ExtendedPoolToken[]) => {
  if (!tokens.length) return 0

  const usdWeights = tokens.map(
    (token) =>
      (Number(token?.usdBalance) || 0) / (Number(token.denormWeight) || 1),
  )

  const minUsdWeight = Math.min(...usdWeights)

  const minUsdWeightTokenIndex = usdWeights.findIndex(
    (balance) => balance === minUsdWeight,
  )

  const { poolBalance: minPoolBalance, balance: minBalance } = tokens[
    minUsdWeightTokenIndex
  ]

  return safeDiv(minBalance ?? undefined, minPoolBalance).toNumber()
}

export const calcMaxAmountsIn = (
  tokens: ExtendedPoolToken[],
): Record<string, number> => {
  const maxRatio = calcMaxRatio(tokens)

  return tokens.reduce(
    (map, { address, poolBalance, usdBalance }) => ({
      ...map,
      [address]: (maxRatio || (!usdBalance ? 0 : 1)) * Number(poolBalance || 0),
    }),
    {},
  )
}

export const calcTokenAmountInByPoolAmountOut = (
  pool: Pool,
  poolAmountOut: BigSource,
  token: ExtendedPoolToken,
  tolerance = BALANCE_BUFFER,
) => {
  if (big(pool.totalShares).eq(0)) {
    return ZERO
  }

  return denormalize(token.poolBalance || 0, token.decimals)
    .times(denormalize(poolAmountOut, SPT_DECIMALS))
    .div(denormalize(pool.totalShares, SPT_DECIMALS))
    .times(1 + tolerance)
}

export const calcSingleTokenAmountInByPoolAmountOut = (
  pool: Pool,
  poolAmountOut: BigSource,
  token: ExtendedPoolToken,
  slippage = BALANCE_BUFFER,
) => {
  if (big(pool.totalShares).eq(0) || !token.weight || token.weight === 1) {
    return ZERO
  }

  const poolSupply = denormalize(pool.totalShares, SPT_DECIMALS)

  const newPoolSupply = poolSupply.plus(
    denormalize(poolAmountOut, SPT_DECIMALS),
  )

  const ratio = denormalize(newPoolSupply).div(poolSupply)

  const power = big(1).div(token.weight || 0)

  const tokenInRatio = ratio.toNumber() ** power.toNumber()

  const tokenBalanceIn = denormalize(token.poolBalance || 0, token.decimals)

  const newTokenBalanceIn = tokenBalanceIn.times(tokenInRatio)

  const tokenAmountInAfterFee = newTokenBalanceIn.minus(tokenBalanceIn)

  const feeCoeficient = big(1)
    .minus(token.weight || 0)
    .times(pool.swapFee)

  if (feeCoeficient.eq(1)) {
    return ZERO
  }

  const tokenAmountIn = tokenAmountInAfterFee.div(big(1).minus(feeCoeficient))

  return tokenAmountIn.times(1 + slippage)
}

export const calcMultipleOutByPoolAmountIn = (
  pool: Pool,
  poolAmountIn: BigSource,
  token: ExtendedPoolToken,
  slippage = BALANCE_BUFFER,
) => {
  if (big(pool.totalShares).eq(0)) {
    return ZERO
  }

  return denormalize(token.poolBalance || 0, token.decimals)
    .times(denormalize(poolAmountIn, SPT_DECIMALS))
    .div(denormalize(pool.totalShares, SPT_DECIMALS))
    .times(1 - slippage)
}

export const calcMaxPoolInBySingleOut = (
  pool: Pool,
  tokenOut: ExtendedPoolToken,
) => {
  const poolSupply = denormalize(pool.totalShares, SPT_DECIMALS)

  const normalizedWeight = big(tokenOut.weight)

  const maxTokenOutRatio = big(1).minus(MAX_OUT_RATIO)

  const poolRatio = big(
    maxTokenOutRatio.toNumber() ** normalizedWeight.toNumber(),
  )

  const newPoolSupply = poolRatio.times(poolSupply)

  const maxPoolAmountIn = poolSupply.minus(newPoolSupply)

  return normalize(maxPoolAmountIn, SPT_DECIMALS)
}

export const calcSingleOutByPoolAmountIn = (
  pool: Pool,
  poolAmountIn: BigSource,
  tokenOut: ExtendedPoolToken,
  slippage = BALANCE_BUFFER,
) => {
  if (
    !tokenOut.decimals ||
    big(poolAmountIn).eq(0) ||
    big(pool.totalShares).eq(0) ||
    big(tokenOut.weight).eq(0)
  ) {
    return ZERO
  }
  const tokenBalanceOut = denormalize(
    tokenOut.poolBalance || 0,
    tokenOut.decimals,
  )
  const normalizedWeight = big(tokenOut.weight)
  const poolSupply = denormalize(pool.totalShares, SPT_DECIMALS)
  const newPoolSupply = poolSupply.minus(
    denormalize(poolAmountIn, SPT_DECIMALS),
  )
  const poolRatio = newPoolSupply.div(poolSupply)
  const tokenOutRatio = big(
    poolRatio.toNumber() ** big(1).div(normalizedWeight).toNumber(),
  )
  const newTokenBalanceOut = tokenOutRatio.times(tokenBalanceOut)
  const tokenAmountOutBeforeSwapFee = tokenBalanceOut.minus(newTokenBalanceOut)
  const zaz = big(1).minus(normalizedWeight).times(pool.swapFee)
  const tokenAmountOut = tokenAmountOutBeforeSwapFee
    .times(big(1).minus(zaz))
    .times(1 - slippage)

  return tokenAmountOut
}

export const calcAmountInByPoolAmountOut = (
  pool: Pool,
  poolAmountIn: BigSource,
  tokenOut: ExtendedPoolToken,
  multiple = true,
  slippage = BALANCE_BUFFER,
) =>
  multiple
    ? calcMultipleOutByPoolAmountIn(pool, poolAmountIn, tokenOut, slippage)
    : calcSingleOutByPoolAmountIn(pool, poolAmountIn, tokenOut, slippage)

export const swapFeeToProtocolFee = async (
  denormAmountIn: BigSource,
  denormSwapFee: BigSource,
) => {
  const [protocolFee, minProtocolFee, ONE] = await Promise.all([
    ProtocolFee.protocolFee(),
    ProtocolFee.minProtocolFee(),
    ProtocolFee.ONE(),
  ])

  return max(
    big(denormSwapFee).times(protocolFee),
    big(denormAmountIn).times(minProtocolFee),
  ).div(ONE)
}

export const calcSpotPrice = (
  tokenBalanceIn: BigSource,
  tokenWeightIn: BigSource,
  tokenBalanceOut: BigSource,
  tokenWeightOut: BigSource,
  swapFee: BigSource,
) => {
  if (
    big(tokenWeightIn).eq(0) ||
    big(tokenWeightOut).eq(0) ||
    big(tokenBalanceOut).eq(0)
  ) {
    return ZERO
  }

  const numer = big(tokenBalanceIn).div(tokenWeightIn)
  const denom = big(tokenBalanceOut).div(tokenWeightOut)
  const ratio = numer.div(denom)
  const scale = big(1).div(big(1).minus(swapFee))
  return ratio.times(scale)
}

export const calcPoolTokenExchangeRate = ({
  tokens,
  totalShares,
}: Pick<Pool, 'totalShares'> & {
  tokens: (HasBalance & HasExchangeRate)[]
}) => {
  if (Number(totalShares) === 0 || !tokens?.length) {
    return 0
  }

  return tokens
    .reduce(
      (acc, token) =>
        big(token.balance)
          .times(token.exchangeRate || 0)
          .plus(acc),
      ZERO,
    )
    .div(totalShares)
    .toNumber()
}
