import { NetworkConfiguration } from '@swarm/types/config'

const alchemyApiKey = '7XnSXbVD19aQb8B3IKzkFPYGXPgI2JAN'
const subgraphApiKey = '2e2730968289f9eb3287cd3f1991a957'
const uniswapSubgraphId = '3hCPRGf4z88VC5rsBKU5AA9FBBq5nF3jbKJG7VZCbhjm'

export const polygon: NetworkConfiguration = {
  rpcUrl: `https://polygon-mainnet.g.alchemy.com/v2/${alchemyApiKey}`,
  xSubgraphUrl: `https://gateway-arbitrum.network.thegraph.com/api/${subgraphApiKey}/subgraphs/id/BxC2c8iaQA1y2QeeYGh2PBhMT44RvNvxkAKv8y6ZPBaa`,
  subgraphUrl: `https://gateway.thegraph.com/api/${subgraphApiKey}/subgraphs/id/5jyKcTX7beneokj6HnkMQXjJMcSooW8ZmE8evUYfQvsz`,
  uniswapSubgraphUrl: `https://gateway-arbitrum.network.thegraph.com/api/${subgraphApiKey}/subgraphs/id/${uniswapSubgraphId}`,
  alchemyApiKey,
  contracts: {
    actionManagerAddress: '0xe121b2A964Def87bb3Bd32c31Cf29BaCeF65AAe4',
    bPoolProxyAddress: '0x174Ac59f7071e1264b6B21Cb7FdC8FA00ae1ef3C',
    cNativeTokenAddress: '',
    comptrollerAddress: '',
    dOTCAddress: '0x667e3a192e5b7d02a7794cd11014adc1e24f96f9',
    xDotcAddress: '0x429737c0DdF17779803Aba8B5E6133012952B4c3',
    xDotcManagerAddress: '0xF8981283ac9691B7783a9086277665A962fC13f3',
    multicallAddress: '0x39b4dfeF02c7Af07Bef29E272819B6d447C13B92',
    nativeTokenWrapperAddress: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
    smtDistributorAddress: '0x664f0D579109497e2eCEd75A9ad9314893aE27d2',
    usdcAddress: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    nativeUsdcAddress: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
    vouchersCustodyWalletAddress: '0x6e68ae2304e7d5eebb4b65a4b18f7d1839ad60c7',
    swarmStakingAddress: '0x813B9bE9ef5c7bBCd89A8276Fa14dd96319411B1',
    swarmBuyerBurnerAddress: '',
    xGoldKgAddress: '0x973B1894d688f2e45FE9C573Ef19a8f519d32208',
    xGoldOzAddress: '0xFb75d446E30842C8b7100014dB7C5fD2CBfbC072',
    xGoldBundleAddress: '',
    xGoldBundleStorageAddress: '',
    smtAddress: '0xE631DABeF60c37a37d70d3B4f812871df663226f',
  },
}
