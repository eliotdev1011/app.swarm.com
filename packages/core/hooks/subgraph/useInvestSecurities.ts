import { useQuery } from '@apollo/client'
import { AbstractToken } from '@swarm/types/tokens'
import { PoorInvestAssetSG } from '@swarm/types/tokens/invest'
import { useMemo } from 'react'

import { AssetTokensPoorQuery } from '@core/queries'
import client from '@core/services/apollo'
import { TokenType } from '@core/shared/enums'
import { SupportedNetworkId } from '@core/shared/enums/supported-network-id'
import { getType, isSecurityToken } from '@core/shared/utils'
import { injectTokenBalance, useInjections } from '@core/shared/utils/tokens'
import { useStoredNetworkId } from '@core/web3'

interface UseInvestSecuritiesOptions {
  includeBalances?: boolean
  account?: string
}

const useInvestSecurities = (options?: UseInvestSecuritiesOptions) => {
  const network = useStoredNetworkId()

  const { data, loading, error } = useQuery<{
    assetTokens: PoorInvestAssetSG[]
  }>(AssetTokensPoorQuery, {
    variables: {
      assetTokenFilter: {
        frozen: false,
        isOnSafeGuard: false,
        enabled: true,
      },
      tokenFilter: { paused: false, isLPT: false },
    },
    skip: [SupportedNetworkId.Ethereum].includes(network),
    client,
  })

  const securityTokens = useMemo(
    () =>
      data?.assetTokens
        .filter(
          (tokens) => getType(tokens.kyaInformation?.assetType) !== 'unknown',
        )
        .map((token) => ({
          ...token,
          type: TokenType.erc20,
          rwaType: getType(token.kyaInformation?.assetType),
        })) || [],
    [data?.assetTokens],
  )

  const fullSecurityTokens = useInjections(
    securityTokens,
    useMemo(
      () =>
        options?.includeBalances ? [injectTokenBalance(options.account)] : [],
      [options?.account, options?.includeBalances],
    ),
  )

  const checkSecurityToken = (token: AbstractToken) => {
    const findToken = securityTokens.find(
      (assetToken) => assetToken.id === token.id,
    )
    if (!findToken) return false
    return isSecurityToken(findToken)
  }

  return {
    isSecurityToken: checkSecurityToken,
    securities: fullSecurityTokens,
    securitiesIds: data?.assetTokens.map((item) => item.id),
    data,
    loading,
    error,
  }
}

export default useInvestSecurities
