import { useTokenBalanceOf } from '@swarm/core/observables/tokenBalanceOf'
import { useExchangeRates } from '@swarm/core/services/exchange-rates'
import { balanceLoading } from '@swarm/core/shared/utils/tokens/balance'
import { ComponentType } from 'react'
import { Box, Loader } from 'rimble-ui'

import Wrapper, { WithWrapper } from '../presentational/Wrapper'

import Balance from './Balance'

type TokenBalanceProps<
  WrapperType extends ComponentType | undefined = undefined,
> = WithWrapper<
  {
    tokenAddress?: string
    account?: string | null
    usd?: boolean
    hideEmpty?: boolean
    symbol?: string
    base?: number
  },
  WrapperType
>

function TokenBalance<T extends ComponentType | undefined = undefined>({
  tokenAddress,
  account,
  usd = false,
  symbol,
  base = 6,
  wrapper,
  hideEmpty = false,
  ...props
}: TokenBalanceProps<T>) {
  const balance = useTokenBalanceOf(account, tokenAddress)
  const exchangeRates = useExchangeRates(tokenAddress ? [tokenAddress] : [])

  if (hideEmpty && !balance?.gt(0)) {
    return <></>
  }

  if (typeof balance === 'undefined') {
    return <>--</>
  }

  if (balanceLoading({ balance }, account)) {
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

  if (usd && tokenAddress) {
    const exchangeRate =
      exchangeRates[tokenAddress] && exchangeRates[tokenAddress].exchangeRate

    if (exchangeRate === null) {
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
      <Balance
        balance={balance?.times(exchangeRate || 0).round(2) || 0}
        symbol={symbol}
        base={base}
        loading={balanceLoading({ balance }, account)}
        wrapper={wrapper}
        {...props}
      />
    )
  }

  return (
    <Balance
      balance={balance ?? undefined}
      symbol={symbol}
      base={base}
      loading={balanceLoading({ balance }, account)}
      wrapper={wrapper}
      {...props}
    />
  )
}

export default TokenBalance
