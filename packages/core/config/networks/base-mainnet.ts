import { NetworkConfiguration } from '@swarm/types/config'

const alchemyApiKey = '7AC_znn3fkRLpMdCCD3uvCzBOvPFiYhN'
const subgraphApiKey = '2e2730968289f9eb3287cd3f1991a957'
const uniswapSubgraphId = '43Hwfi3dJSoGpyas9VwNoDAv55yjgGrPpNSmbQZArzMG'

export const base: NetworkConfiguration = {
  rpcUrl: `https://base-mainnet.g.alchemy.com/v2/${alchemyApiKey}`,
  xSubgraphUrl: `https://api.studio.thegraph.com/query/60829/swarmx-base/v0.1.7`,
  subgraphUrl: `https://api.studio.thegraph.com/query/60829/swarm-base/version/latest`,
  uniswapSubgraphUrl: `https://gateway-arbitrum.network.thegraph.com/api/${subgraphApiKey}/subgraphs/id/${uniswapSubgraphId}`,
  alchemyApiKey,
  contracts: {
    actionManagerAddress: '',
    bPoolProxyAddress: '',
    cNativeTokenAddress: '',
    comptrollerAddress: '',
    dOTCAddress: '',
    xDotcAddress: '0x1d0D0516385D2ff6748A3b87Ba2C2cC37F287D4a',
    xDotcManagerAddress: '0x632F2fe528D59ae71eCd38d7F1fDf8D5b5B1CF25',
    multicallAddress: '0x429737c0DdF17779803Aba8B5E6133012952B4c3',
    nativeTokenWrapperAddress: '',
    smtDistributorAddress: '',
    usdcAddress: '',
    nativeUsdcAddress: '',
    vouchersCustodyWalletAddress: '',
    swarmStakingAddress: '',
    swarmBuyerBurnerAddress: '',
    xGoldKgAddress: '',
    xGoldOzAddress: '',
    xGoldBundleAddress: '',
    xGoldBundleStorageAddress: '',
    smtAddress: '0x2974dc646e375e83bd1c0342625b49f288987fa4',
  },
}
