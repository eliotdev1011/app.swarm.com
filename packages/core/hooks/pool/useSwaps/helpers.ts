/* eslint-disable camelcase */
import { getUnixTime } from 'date-fns'

import { UseSwapsOptions } from './types'

export const mapSwapOptionsToVariables = ({
  tokens,
  dateFrom,
  userAddress,
  limit,
}: UseSwapsOptions) => ({
  filter: {
    tokenIn_in: tokens,
    tokenOut_in: tokens,
    timestamp_gt: dateFrom && getUnixTime(dateFrom),
    ...(userAddress && { userAddress: userAddress?.toLowerCase() }),
  },
  limit,
})
