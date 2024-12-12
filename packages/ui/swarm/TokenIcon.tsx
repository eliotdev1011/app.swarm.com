import config from '@core/config'
import { useRequestCache } from '@core/services/cache/useRequestCache'
import { isPolygon } from '@core/shared/utils'
import { getSvgUrl } from '@core/shared/utils/cdn'
import { getLastUsedNetworkId } from '@core/web3'
import { memo, useMemo } from 'react'

import Image, { ImageProps } from '@ui/presentational/Image'

const SWARM_CDN_ICONS = {
  smt: 'SMT',
  vsmt: 'vSMT',
  spt: 'SPT',
  xspt: 'SPT',
  weth: 'Weth',
  wmatic: 'matic',
  pol: 'matic',
  '1inch': '1inch',
  cel: 'cel',
  luna: 'luna',
  sol: 'sol',
  tsla: 'tsla',
  aapl: 'aapl',
  coin: 'coin',
  euroc: 'euroc',

  // StockTokens
  tslast: 'tsla',
  aaplst: 'aapl',
  coinst: 'coin',
  nvda: 'NVIDIA',
  msft: 'Microsoft',
  mstr: 'MicroStrategy',
  intc: 'Intel',
  cpng: 'Coupang',
  gme: 'gamestop',

  // StakingNodes
  solsn: 'SOLsn',
  avaxsn: 'avalanche',
  dotsn: 'polkadot',
  ethsn: 'ethereum',
  eth2sn: 'ethereum',
  tbonds01: 'tbond01',
  tbonds13: 'tbond01',
  nasdaq: 'nasdaq',
  nearsn: 'near',
  swm: 'swm',

  // GoldTokens
  xgoldoz: 'GoldBar',
  xgoldkg: 'GoldBar',

  // Gold Bundles
  xgold: 'GoldBar',

  // Brands
  matr: 'vMATR',
  vmatr: 'vMATR',
  real: 'house-token',
}

const {
  resources: { iconsCdn: iconsBaseUrl },
} = config

const genericIconSrc = `${iconsBaseUrl}/svg/color/generic.svg`

interface TokenIconProps extends Omit<ImageProps, 'fallback'> {
  symbol?: string
  name?: string
  logo?: string | null
}

type ManifestResponse = Array<{
  symbol: string
  name: string
  color: string
}>

const TokenIcon = ({
  symbol = 'generic',
  name,
  logo,
  disabled = false,
  ...props
}: TokenIconProps) => {
  // To handle Polygon briged USDC
  const normalizedSymbol =
    isPolygon(getLastUsedNetworkId()) && symbol === 'USDC.e' ? 'USDC' : symbol

  const { value: manifest } = useRequestCache<ManifestResponse>(
    `${iconsBaseUrl}/manifest.json`,
    (res) => res.map((item) => item.symbol),
  )

  const iconAvailable = manifest?.find?.(
    (manifestSymbol: string) =>
      manifestSymbol.toLowerCase() === normalizedSymbol.toLowerCase(),
  )

  const iconSrc = useMemo(() => {
    const unifiedSymbol = normalizedSymbol.toLowerCase()
    if (SWARM_CDN_ICONS[unifiedSymbol as keyof typeof SWARM_CDN_ICONS]) {
      return getSvgUrl(
        SWARM_CDN_ICONS[unifiedSymbol as keyof typeof SWARM_CDN_ICONS],
      )
    }

    if (iconAvailable) {
      return `${iconsBaseUrl}/svg/color/${unifiedSymbol}.svg`
    }

    if (logo) return logo

    return genericIconSrc
  }, [iconAvailable, logo, normalizedSymbol])

  return (
    <Image
      src={iconSrc}
      fallback={genericIconSrc}
      alt={name || symbol}
      title={name || symbol}
      disabled={disabled}
      {...props}
    />
  )
}

export default memo(TokenIcon)
