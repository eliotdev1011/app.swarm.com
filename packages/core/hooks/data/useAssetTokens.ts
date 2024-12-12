import { useQuery } from '@apollo/client'
import { Share } from '@swarm/types'
import { UserAccount } from '@swarm/types/state/user-account'
import { TokensFilterSGQuery } from '@swarm/types/subgraph-responses'
import { NativeToken, WalletToken } from '@swarm/types/tokens'
import compact from 'lodash/compact'
import { useMemo } from 'react'
import { of } from 'rxjs'

import { Erc20 } from '@core/contracts/ERC20'
import { useCpk } from '@core/contracts/cpk'
import { NativeTokensQuery, UserQuery } from '@core/queries'
import {
  NATIVE_ETH,
  NATIVE_MATIC,
  POLL_INTERVAL,
  VSMT_TOKEN,
} from '@core/shared/consts'
import { isPolygon } from '@core/shared/utils/config'
import { big, safeDiv, ZERO } from '@core/shared/utils/helpers'
import {
  balancesLoading,
  injectContract,
  injectCpkAllowance,
  injectCpkAllowanceStatus,
  injectExchangeRate,
  injectTokenBalance,
  injectUserBalances,
  useInjections,
} from '@core/shared/utils/tokens'
import { isSameEthereumAddress, useNetwork } from '@core/web3'

import useAbstractTokens from './useAbstractTokens'

const getAdditionalTokens = (networkId: number): NativeToken[] =>
  isPolygon(networkId) ? [NATIVE_MATIC] : [VSMT_TOKEN, NATIVE_ETH]

const excludeTokens = [
  '0x02ba39888444c6277f7a6dfcb9a58b64fb3beff3',
  '0x08bf1dac72eae7fc2c407123038f4563fd79c3ad',
  '0x345d87f34b7b830d89c2a98d89a2a0af54bb6fd0',
  '0x3fa010f813ccde2597cf907df714b3a8743028ef',
  '0x80f8ade10c21514eed63fa52928ea41de33c5365',
  '0x8ce654f90ace2ab4c5c512010c314b5c6e15cc77',
  '0xcf9ac0929e2195a4d1f0327d3e54efa9d3d83523',
  '0xd98388bf3e062fc77a1a456a634f2b2dc5d1bb6e',
  '0xf3cda4e9f10d81151ffbffd2c1527e42093b4542',
  '0xf46ea5498474d45c3e84f59b35e1d0277c7a44b6',
  '0xfc8e461c10badf7d3342cc01c4c332fbeacdd5a2',
]

interface NativeTokensQueryVariables {
  includePoolTokens?: boolean
  filter?: TokensFilterSGQuery
}

const useAssetTokens = (
  userAccount?: UserAccount | null,
  filter?: NativeTokensQueryVariables,
) => {
  const { networkId } = useNetwork()
  const cpk = useCpk()

  const {
    data: userData,
    error: pooledTokenError,
    loading: pooledTokenLoading,
  } = useQuery<{
    user?: { sharesOwned: Share[] }
  }>(UserQuery, {
    variables: { id: userAccount?.address.toLowerCase() },
    pollInterval: POLL_INTERVAL,
    skip: !userAccount?.address,
  })

  const addedTokens = useMemo(() => getAdditionalTokens(networkId), [networkId])

  const {
    allTokens: nativeTokens,
    loading: nativeTokensLoading,
    error: nativeTokensError,
  } = useAbstractTokens<NativeToken>(NativeTokensQuery, {
    variables: {
      filter,
    },
  })

  // TODO: remove this block when we find how to filter them in better way on subgraph/contract side
  console.log(nativeTokens)
  const allNativeTokens = useInjections(
    useMemo(
      () =>
        [...nativeTokens, ...addedTokens].filter(
          (token) => !excludeTokens.includes(token.id),
        ),
      [addedTokens, nativeTokens],
    ),
    useMemo(
      () => [
        injectContract(),
        injectExchangeRate(),
        injectTokenBalance(userAccount?.address),
        injectUserBalances(userAccount?.address),
        injectCpkAllowance(userAccount?.address),
        injectCpkAllowanceStatus(userAccount?.address),
        (token: NativeToken) => ({
          enable: of(async () =>
            cpk?.address
              ? (await Erc20.getInstance(token.id))?.enableToken(cpk.address)
              : undefined,
          ),
          disable: of(async () =>
            cpk?.address
              ? (await Erc20.getInstance(token.id))?.disableToken(cpk.address)
              : undefined,
          ),
        }),
      ],
      [cpk?.address, userAccount?.address],
    ),
  ) as WalletToken[]

  const fullTokens = useMemo(
    () =>
      allNativeTokens?.map((token) => {
        const pooledTokenBalance = userData?.user?.sharesOwned
          .filter((share) =>
            share.poolId?.tokens.some((pooledToken) =>
              isSameEthereumAddress(pooledToken.xToken?.id, token.xToken?.id),
            ),
          )
          .map((share) => {
            const pooledToken = share.poolId?.tokens.find((_pooledToken) =>
              isSameEthereumAddress(_pooledToken.xToken?.id, token.xToken?.id),
            )

            return safeDiv(
              big(pooledToken?.balance).times(share.balance),
              share.poolId?.totalShares,
            )
          })
          .reduce((total, pooledBalance) => total.add(pooledBalance), ZERO)

        const usdPooledTokenBalance = pooledTokenBalance?.times(
          token.exchangeRate ?? 0,
        )

        const fullUsdBalance = big(usdPooledTokenBalance ?? 0)?.add(
          token.userBalances?.usd ?? 0,
        )

        return {
          ...token,
          fullUsdBalance,
          pooledTokenBalance: pooledTokenBalance ?? ZERO,
          usdPooledTokenBalance,
        }
      }) ?? [],
    [allNativeTokens, userData],
  )

  const errors = useMemo(
    () => compact([nativeTokensError, pooledTokenError]),
    [nativeTokensError, pooledTokenError],
  )

  const areBalancesLoading = useMemo(
    () => balancesLoading(allNativeTokens),
    [allNativeTokens],
  )

  return useMemo(
    () => ({
      tokens: fullTokens,
      loading: nativeTokensLoading || pooledTokenLoading || areBalancesLoading,
      errors,
    }),
    [
      areBalancesLoading,
      errors,
      fullTokens,
      nativeTokensLoading,
      pooledTokenLoading,
    ],
  )
}

export default useAssetTokens
