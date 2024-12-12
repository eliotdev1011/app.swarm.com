import { NestedKeys } from '@swarm/types/helpers'
import { AbstractAsset } from '@swarm/types/tokens'
import Big, { BigSource } from 'big.js'
import get from 'lodash/get'

import { big } from '@swarm/core/shared/utils/helpers'

import { directionToNumber } from '../lodash'

const compareBig = (a: unknown, b: unknown) => {
  const bigA = big((a ?? 0) as BigSource)

  if (bigA.eq((b ?? 0) as BigSource)) {
    return 0
  }

  return bigA.gt((b ?? 0) as BigSource) ? 1 : -1
}

const compareString = (a: unknown, b: unknown) => {
  if ((a as string).toLowerCase() === (b as string).toLowerCase()) {
    return 0
  }

  return (a as string).toLowerCase() > (b as string).toLowerCase() ? 1 : -1
}

const compareNumber = (a: unknown, b: unknown) => {
  if (a === b) {
    return 0
  }

  return Number(a) > Number(b) ? 1 : -1
}

type Criteria<Path> = Path | [Path, 'asc' | 'desc']

export const compareTokensBy =
  <T extends AbstractAsset = AbstractAsset>(
    ...criteria: Criteria<NestedKeys<T>>[]
  ) =>
  (a: T, b: T) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const criterion of criteria) {
      const [prop, direction] = (
        Array.isArray(criterion) ? criterion : [criterion]
      ) as [NestedKeys<T>, 'asc' | 'desc']
      const directionNumber = directionToNumber(direction)

      let comparisonValue = 0

      const aValue = get(a, prop)
      const bValue = get(b, prop)

      if (aValue !== bValue) {
        if (
          (aValue as unknown) instanceof Big ||
          (bValue as unknown) instanceof Big
        ) {
          comparisonValue = compareBig(aValue, bValue) * directionNumber
        } else if (typeof aValue === 'string' || typeof bValue === 'string') {
          comparisonValue = compareString(aValue, bValue) * directionNumber
        } else if (typeof aValue === 'number' || typeof aValue === 'number') {
          comparisonValue = compareNumber(aValue, bValue) * directionNumber
        }

        if (comparisonValue !== 0) {
          return comparisonValue
        }
      }
    }

    return 0
  }
