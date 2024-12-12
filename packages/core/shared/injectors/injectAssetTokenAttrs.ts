import { InvestAssetSG } from '@swarm/types/tokens/invest'
import { from, of, startWith } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'

import { AssetToken } from '@core/contracts/AssetToken'
import { AssetTokenIssuer } from '@core/contracts/AssetTokenIssuer'
import { isStakingNode } from '@core/shared/utils'
import { isIpfsUrl, requestIpfs } from '@core/shared/utils/crypto'

import { injectStakingNodeAttrs } from './injectStakingNodeAttrs'

export const injectAssetTokenAttrs = () => (token: InvestAssetSG) => {
  const assetTokenContract$ = from(AssetToken.getInstance(token.id))
  const assetTokenIssuerContract$ = of(token.issuer).pipe(
    switchMap((issuer) =>
      issuer !== null && issuer.name === AssetTokenIssuer.SWARM_ISSUER_NAME
        ? from(AssetTokenIssuer.getInstance(issuer.id))
        : of(undefined),
    ),
    startWith(undefined),
  )

  const kyaData$ = of(token.kya).pipe(
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
    kyaData: kyaData$,
    requestRedeem: assetTokenContract$.pipe(
      map((contract) => contract?.requestRedeem),
      startWith(undefined),
    ),
    issuerContract: assetTokenIssuerContract$,
    mint: assetTokenIssuerContract$.pipe(map((contract) => contract?.mint)),
    getAmountToMint: assetTokenIssuerContract$.pipe(
      map((contract) => contract?.getAmountToMint),
    ),
    ...(isStakingNode(token) && injectStakingNodeAttrs()(token)),
  }
}
