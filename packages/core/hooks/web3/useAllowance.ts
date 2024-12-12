import { useAllowanceOf } from '@core/observables/allowanceOf'
import { useNFTAllowanceOf } from '@core/observables/nftAllowanceOf'
import { TokenType } from '@core/shared/enums'
import { isNFT as checkNFT, isLoading } from '@core/shared/utils/tokens'

type UseAllowanceState = {
  allowanceLoading: boolean
}

type UseAllowanceReturn = [Big.Big | null | undefined, UseAllowanceState]

interface UseAllowanceArgs {
  account?: string | null
  spender?: string
  asset?: string
  type?: TokenType
}

const useAllowance = ({
  account,
  spender,
  asset,
  type = TokenType.erc20,
}: UseAllowanceArgs): UseAllowanceReturn => {
  const isNFT = checkNFT(type)

  const tokenAllowance = useAllowanceOf(isNFT ? null : account, spender, asset)
  const nftAllowance = useNFTAllowanceOf(
    !isNFT ? null : account,
    spender,
    asset,
  )

  const loading = isNFT
    ? isLoading(nftAllowance, account)
    : isLoading(tokenAllowance, account)

  const allowance = isNFT ? nftAllowance : tokenAllowance

  return [allowance, { allowanceLoading: loading }]
}

export default useAllowance
