import { compareTokensBy } from '@swarm/core/shared/utils/filters'
import { isNFT } from '@swarm/core/shared/utils/tokens/filters'
import { useAccount } from '@swarm/core/web3'
import { TokenSelectorAsset } from '@swarm/types/tokens'
import match from 'conditional-expression'
import { useMemo } from 'react'
import { Text } from 'rimble-ui'

import NftBalance from '../NftBalance'
import TokenBalance from '../TokenBalance'

import TokenSelectorModal from './TokenSelectorModal'
import { BalanceTokenSelectorModalProps } from './types'

const BalanceTokenSelectorModal = <T extends TokenSelectorAsset>({
  tokens = [],
  orderBy,
  orderDirection = 'asc',
  loading,
  ...otherProps
}: BalanceTokenSelectorModalProps<T>) => {
  const account = useAccount()
  const getTokenBadge = (token: T) =>
    match(token?.balance)
      .on((value: unknown) => typeof value === 'undefined')
      .then('')
      .else(
        <Text.span
          fontWeight={2}
          color="grey"
          flexGrow={1}
          flexBasis="auto"
          textAlign="right"
        >
          {isNFT(token.type) && token.address ? (
            <NftBalance
              contractAddress={token.address}
              tokenId={token.tokenId}
              account={account}
            />
          ) : (
            <TokenBalance tokenAddress={token.id} account={account} />
          )}
        </Text.span>,
      )

  const sortedTokens = useMemo(
    () =>
      orderBy
        ? [...tokens]?.sort(compareTokensBy([orderBy, orderDirection]))
        : tokens,
    [orderBy, orderDirection, tokens],
  )

  return (
    <TokenSelectorModal
      {...otherProps}
      loading={loading}
      tokens={sortedTokens}
      badge={getTokenBadge}
    />
  )
}

export default BalanceTokenSelectorModal
