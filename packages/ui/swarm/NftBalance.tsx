import { useNFTBalanceOf } from '@swarm/core/observables/nftBalanceOf'
import { balanceLoading } from '@swarm/core/shared/utils/tokens/balance'
import { ComponentType } from 'react'
import { Box, Loader } from 'rimble-ui'

import Wrapper, { WithWrapper } from '../presentational/Wrapper'

import Balance from './Balance'

type NftBalanceProps<
  WrapperType extends ComponentType | undefined = undefined,
> = WithWrapper<
  {
    contractAddress: string
    tokenId?: string
    account?: string | null
    hideEmpty?: boolean
  },
  WrapperType
>

function NftBalance<T extends ComponentType | undefined = undefined>({
  contractAddress,
  account,
  tokenId,
  wrapper,
  hideEmpty = false,
  ...props
}: NftBalanceProps<T>) {
  const balance = useNFTBalanceOf(account, contractAddress, tokenId)

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

  return (
    <Balance
      balance={balance}
      base={1}
      loading={balanceLoading({ balance }, account)}
      wrapper={wrapper}
      {...props}
    />
  )
}

export default NftBalance
