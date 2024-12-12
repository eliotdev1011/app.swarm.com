import {
  denormalize,
  isBetween,
  isGreaterThan,
  isLessThan,
  normalize,
} from '@swarm/core/shared/utils/helpers/big-helpers'
import { FormikErrors } from 'formik'
import set from 'lodash/set'
import sumBy from 'lodash/sumBy'

import {
  MAX_FEE,
  MAX_POOL_SUPPLY,
  MAX_TOTAL_WEIGHT,
  MAX_WEIGHT,
  MIN_BALANCE,
  MIN_FEE,
  MIN_POOL_SUPPLY,
  MIN_WEIGHT,
} from './consts'
import { NewPoolSchema } from './types'

const validateField = <T>(
  value: T,
  validator: (value: T) => boolean,
  msg: string,
) => (validator(value) ? undefined : msg)

const addError = (
  errors: FormikErrors<NewPoolSchema>,
  path: string,
  error: string | undefined,
) => {
  if (error) {
    return set(errors, path, error)
  }

  return errors
}

export const validate = (values: NewPoolSchema) => {
  let errors: FormikErrors<NewPoolSchema> = {}

  errors = addError(
    errors,
    'swapFee',
    validateField(
      values.swapFee,
      isBetween(MIN_FEE, MAX_FEE),
      `Swap fee should be between ${MIN_FEE.times(
        100,
      ).toString()}% and ${MAX_FEE.times(100).toString()}%`,
    ),
  )

  errors = addError(
    errors,
    `assets`,
    validateField(
      sumBy(values.assets, (asset) => Number(asset.weight || 0)),
      isLessThan(MAX_TOTAL_WEIGHT),
      `Total weight should be less than ${MAX_TOTAL_WEIGHT.toString()}`,
    ),
  )

  values.assets.forEach((asset, idx) => {
    errors = addError(
      errors,
      `assets[${idx}].weight`,
      validateField(
        asset.weight,
        isBetween(MIN_WEIGHT, MAX_WEIGHT),
        `Weight should be between ${MIN_WEIGHT.toString()} and ${MAX_WEIGHT.toString()}`,
      ),
    )

    errors = addError(
      errors,
      `assets[${idx}].amount`,
      validateField(
        denormalize(asset.amount, asset.decimals),
        isGreaterThan(MIN_BALANCE),
        `Token amounts should be at least ${normalize(
          MIN_BALANCE,
          asset.decimals,
        ).toString()}`,
      ),
    )
  })

  if (values.isSmartPool === false) {
    return errors
  }

  errors = addError(
    errors,
    'smartPool.minimumGradualUpdateDuration',
    validateField(
      values.smartPool.minimumGradualUpdateDuration,
      (value) => {
        return Number.isNaN(value) === false
      },
      `Required field`,
    ),
  )

  errors = addError(
    errors,
    'smartPool.addTokenTimeLockDuration',
    validateField(
      values.smartPool.addTokenTimeLockDuration,
      (value) => {
        return (
          values.smartPool.rights.canChangeWeights === false ||
          values.smartPool.rights.canAddRemoveTokens === false ||
          value <= values.smartPool.minimumGradualUpdateDuration
        )
      },
      `Needs to be equal or smaller than the minimum gradual update duration`,
    ),
  )

  errors = addError(
    errors,
    'smartPool.addTokenTimeLockDuration',
    validateField(
      values.smartPool.addTokenTimeLockDuration,
      (value) => {
        return Number.isNaN(value) === false
      },
      `Required field`,
    ),
  )

  errors = addError(
    errors,
    'smartPool.tokenSymbol',
    validateField(
      values.smartPool.tokenSymbol,
      (value) => {
        return /\S+/.test(value)
      },
      `Required field`,
    ),
  )

  errors = addError(
    errors,
    'smartPool.tokenName',
    validateField(
      values.smartPool.tokenName,
      (value) => {
        return /\S+/.test(value)
      },
      `Required field`,
    ),
  )

  errors = addError(
    errors,
    'smartPool.initialSupply',
    validateField(
      values.smartPool.initialSupply,
      isBetween(MIN_POOL_SUPPLY, MAX_POOL_SUPPLY),
      `Initial supply should be between ${MIN_POOL_SUPPLY} and ${MAX_POOL_SUPPLY}`,
    ),
  )

  return errors
}
