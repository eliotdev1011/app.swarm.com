import { getCurrentConfig } from '../../observables/configForNetwork'

const { vSmtAddress = '', cNativeTokenAddress } = getCurrentConfig()

export const VSMT_TOKEN = {
  id: vSmtAddress,
  address: vSmtAddress,
  symbol: 'vSMT',
  name: 'Vesting Swarm Token',
  decimals: 18,
  xToken: undefined,
}

export const NATIVE_TOKEN_SKELETON = {
  id: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  decimals: 18,
}

export const NATIVE_ETH = {
  ...NATIVE_TOKEN_SKELETON,
  symbol: 'ETH',
  name: 'Ethereum',
}

export const NATIVE_MATIC = {
  ...NATIVE_TOKEN_SKELETON,
  symbol: 'POL',
  name: 'Polygon Ecosystem Token',
}

export const CNATIVE_TOKEN = {
  id: cNativeTokenAddress,
  address: cNativeTokenAddress,
  decimals: 8,
}

export const STABLE_COIN_SYMBOLS = ['cUSDC', 'USDC']
export const STOCK_TOKEN_SYMBOLS = ['TSLA', 'AAPL', 'COIN']
