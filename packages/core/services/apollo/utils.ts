/* eslint-disable @typescript-eslint/no-explicit-any */
import { FieldFunctionOptions, FieldMergeFunction } from '@apollo/client'

import map from 'lodash/map'

const mergeEntities: FieldMergeFunction<
  any,
  any,
  FieldFunctionOptions<Record<string, any>, Record<string, any>>
> = (existing = [], incoming = [], { args }) => {
  // skipping offers request for best price
  if (args?.first === 1) return incoming

  const skip = args?.skip || 0

  if (skip === 0) return incoming

  const existingRefs = map(existing, '__ref')

  if (incoming.length)
    return existing.concat(
      incoming.filter(
        (row: { __ref: string }) =>
          // eslint-disable-next-line no-underscore-dangle
          !existingRefs.includes(row.__ref),
      ),
    )

  return existing
}

export { mergeEntities }
