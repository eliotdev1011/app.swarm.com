import { useCpk } from '@swarm/core/contracts/cpk'
import useArrayInjector, {
  InjectionCreatorMap,
} from '@swarm/core/hooks/rxjs/useArrayInjector'
import allowanceOf$ from '@swarm/core/observables/allowanceOf'
import contractOf$ from '@swarm/core/observables/contractOf'
import exchangeRateOf$ from '@swarm/core/observables/exchangeRateOf'
import tokenBalanceOf$ from '@swarm/core/observables/tokenBalanceOf'
import usdBalanceOf$ from '@swarm/core/observables/usdBalanceOf'
import { safeDiv } from '@swarm/core/shared/utils/helpers/big-helpers'
import { poolTokenToToken } from '@swarm/core/shared/utils/tokens'
import { isSameEthereumAddress, useAccount } from '@swarm/core/web3'
import { PoolExpanded } from '@swarm/types'
import { ExtendedPoolToken } from '@swarm/types/tokens'
import Big from 'big.js'
import { useMemo } from 'react'
import { of } from 'rxjs'
import { switchMap } from 'rxjs/operators'

const useFullTokens = <
  TPool extends Pick<
    PoolExpanded,
    | 'totalWeight'
    | 'tokens'
    | 'newCRPoolToken'
    | 'crpoolGradualWeightsUpdate'
    | 'tokensList'
  >,
>(
  pool?: TPool | null,
) => {
  const account = useAccount()
  const cpk = useCpk()

  const map = useMemo<InjectionCreatorMap<ExtendedPoolToken>>(
    () => ({
      contract: contractOf$(),
      exchangeRate: exchangeRateOf$(0),
      balance: tokenBalanceOf$(account),
      usdBalance: usdBalanceOf$(account),
      cpkBalance: tokenBalanceOf$(cpk?.address),
      cpkAllowance: allowanceOf$(account, cpk?.address),
      xToken: (token) =>
        token?.xToken
          ? tokenBalanceOf$(cpk?.address)(token?.xToken).pipe(
              switchMap((xTokenCpkBalance) =>
                of({
                  ...token?.xToken,
                  cpkBalance: xTokenCpkBalance,
                }),
              ),
            )
          : of(token?.xToken),
    }),
    [account, cpk?.address],
  )

  return useArrayInjector(
    map,
    useMemo(
      () =>
        pool?.tokensList && pool?.tokens?.length
          ? pool.tokensList.map((xTokenAddress, index) => {
              const pooledToken = pool.tokens.find((poolToken) =>
                isSameEthereumAddress(xTokenAddress, poolToken.xToken?.id),
              )

              if (pooledToken === undefined) {
                throw new Error(
                  `Couldn't find a pair token from pool.tokenList and pool.tokens`,
                )
              }

              const token = poolTokenToToken({
                ...pooledToken,
                weight: safeDiv(
                  pooledToken.denormWeight,
                  pool.totalWeight,
                ).toNumber(),
              })

              let targetWeight: Big | undefined
              if (pool.newCRPoolToken !== null) {
                const newTotalWeight =
                  parseFloat(pool.totalWeight) +
                  parseFloat(pool.newCRPoolToken.denormWeight)

                targetWeight = safeDiv(token.denormWeight, newTotalWeight)
              } else if (pool.crpoolGradualWeightsUpdate) {
                const newTotalWeight =
                  pool.crpoolGradualWeightsUpdate.newWeights.reduce(
                    (acc, denormWeight) => {
                      return acc + parseFloat(denormWeight)
                    },
                    0,
                  )

                targetWeight = safeDiv(
                  pool.crpoolGradualWeightsUpdate.newWeights[index],
                  newTotalWeight,
                )
              }

              return {
                ...token,
                ...(targetWeight !== undefined && {
                  targetWeight: targetWeight.times(100).toString(),
                }),
              }
            })
          : [],
      [pool],
    ),
  )
}

export default useFullTokens
