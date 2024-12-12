import { Obj } from '@swarm/types'
import {
  AbstractAsset,
  AbstractNFT,
  AbstractToken,
  HasType,
  XToken,
} from '@swarm/types/tokens'
import { InvestAssetSG } from '@swarm/types/tokens/invest'
import { useMemo } from 'react'
import { combineLatest, Observable, of } from 'rxjs'
import { map, switchMap, throttleTime } from 'rxjs/operators'

import { cpk$ } from '@core/contracts/cpk'
import useDeepMemo from '@core/hooks/memo/useDeepMemo'
import useMemoCollection from '@core/hooks/memo/useMemoCollection'
import useObservable from '@core/hooks/rxjs/useObservable'
import allowanceOf$, { allowanceStatusOf$ } from '@core/observables/allowanceOf'
import configForNetwork$ from '@core/observables/configForNetwork'
import contractOf$ from '@core/observables/contractOf'
import exchangeRateOf$ from '@core/observables/exchangeRateOf'
import tokenBalanceOf$ from '@core/observables/tokenBalanceOf'
import totalSupplyOf$ from '@core/observables/totalSupplyOf'
import usdBalanceOf$ from '@core/observables/usdBalanceOf'
import userBalances$ from '@core/observables/userBalances'
import { OBSERVABLE_THROTTLE_INTERVAL } from '@core/shared/consts/time'
import isNil from 'lodash/isNil'
import set from 'lodash/set'

import nftAllowanceOf$ from '@core/observables/nftAllowanceOf'
import nftBalanceOf$ from '@core/observables/nftBalanceOf'
import { TokenType } from '@core/shared/enums'
import { big, ZERO } from '../helpers'
import flow from 'lodash/flow'
import { isNFTType } from './filters'

export type Injector<T extends Obj = Obj, O = unknown> = (
  token: T,
  prev?: Partial<O>,
) => Record<string, Observable<O>>

type DerivedInjector<T extends Obj = Obj, O = unknown> = (
  token: T,
) => Record<string, O>

/**
 * A hook to add properties to tokens array using injection functions (see below)
 * @param origin the original tokens array
 * @param injectors the injector functions
 * @param derivedInjectors
 * @returns tokens array with injected properties
 */
export const useInjections = <Src extends Obj>(
  origin: Src[],
  injectors: Injector<Src>[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  derivedInjectors?: DerivedInjector<any, any>[],
): Src[] => {
  const injections = useObservable(
    useDeepMemo(
      () =>
        combineLatest(
          origin.map((item) =>
            combineLatest({
              ...injectors.reduce(
                (prev, injector) => ({
                  ...prev,
                  ...injector(item, prev),
                }),
                {} as Src,
              ),
            }),
          ),
        ).pipe(
          throttleTime(OBSERVABLE_THROTTLE_INTERVAL, undefined, {
            trailing: true,
            leading: false,
          }),
        ),
      [injectors, origin],
    ),
  )

  const flowableInjectors = useMemo(
    () =>
      derivedInjectors?.map((injector) => (item: Src) => ({
        ...item,
        ...injector(item),
      })) ?? [],
    [derivedInjectors],
  )

  return useMemoCollection(
    useMemo(
      () =>
        origin
          .map((item, idx) => {
            const injection = injections?.[idx]

            if (injection) {
              return Object.keys(injection).reduce(
                (res, path) => set(res, path, injection[path]),
                item,
              )
            }

            return item
          })
          .map(flow(...flowableInjectors)),
      [flowableInjectors, injections, origin],
    ),
  )
}

export const injectTokenBalance =
  (account?: string | null, path = 'balance') =>
  (token: Pick<AbstractToken, 'id'>) => ({
    [path]: tokenBalanceOf$(account)(token),
  })

export const injectNftBalance =
  (account?: string | null, path = 'balance') =>
  (nft: Pick<AbstractNFT, 'address' | 'tokenId'>) => ({
    [path]: nftBalanceOf$(account)({
      contractAddress: nft.address,
      tokenId: nft.tokenId,
    }),
  })

export const injectBalance =
  (account?: string | null, path = 'balance') =>
  (asset: AbstractAsset & HasType) => {
    if (isNFTType(asset)) {
      return {
        [path]: nftBalanceOf$(account)({
          contractAddress: asset.address,
          tokenId: asset.tokenId,
        }),
      }
    } else if (asset.type === TokenType.erc20) {
      return {
        [path]: tokenBalanceOf$(account)(asset),
      }
    }
    return {
      [path]: of(ZERO),
    }
  }

export const injectUsdBalance =
  (account?: string | null, path = 'usdBalance') =>
  (token: Pick<AbstractToken, 'id'>) => ({
    [path]: usdBalanceOf$(account)(token),
  })

export const injectUserBalances =
  (account?: string | null, path = 'userBalances') =>
  (token: Pick<AbstractToken, 'id'>) => ({
    [path]: userBalances$(account)(token),
  })

export const injectXTokenCpkBalance =
  (account?: string | null, path = 'cpkBalance') =>
  (token: { xToken?: XToken }) => ({
    xToken: token?.xToken
      ? tokenBalanceOf$(account)(token.xToken).pipe(
          switchMap((balance) =>
            of({
              ...token?.xToken,
              [path]: balance,
            }),
          ),
        )
      : of(token?.xToken),
  })

export const injectCpkAllowance =
  (account?: string | null, path = 'cpkAllowance') =>
  (token: Pick<AbstractToken, 'id'>) => ({
    [path]: cpk$.pipe(
      switchMap((cpk) => allowanceOf$(account, cpk?.address)(token)),
    ),
  })

export const injectCpkTokenBalance =
  (account?: string | null, path = 'cpkBalance') =>
  (token: Pick<AbstractToken, 'id'>) => ({
    [path]: cpk$.pipe(switchMap((cpk) => tokenBalanceOf$(cpk?.address)(token))),
  })

export const injectCpkAllowanceStatus =
  (account?: string | null, path = 'allowanceStatus') =>
  (token: Pick<AbstractToken, 'id'>) => ({
    [path]: cpk$.pipe(
      switchMap((cpk) => allowanceStatusOf$(account, cpk?.address)(token)),
    ),
  })

export const injectDotcAllowance =
  (account?: string | null, path = 'allowance') =>
  (token: Pick<AbstractToken, 'id'>) => ({
    [path]: configForNetwork$.pipe(
      switchMap(({ dOTCAddress }) => allowanceOf$(account, dOTCAddress)(token)),
    ),
  })

export const injectXDotcAllowance =
  (account?: string | null, path = 'allowance') =>
  (token: AbstractAsset) => ({
    [path]: configForNetwork$.pipe(
      switchMap(({ xDotcAddress }) =>
        isNFTType(token)
          ? nftAllowanceOf$(account, xDotcAddress)(token)
          : allowanceOf$(account, xDotcAddress)(token),
      ),
    ),
  })

export const injectContract =
  (path = 'contract') =>
  (token: Pick<AbstractToken, 'id'>) => ({
    [path]: contractOf$()(token),
  })

export const injectExchangeRate =
  (path = 'exchangeRate') =>
  (token: Pick<AbstractToken, 'id'>) => ({
    [path]: exchangeRateOf$()(token),
  })

export const injectTotalSupply =
  (path = 'totalSupply') =>
  (token: Pick<AbstractToken, 'id'>) => ({
    [path]: totalSupplyOf$()(token),
  })

export const injectInvestAssetExchangeRate =
  (path = 'exchangeRate') =>
  (token: Pick<InvestAssetSG, 'id' | 'rate'>) => ({
    [path]: exchangeRateOf$()(token).pipe(
      map((exchangeRate) =>
        isNil(exchangeRate)
          ? exchangeRate
          : big(token.rate).times(exchangeRate).toNumber(),
      ),
    ),
  })

export const injectDerived =
  <Prev, O>(mapper: (prevToken: Prev) => O, path: string) =>
  (prevToken: Prev) => ({
    [path]: of(mapper(prevToken)),
  })
