import { NetworkConfiguration } from '@swarm/types/config'

const alchemyApiKey = 'TuOU5wtmmo1Sd-1wSsT0aCdQweHWej_1'
const subgraphApiKey = '2e2730968289f9eb3287cd3f1991a957'
const subgraphDeploymentId = 'QmSCYeXRt4bKN4xV2H2Ww8nZif4q2cW3GRVon6We6QNYYy'
const uniswapSubgraphId = '5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV'

export const ethereum: NetworkConfiguration = {
  rpcUrl: `https://eth-mainnet.g.alchemy.com/v2/${alchemyApiKey}`,
  xSubgraphUrl: `https://gateway-arbitrum.network.thegraph.com/api/${subgraphApiKey}/subgraphs/id/8sYwvmR23zqSVuL6Foxc79oWStTjweqX6kkeg6eBxgKg`,
  subgraphUrl: `https://gateway-arbitrum.network.thegraph.com/api/${subgraphApiKey}/deployments/id/${subgraphDeploymentId}`,
  uniswapSubgraphUrl: `https://gateway-arbitrum.network.thegraph.com/api/${subgraphApiKey}/subgraphs/id/${uniswapSubgraphId}`,
  alchemyApiKey,
  contracts: {
    actionManagerAddress: '0xbda5743B76bcC88337336EF027958422f4DFE5F4',
    bPoolProxyAddress: '0x5321647F3c3769bc7bb9e10aB10d7F5C2E402c56',
    cNativeTokenAddress: '',
    comptrollerAddress: '',
    xDotcAddress: '0x1d0D0516385D2ff6748A3b87Ba2C2cC37F287D4a',
    xDotcManagerAddress: '0xF8981283ac9691B7783a9086277665A962fC13f3',
    dOTCAddress: '0x73AcB24A37340CC82e07DB1293FEa4FD5afa7a4a',
    multicallAddress: '0x5ba1e12693dc8f9c48aad8770482f4739beed696',
    nativeTokenWrapperAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    smtDistributorAddress: '0x6b0f858Ac88f13BB26081a8E86D3DD723c8031AC',
    usdcAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    nativeUsdcAddress: '',
    vouchersCustodyWalletAddress: '0x6e68ae2304e7d5eebb4b65a4b18f7d1839ad60c7',
    vSmtAddress: '0x0C033bb39e67eB598D399C06A8A519498dA1Cec9',
    swarmStakingAddress: '',
    swarmBuyerBurnerAddress: '0x1A2356D54aEEad105f203a5c51a6307Ec100494e',
    xGoldKgAddress: '0xBa4AC703ca1825A5D32E356C92e9A770FeEd35b9',
    xGoldOzAddress: '0x6ce43f19A23Ba474449D6231446D752ab3dB3f6D',
    xGoldBundleAddress: '0x7F94388A552580712C4ec724f470c6E4a74B5244',
    xGoldBundleStorageAddress: '0x2B498BaE947C80e358F59a277aDdA90f76344456',
    smtAddress: '0xB17548c7B510427baAc4e267BEa62e800b247173',
  },
}
