/* eslint-disable camelcase */
import { ApolloError, useQuery } from '@apollo/client'
import { AssetTokensQueryVariables } from '@swarm/types/subgraph/graphql'
import { NativeToken } from '@swarm/types/tokens'
import {
  Bond,
  BrandingToken,
  InvestAssetSG,
  InvestToken,
  StakingNode,
  StockToken,
} from '@swarm/types/tokens/invest'
import sortBy from 'lodash/sortBy'
import { useMemo } from 'react'

import { useCpk } from '@core/contracts/cpk'
import { getCurrentConfig } from '@core/observables/configForNetwork'
import { AssetTokensQuery } from '@core/queries'
import client from '@core/services/apollo'
import { SupportedNetworkId } from '@core/shared/enums/supported-network-id'
import { injectAssetTokenAttrs } from '@core/shared/injectors/injectAssetTokenAttrs'
import { getTokensFilter } from '@core/shared/subgraph'
import {
  getType,
  isBond,
  isBrandingToken,
  isIndexToken,
  isSecurityToken,
  isStakingNode,
  isStockToken,
} from '@core/shared/utils'
import { normalize } from '@core/shared/utils/helpers/big-helpers'
import {
  injectCpkAllowance,
  injectCpkTokenBalance,
  injectExchangeRate,
  injectInvestAssetExchangeRate,
  injectTokenBalance,
  useInjections,
} from '@core/shared/utils/tokens/injectors'
import {
  isSameEthereumAddress,
  unifyAddressToId,
  useStoredNetworkId,
} from '@core/web3'
import { useAccount } from '@core/web3/account'

import useXGold from '../useXGold'

export interface InvestAssetsData {
  investAssets: InvestToken[]
  bonds: Bond[]
  brandingTokens: BrandingToken[]
  indexTokens: StockToken[]
  stockTokens: StockToken[]
  stakingNodes: StakingNode[]
  investAssetsLoading: boolean
  investAssetsError?: ApolloError
}

interface UseInvestAssetsParams {
  options?: {
    includeAssetTokenAttrs?: boolean
  }
}

const useInvestAssets = (props?: UseInvestAssetsParams): InvestAssetsData => {
  const account = useAccount()
  const network = useStoredNetworkId()
  const cpk = useCpk()
  const { usdcAddress, nativeUsdcAddress } = getCurrentConfig()

  const includeAssetTokenAttrs = props?.options?.includeAssetTokenAttrs ?? true

  const {
    data,
    loading: assetsLoading,
    error: investAssetsError,
  } = useQuery<
    { assetTokens: InvestAssetSG[]; tokens: NativeToken[] },
    AssetTokensQueryVariables
  >(AssetTokensQuery, {
    variables: {
      assetTokenFilter: getTokensFilter('Token', {
        frozen: false,
        isOnSafeGuard: false,
        enabled: true,
      }),
      tokenFilter: {
        id_in: [
          unifyAddressToId(usdcAddress),
          unifyAddressToId(nativeUsdcAddress),
        ],
      },
    },
    skip: [SupportedNetworkId.ArbitrumSepolia].includes(network),
    client,
  })

  const filteredAssetTokens = useMemo(() => {
    return (
      data?.assetTokens.filter((asset) => {
        const assetType = getType(asset.kyaInformation?.assetType)
        return isSecurityToken({
          assetType,
        })
      }) || []
    )
  }, [data?.assetTokens])

  const { token: xGold, loading: xGoldLoading } = useXGold()

  const normalizedXGoldToken = useMemo(
    () =>
      xGold &&
      ({
        ...xGold,
        issuer: {
          id: '0x2CB863237Ec1E7cc017729cb7102fc00a0B5cd45',
          name: 'SwarmX GmBH',
        },
        rate: 1,
      } as unknown as InvestAssetSG),
    [xGold],
  )

  const injectedInvestTokens = useInjections(
    useMemo(
      () =>
        [
          ...filteredAssetTokens,
          ...(normalizedXGoldToken ? [normalizedXGoldToken] : []),
        ]?.map((assetToken) => {
          const assetType = getType(assetToken.kyaInformation?.assetType)
          const nativeTokens = sortBy(
            data?.tokens,
            (token) => token.id === usdcAddress,
          )
          const nativeToken = data?.tokens.find((token) =>
            isSameEthereumAddress(token.id, assetToken.id),
          )

          return {
            ...assetToken,
            ...(nativeToken?.tvl && {
              tvl: normalize(nativeToken.tvl, nativeToken.decimals),
            }),
            authorizedAssets: nativeTokens || [],
            assetType: assetType,
          }
        }) || [],
      [data?.tokens, filteredAssetTokens, usdcAddress, normalizedXGoldToken],
    ),
    useMemo(
      () => [
        injectInvestAssetExchangeRate(),
        injectTokenBalance(account),
        ...(includeAssetTokenAttrs ? [injectAssetTokenAttrs()] : []),
        injectCpkTokenBalance(cpk?.address),
        injectCpkAllowance(account),
        injectExchangeRate(),
      ],
      [account, cpk?.address, includeAssetTokenAttrs],
    ),
  ) as InvestToken[]

  const stockTokens = useMemo(
    () => injectedInvestTokens.filter(isStockToken),
    [injectedInvestTokens],
  ) as StockToken[]

  const stakingNodes = useMemo(
    () => injectedInvestTokens.filter(isStakingNode),
    [injectedInvestTokens],
  ) as StakingNode[]

  const bonds = useMemo(
    () => injectedInvestTokens.filter(isBond),
    [injectedInvestTokens],
  ) as Bond[]

  const indexTokens = useMemo(
    () => injectedInvestTokens.filter(isIndexToken),
    [injectedInvestTokens],
  ) as StockToken[]

  const brandingTokens = useMemo(
    () => injectedInvestTokens.filter(isBrandingToken),
    [injectedInvestTokens],
  ) as BrandingToken[]

  const xGoldToken = useMemo(
    () =>
      injectedInvestTokens.find((token) =>
        isSameEthereumAddress(token.id, xGold?.id),
      ),
    [injectedInvestTokens, xGold?.id],
  )

  const allInvestAssets = useMemo(
    () => [
      ...stockTokens,
      ...stakingNodes,
      ...bonds,
      ...indexTokens,
      ...(xGoldToken ? [xGoldToken] : []),
    ],
    [bonds, indexTokens, stakingNodes, stockTokens, xGoldToken],
  )

  const investAssetsLoading = assetsLoading || xGoldLoading

  return useMemo(
    () => ({
      stockTokens,
      stakingNodes,
      brandingTokens,
      bonds,
      indexTokens,
      investAssets: allInvestAssets,
      investAssetsLoading,
      investAssetsError,
    }),
    [
      stockTokens,
      stakingNodes,
      brandingTokens,
      bonds,
      indexTokens,
      allInvestAssets,
      investAssetsLoading,
      investAssetsError,
    ],
  )
}

export default useInvestAssets
