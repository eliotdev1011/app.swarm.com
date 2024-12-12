import { NetworkConfiguration } from '@swarm/types/config'

const alchemyApiKey = '7XnSXbVD19aQb8B3IKzkFPYGXPgI2JAN'

export const arbitrumSepolia: NetworkConfiguration = {
  rpcUrl: `https://arb-sepolia.g.alchemy.com/v2/${alchemyApiKey}`,
  subgraphUrl: '',
  xSubgraphUrl:
    'https://api.studio.thegraph.com/query/40769/swarmx-arbitrum-sepolia/version/latest',
  uniswapSubgraphUrl: '',
  alchemyApiKey,
  contracts: {
    actionManagerAddress: '',
    bPoolProxyAddress: '',
    cNativeTokenAddress: '',
    comptrollerAddress: '',
    dOTCAddress: '',
    xDotcAddress: '0x88EEfd075Da6f7185c39713296183Cd052eEfd0D',
    xDotcManagerAddress: '0x1eD467ae51faC45Db475597ccA46643505310c7b',
    multicallAddress: '0x2A2df4c9943B6a24E1bA21BED7ab5FB8c2f58e90',
    nativeTokenWrapperAddress: '',
    smtDistributorAddress: '',
    usdcAddress: '',
    nativeUsdcAddress: '',
    vouchersCustodyWalletAddress: '',
    swarmStakingAddress: '',
    swarmBuyerBurnerAddress: '',
    xGoldBundleAddress: '0x066157Dc143B12645e2853D1969Ef7493C8a6796',
    xGoldBundleStorageAddress: '0x41D9DEcE2CCA550270D6C4acAF15a9b79791eaD4',
    xGoldKgAddress: '0x3D0C3dA469d3f73d51e263acBb04C58D246841eA',
    xGoldOzAddress: '0x862ead81F034bFe80FC8d35B7496Ba9d5BF9d044',
    smtAddress: '',
  },
}
