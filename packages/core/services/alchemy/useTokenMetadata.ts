import { AlchemyToken } from '@swarm/types/tokens'
import { UndefinedInitialDataOptions, useQuery } from '@tanstack/react-query'
import { TokenMetadataResponse } from 'alchemy-sdk'
import { isAddress } from 'ethers/lib/utils'
import { useMemo } from 'react'

import AlchemyAPI from '@core/services/alchemy'
import { TokenType } from '@core/shared/enums'
import {
  injectTokenBalance,
  isErc1155,
  useInjections,
} from '@core/shared/utils/tokens'
import { useAccount } from '@core/web3'

import { normalizeAlchemyMetadata } from './utils'

type TokenMetadataQueryOptions = Omit<
  UndefinedInitialDataOptions<TokenMetadataResponse | null>,
  'queryFn' | 'queryKey'
>

interface UseTokenMetadataOptions extends TokenMetadataQueryOptions {
  type?: TokenType
}

const useTokenMetadata = (
  address?: string,
  options?: UseTokenMetadataOptions,
) => {
  const { type: optionsType, ...queryOptions } = options ?? {}
  const type = optionsType ?? TokenType.erc20
  const account = useAccount()

  const {
    data: token,
    refetch,
    isLoading,
    error,
  } = useQuery({
    queryFn: () => {
      if (!address || !isAddress(address)) return null
      return AlchemyAPI.getTokenMetadata(address)
    },
    queryKey: ['tokenMetadata', address],
    ...queryOptions,
  })

  const extendedToken = useMemo(() => {
    if (token === undefined || token === null || isLoading || !address) {
      return null
    }
    return normalizeAlchemyMetadata(address, type, token)
  }, [address, isLoading, token, type])

  const injectedToken = useInjections<AlchemyToken>(
    extendedToken ? [extendedToken] : [],
    useMemo(
      () => (!isErc1155(options?.type) ? [injectTokenBalance(account)] : []),
      [account, options?.type],
    ),
  )

  return {
    token: injectedToken.length ? injectedToken[0] : null,
    loading: isLoading,
    refetch,
    error,
  }
}

export default useTokenMetadata
