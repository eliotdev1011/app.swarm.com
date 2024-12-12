import { ExtendedNativeToken, XToken } from '@swarm/types/tokens'
import { TokenModel } from '@swarmmarkets/smart-order-router'
import { getAddress } from 'ethers/lib/utils'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const transformPoolToken = (poolToken: any) => ({
  id: poolToken?.id,
  balance: poolToken?.balance,
  decimals: poolToken?.decimals,
  denormWeight: poolToken?.denormWeight,
  ...(poolToken?.poolId && {
    poolId: {
      id: getAddress(poolToken.poolId?.id),
      publicSwap: poolToken.poolId?.publicSwap,
      swapFee: poolToken.poolId?.swapFee,
      tokensList: poolToken.poolId?.tokensList,
      totalWeight: poolToken.poolId?.totalWeight,
      tokens: poolToken.poolId?.tokens.map(transformPoolToken),
    },
  }),
})

const transformXToken = <
  T extends Pick<XToken, 'id' | 'decimals' | 'paused' | 'poolTokens'>,
>(
  xToken?: T,
) => ({
  id: getAddress(xToken?.id || ''),
  decimals: xToken?.decimals,
  paused: xToken?.paused,
  poolTokens: xToken?.poolTokens?.map(transformPoolToken),
})

export const transformSwapToken = <
  T extends Pick<ExtendedNativeToken, 'id' | 'decimals' | 'xToken'>,
>(
  token: T,
): TokenModel => ({
  id: getAddress(token.id),
  decimals: token?.decimals,
  xToken: transformXToken(token.xToken),
})
