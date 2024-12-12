/* eslint-disable camelcase */
import { BuyAssetSG } from '@swarm/types/buy'
import { NativeToken } from '@swarm/types/tokens'

import { SupportedNetworkId } from '@core/shared/enums'
import { getSvgUrl } from '@core/shared/utils'

const vMATREthereumSG: BuyAssetSG = {
  id: '0x78320DcFC452285BAe0289c7c6C919f0C4948B42',
  name: 'Vesting Mattereum Discount Token',
  symbol: 'vMATR',
  decimals: 18,
  type: 'Vesting discount token',
  issuer: {
    id: '0xcae1061a7dff2607aa3d22048ff1b7f42a009321',
    name: 'Mattereum GmbH',
    authorizedAssets: ['0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'],
  },
  enabled: true,
  lastUpdate: 1704978269,
  kyaInformation: {
    name: 'Vesting Mattereum Discount Token',
    symbol: 'vMATR',
    description:
      'A token that matures into MATR according to a vesting schedule',
    externalUrl: 'https://www.mattereum.de',
    image: getSvgUrl('vMATR'),
    blockchain: 'Ethereum',
    assetType: 'Vesting discount token',
    properties: [
      {
        property_type: 'Blockchain',
        value: 'Ethereum',
      },
      {
        property_type: 'token_address',
        value: '0x78320DcFC452285BAe0289c7c6C919f0C4948B42',
      },
      {
        property_type: 'token_standard',
        value: 'ERC20',
      },
      {
        property_type: 'kya_version',
        value: '1.1',
      },
      {
        property_type: 'token_version',
        value: '1.0',
      },
      {
        property_type: 'asset_type',
        value: 'Vesting discount token',
      },
      {
        property_type: 'issuer_name',
        value: 'Mattereum GmbH',
      },
      {
        property_type: 'issuer_url',
        value: 'https://www.mattereum.de',
      },
    ],
  },
}

const vMATREthereum: NativeToken = {
  id: '0x78320DcFC452285BAe0289c7c6C919f0C4948B42',
  name: 'Vesting Mattereum Discount Token',
  symbol: 'vMATR',
  decimals: 18,
  xToken: {
    id: '0xa9d761df616B56f53c062a79076837d1f2f70523',
    decimals: 18,
    name: 'Swarm Wrapped vMATR',
    symbol: 'xvMATR',
    paused: false,
    token: {
      id: '0x78320DcFC452285BAe0289c7c6C919f0C4948B42',
      name: 'Vesting Mattereum Discount Token',
      symbol: 'vMATR',
      decimals: 18,
    },
  },
}

export const vMATR: Record<SupportedNetworkId, NativeToken | null> = {
  [SupportedNetworkId.Ethereum]: vMATREthereum,
  [SupportedNetworkId.Base]: null,
  [SupportedNetworkId.Polygon]: null,
  [SupportedNetworkId.ArbitrumSepolia]: null,
}

export const vMATRSG: Record<SupportedNetworkId, BuyAssetSG | null> = {
  [SupportedNetworkId.Ethereum]: vMATREthereumSG,
  [SupportedNetworkId.Base]: null,
  [SupportedNetworkId.Polygon]: null,
  [SupportedNetworkId.ArbitrumSepolia]: null,
}

export const allowedMatrTokens: Record<SupportedNetworkId, string[]> = {
  [SupportedNetworkId.Ethereum]: [
    '0x80e32d09fbeaa6aa01d76aa68024670e8db8a953',
    '0xa9d761df616B56f53c062a79076837d1f2f70523',
  ],
  [SupportedNetworkId.Base]: [],
  [SupportedNetworkId.Polygon]: [],
  [SupportedNetworkId.ArbitrumSepolia]: [],
}

export const matrTokens: Record<SupportedNetworkId, string[]> = {
  [SupportedNetworkId.Ethereum]: ['0x78320DcFC452285BAe0289c7c6C919f0C4948B42'],
  [SupportedNetworkId.Base]: [],
  [SupportedNetworkId.Polygon]: [],
  [SupportedNetworkId.ArbitrumSepolia]: [],
}

export const matrXTokens: Record<SupportedNetworkId, string[]> = {
  [SupportedNetworkId.Ethereum]: ['0xa9d761df616B56f53c062a79076837d1f2f70523'],
  [SupportedNetworkId.Base]: [],
  [SupportedNetworkId.Polygon]: [],
  [SupportedNetworkId.ArbitrumSepolia]: [],
}
