import { DEFAULT_DECIMALS } from '@swarm/core/shared/consts'
import { mapBy } from '@swarm/core/shared/utils/collection'
import {
  big,
  safeDiv,
  ZERO,
} from '@swarm/core/shared/utils/helpers/big-helpers'
import { isSameEthereumAddress } from '@swarm/core/web3'
import { ExtendedPoolToken } from '@swarm/types/tokens'

import { FullCreatePoolAsset, NewPoolAsset } from './types'

export const mergeTokenAssets = (
  assets: NewPoolAsset[],
  dictionary: Map<string, ExtendedPoolToken>,
) =>
  mapBy(
    assets,
    'id',
    (asset) =>
      ({
        ...dictionary.get(asset.id),
        ...asset,
      } as FullCreatePoolAsset),
  )

export const deriveMaxAmounts = (
  assets: Map<string, FullCreatePoolAsset>,
): Map<string, FullCreatePoolAsset> => {
  const normalizedUsdBalances = [...assets.values()].map((asset) => ({
    id: asset.id,
    normalizedUsdBalance: safeDiv(asset.usdBalance, asset.weight),
  }))

  const baseAssetId = normalizedUsdBalances.sort((a, b) =>
    a.normalizedUsdBalance.cmp(b.normalizedUsdBalance),
  )[0].id

  const assetArray = [...assets.values()]
  const baseAsset = assets.get(baseAssetId)

  if (
    !baseAsset ||
    assetArray.some((asset) => !asset.weight) ||
    assetArray.some((asset) => !asset.exchangeRate)
  ) {
    return mapBy(assetArray, 'id', (asset) => ({ ...asset, maxAmount: '0' }))
  }

  const baseUsdAmount = safeDiv(
    baseAsset.balance?.times(baseAsset.exchangeRate || 0) || ZERO,
    baseAsset.weight,
  )

  return mapBy(assetArray, 'id', (asset) => ({
    ...asset,
    maxAmount:
      (isSameEthereumAddress(asset.id, baseAsset.id)
        ? baseAsset.balance?.toString()
        : baseUsdAmount
            .times(asset.weight)
            .div(assets.get(asset.id)?.exchangeRate || 1)
            .toString()) ?? '0',
  }))
}

export const updateAssets = (
  assets: NewPoolAsset[],
  index: number,
  newAsset: Omit<NewPoolAsset, 'decimals'>,
  fullAssets: Map<string, FullCreatePoolAsset>,
) => {
  const currentAsset = assets[index]

  if (newAsset.amount === 'Infinity') {
    return assets.map((asset) => {
      const assetToken = fullAssets.get(asset.id)

      return {
        ...asset,
        decimals: assetToken?.decimals || DEFAULT_DECIMALS,
        amount: assetToken?.maxAmount ?? '0',
      }
    })
  }

  if (
    currentAsset.amount !== newAsset.amount ||
    currentAsset.weight !== newAsset.weight ||
    !isSameEthereumAddress(currentAsset.id, newAsset.id)
  ) {
    const baseAsset = isSameEthereumAddress(currentAsset.id, newAsset.id)
      ? newAsset
      : currentAsset

    const baseUsdAmount = Number(baseAsset.weight)
      ? big(baseAsset.amount)
          .times(fullAssets.get(baseAsset.id)?.exchangeRate || 0)
          .div(baseAsset.weight || 1)
      : ZERO

    const newAssets = assets.map((asset, idx) => {
      const realAsset = idx === index ? newAsset : asset
      const assetToken = fullAssets.get(realAsset.id)

      return {
        ...realAsset,
        decimals: assetToken?.decimals || DEFAULT_DECIMALS,
        amount: baseUsdAmount
          .times(Number(realAsset.weight) || 0)
          .div(assetToken?.exchangeRate || 1)
          .toString(),
      }
    })

    return newAssets
  }

  return assets
}
