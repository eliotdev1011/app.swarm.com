import { utils } from 'ethers'

const requireFile = require.context('./', true, /[\w-]+\.json$/)

type ABINames =
  | 'BPoolProxy'
  | 'ERC20'
  | 'ERC721'
  | 'ERC1155'
  | 'VSMTToken'
  | 'ProtocolFee'
  | 'SmtPriceFeed'
  | 'SmtDistributor'
  | 'XToken'
  | 'XTokenWrapper'
  | 'SwarmBuyerBurner'
  | 'AssetToken'
  | 'AssetTokenIssuer'
  | 'AssetTokenData'
  | 'XGoldBundle'
  | 'XGoldBundleStorage'

export default Object.fromEntries(
  requireFile
    .keys()
    .map((fileName) => [
      fileName.replace('./', '').replace('.json', ''),
      requireFile(fileName),
    ]),
) as Record<ABINames, utils.Fragment[]>
