import {
  formatBigBalance,
  prettifyBalance,
} from '@swarm/core/shared/utils/formatting'
import { big } from '@swarm/core/shared/utils/helpers/big-helpers'
import { Share } from '@swarm/types'
import { NativeToken } from '@swarm/types/tokens'
import Blockie from '@swarm/ui/presentational/Blockie'
import ExplorerLink from '@swarm/ui/swarm/Link/ExplorerLink'
import { Flex, Text } from 'rimble-ui'

interface PoolHoldersRowProps {
  shareInfo: Share & {
    sptValue: number
    totalShares: number
    poolToken: NativeToken
  }
}

const PoolHoldersRow = ({ shareInfo }: PoolHoldersRowProps) => {
  const {
    balance,
    userAddress: user,
    sptValue,
    totalShares,
    poolToken,
  } = shareInfo

  return (
    <tr>
      <td>
        <Flex alignItems="center">
          <Blockie address={user.id} mr="16px" />
          <ExplorerLink type="address" hash={user.id} />
        </Flex>
      </td>
      <td>
        {user.proxyAddress ? (
          <Flex alignItems="center">
            <Blockie address={user.proxyAddress} mr="16px" />
            <ExplorerLink type="address" hash={user.proxyAddress} />
          </Flex>
        ) : (
          '--'
        )}
      </td>
      <td>
        <Text.span title={prettifyBalance(balance, 8)}>
          {formatBigBalance(balance, 3)} {poolToken.symbol}
        </Text.span>
      </td>
      <td>
        <Text.span title={prettifyBalance(big(balance).times(sptValue))}>
          $ {formatBigBalance(big(balance).times(sptValue), 3)}
        </Text.span>
      </td>
      <td>
        <Text.span>
          {prettifyBalance(big(balance).times(100).div(totalShares), 2, 2)}%
        </Text.span>
      </td>
    </tr>
  )
}

export default PoolHoldersRow
