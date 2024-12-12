import { InvestAssetSG, InvestToken } from '@swarm/types/tokens/invest'
import { combineLatest, from, Observable, of, startWith } from 'rxjs'
import { switchMap } from 'rxjs/operators'

import { AssetTokenData } from '@core/contracts/AssetTokenData'
import exchangeRateOf$ from '@core/observables/exchangeRateOf'
import { getTokenInfo } from '@core/services/token-info'
import { NetworkMap } from '@core/shared/consts'
import { propEquals } from '@core/shared/utils/collection'
import { isIpfsUrl, requestIpfs } from '@core/shared/utils/crypto'
import { isEqualCaseInsensitive } from '@core/shared/utils/lodash'
import { getLastUsedNetworkId, isSameEthereumAddress } from '@core/web3'

export const injectStakingNodeAttrs = () => (token: InvestAssetSG) => {
  const kyaData$: Observable<InvestToken['kyaData']> = of(token.kya).pipe(
    switchMap((kya) => {
      if (kya === undefined || kya === null) {
        return of(kya)
      }

      if (isIpfsUrl(kya)) {
        return from(requestIpfs(kya))
      }

      return of(null)
    }),
    startWith(undefined),
  )

  return {
    netApy: from(AssetTokenData.getInstance(token.assetTokenData.id)).pipe(
      switchMap((contract) => from(contract.getNetApy(token.id))),
      startWith(undefined),
    ),
    apy: from(AssetTokenData.getInstance(token.assetTokenData.id)).pipe(
      switchMap((contract) => from(contract.getApy(token.id))),
      startWith(undefined),
    ),
    underlyingToken: kyaData$.pipe(
      switchMap((kyaData) => {
        if (kyaData === undefined || kyaData === null) {
          return of(kyaData)
        }

        const underliningAssetBlockchain = kyaData?.properties?.find(
          propEquals('property_type', 'underlying_asset_blockchain'),
        )?.value

        const isUnderliningAssetOnCurrentChain = isEqualCaseInsensitive(
          underliningAssetBlockchain,
          NetworkMap.get(getLastUsedNetworkId())?.networkName,
        )

        const underlyingAddress = kyaData?.properties?.find(
          propEquals('property_type', 'underlying_asset'),
        )?.value

        const underlyingSymbol = kyaData?.properties?.find(
          propEquals('property_type', 'underlying_asset_ticker'),
        )?.value

        // To have consistent data later we should check:
        // - if the underlying asset is on the same network
        // - if the underlying asset address is not equal to StakingNode address
        // the last check is needed to be in safe if the owner of the AssetToken will do a mistake
        if (
          underlyingAddress &&
          isUnderliningAssetOnCurrentChain &&
          !isSameEthereumAddress(underlyingAddress, token.id)
        ) {
          return from(
            getTokenInfo(underlyingAddress).then((underlying) => ({
              ...underlying,
              ...(underlyingSymbol && { symbol: underlyingSymbol }),
            })),
          )
        }

        // if the underlying asset is on another blockchain
        // we will use the staking node address (id) to get the underlying asset exchange rate
        // this solution should be temporary since our BE gives the underlying asset USD price for corresponding staking node
        return of({
          id: token.id,
          ...(underlyingSymbol && { symbol: underlyingSymbol }),
        })
      }),
      switchMap((underlyingToken) => {
        return combineLatest([
          of(underlyingToken),
          underlyingToken ? exchangeRateOf$()(underlyingToken) : of(undefined),
        ])
      }),
      switchMap(([underlyingToken, exchangeRate]) => {
        if (underlyingToken) {
          return of({
            ...underlyingToken,
            exchangeRate,
          })
        }

        return of(underlyingToken)
      }),
      startWith(undefined),
    ),
    redemptionToken: kyaData$.pipe(
      switchMap((kyaData) => {
        if (kyaData === undefined || kyaData === null) {
          return of(kyaData)
        }
        const redemptionAssetAddress = kyaData.properties?.find(
          propEquals('property_type', 'redemption_asset_address'),
        )?.value

        const redemptionAssetSymbol = kyaData?.properties?.find(
          propEquals('property_type', 'redemption_asset_ticker'),
        )?.value

        if (redemptionAssetAddress) {
          return from(
            getTokenInfo(redemptionAssetAddress).then((redemptionAsset) => ({
              ...redemptionAsset,
              ...(redemptionAssetSymbol && {
                symbol: redemptionAssetSymbol,
              }),
            })),
          )
        }

        return of(null)
      }),
      switchMap((redemptionAsset) => {
        return combineLatest([
          of(redemptionAsset),
          redemptionAsset
            ? exchangeRateOf$()(redemptionAsset)
            : of(redemptionAsset),
        ])
      }),
      switchMap(([redemptionAsset, exchangeRate]) => {
        if (redemptionAsset) {
          return of({
            ...redemptionAsset,
            exchangeRate,
          })
        }

        return of(redemptionAsset)
      }),
      startWith(undefined),
    ),
  }
}
