import useMemoCompare from '@swarm/core/hooks/memo/useMemoCompare'
import { prettifyBalance } from '@swarm/core/shared/utils'
import { big, compareBig } from '@swarm/core/shared/utils/helpers/big-helpers'
import { isEqualCaseInsensitive } from '@swarm/core/shared/utils/lodash'
import { balanceLoading } from '@swarm/core/shared/utils/tokens/balance'
import { useAccount } from '@swarm/core/web3'
import Big, { BigSource } from 'big.js'
import { ComponentType, useMemo } from 'react'
import { Box, Loader } from 'rimble-ui'

import Wrapper, { WithWrapper } from '../presentational/Wrapper'

type BalanceProps<WrapperType extends ComponentType | undefined = undefined> =
  WithWrapper<
    {
      balance?: BigSource | null
      account?: string
      base?: number
      accuracy?: number
      loading?: boolean
      symbol?: string
    },
    WrapperType
  >

function Balance<T extends ComponentType | undefined = undefined>({
  balance,
  account,
  base = 2,
  accuracy = 4,
  loading = false,
  symbol = '',
  wrapper,
  ...props
}: BalanceProps<T>) {
  const connectedAccount = useAccount(account)

  const memoizedBalance = useMemoCompare<Big | null | undefined>(
    typeof balance === 'string' || typeof balance === 'number'
      ? big(balance)
      : balance,
    compareBig,
  )

  const prettyBalance = useMemo(
    () =>
      memoizedBalance ? prettifyBalance(memoizedBalance, base, accuracy) : '--',
    [accuracy, base, memoizedBalance],
  )

  const title = useMemo(() => {
    if (memoizedBalance === undefined || memoizedBalance === null) {
      return `-- ${symbol}`
    }
    if (isEqualCaseInsensitive(symbol, 'usd')) {
      return `${big(memoizedBalance).round(2).toString()} ${symbol}`
    }

    return `${memoizedBalance ?? '--'} ${symbol}`
  }, [memoizedBalance, symbol])

  if (
    loading ||
    balanceLoading({ balance: memoizedBalance }, connectedAccount)
  ) {
    return (
      <Wrapper
        component={wrapper ?? Box}
        {...(!wrapper && { display: 'inline-block' })}
        {...props}
      >
        <Loader m={0} />
      </Wrapper>
    )
  }

  return (
    <Wrapper component={wrapper} title={title} {...props}>
      {prettyBalance} {symbol}
    </Wrapper>
  )
}

export default Balance
