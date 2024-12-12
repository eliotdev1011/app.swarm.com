import { utils } from 'ethers'

const requireFile = require.context('./', true, /[\w-]+\.json$/)

type ABINames = 'CRPool' | 'CRPoolProxy'

export default Object.fromEntries(
  requireFile
    .keys()
    .map((fileName) => [
      fileName.replace('./', '').replace('.json', ''),
      requireFile(fileName),
    ]),
) as Record<ABINames, utils.Fragment[]>
