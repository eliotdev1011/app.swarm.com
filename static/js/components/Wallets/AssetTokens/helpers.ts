import { VSMT_TOKEN } from '@swarm/core/shared/consts/known-tokens'
import { compareTokensBy } from '@swarm/core/shared/utils/filters/compare-tokens-by'
import { isSameEthereumAddress } from '@swarm/core/web3'
import { WalletToken } from '@swarm/types/tokens'

export const getSortedFilteredAssetTokens = (
  tokens: WalletToken[],
  hideSmallBalances?: boolean,
) =>
  tokens
    ?.filter(({ id, balance, fullUsdBalance }) => {
      if (hideSmallBalances) {
        if (isSameEthereumAddress(id, VSMT_TOKEN.id)) {
          return balance?.gt(0)
        }
        return fullUsdBalance?.gte(10)
      }

      return true
    })
    .sort(compareTokensBy(['fullUsdBalance', 'desc'], 'symbol', 'name'))
