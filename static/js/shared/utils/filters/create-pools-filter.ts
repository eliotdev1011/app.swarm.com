/* eslint-disable camelcase */
import config from '@swarm/core/config'

interface PoolsFilterConfig {
  addressListToExclude?: string[]
  id?: string
  addressToExclude?: string
  tokenListContains?: string[]
}

const { poolsToExclude } = config

// TODO: add more filters
export const createPoolsFilter = ({
  id,
  addressListToExclude = [],
  addressToExclude,
  tokenListContains = [],
}: PoolsFilterConfig = {}) => ({
  ...((addressListToExclude.length || poolsToExclude?.length) && {
    id_not_in: [...addressListToExclude, ...poolsToExclude],
  }),
  ...(tokenListContains?.length && { tokensList_contains: tokenListContains }),
  ...(id && { id }),
  ...(addressToExclude && { id_not: addressToExclude }),
})
