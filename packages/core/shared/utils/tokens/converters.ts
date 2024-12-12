import {
  AbstractAsset,
  AbstractToken,
  NativeToken,
  PoolToken,
} from '@swarm/types/tokens'

import { NATIVE_ETH } from '@core/shared/consts/known-tokens'
import { getLastUsedNetworkId } from '@core/web3'

import { isPolygon } from '..'
import { big } from '../helpers'

import { isNativeToken, isUsdc } from './filters'

export const idToAddress = <
  T extends Pick<NativeToken, 'id'> & { address?: string },
>(
  token: T,
): T =>
  token.address
    ? token
    : {
        ...token,
        address: token.id,
      }

export const idToAddressXToken = <T extends NativeToken>(token: T): T =>
  !token.xToken
    ? token
    : { ...token, xToken: { ...token.xToken, address: token.xToken.id } }

export const fillEtherFields = <T extends Omit<AbstractToken, 'balance'>>(
  token: T,
): T => (isNativeToken(token) ? { ...token, ...NATIVE_ETH } : token)

export const poolTokenToToken = ({ xToken, balance, ...rest }: PoolToken) =>
  fillEtherFields<PoolToken>({
    ...rest,
    ...xToken?.token,
    id: xToken?.token.id || '',
    poolBalance: big(balance).toNumber(),
    address: xToken?.token.id || '',
    xToken,
  })

export const xSymbolToSymbol = (symbol: string) =>
  symbol.startsWith('x') ? symbol.substr(1) : symbol

export const normalizeUSDCE = <
  T extends Pick<AbstractAsset, 'id' | 'symbol' | 'name'>,
>(
  token: T,
) => {
  const networkId = getLastUsedNetworkId()

  if (isPolygon(networkId) && isUsdc(token)) {
    return {
      ...token,
      name: 'Bridged USDC',
      symbol: 'USDC.e',
    }
  }

  return token
}
