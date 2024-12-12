import { Swap } from '@swarm/types'
import Big from 'big.js'

import { big } from '@core/shared/utils/helpers'

export const calculateVolume = <S extends Pick<Swap, 'poolTotalSwapVolume'>>(
  totalSwapVolume: string,
  swaps: S[],
): Big =>
  swaps?.[0]
    ? big(totalSwapVolume).minus(swaps[0].poolTotalSwapVolume)
    : big(totalSwapVolume)
