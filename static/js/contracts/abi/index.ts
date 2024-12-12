import { utils } from 'ethers'

const requireFile = require.context('./', true, /[\w-]+\.json$/)

type ABINames = 'ActionManager' | 'OTC' | 'NativeTokenWrapper'

export default Object.fromEntries(
  requireFile
    .keys()
    .map((fileName) => [
      fileName.replace('./', '').replace('.json', ''),
      requireFile(fileName),
    ]),
) as Record<ABINames, utils.Fragment[]>
