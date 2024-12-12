import { utils } from 'ethers'

const requireFile = require.context('./', true, /[\w-]+\.json$/)

type ABINames =
  | 'CErc20'
  | 'CNativeToken'
  | 'Comptroller'
  | 'CToken'
  | 'PriceFeedOracle'

export default Object.fromEntries(
  requireFile
    .keys()
    .map((fileName) => [
      fileName.replace('./', '').replace('.json', ''),
      requireFile(fileName),
    ]),
) as Record<ABINames, utils.Fragment[]>
