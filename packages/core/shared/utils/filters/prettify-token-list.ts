import { AbstractToken } from '@swarm/types/tokens'

import { compose } from '../helpers/compose'
import {
  fillEtherFields,
  idToAddress,
  idToAddressXToken,
} from '../tokens/converters'

import { compareTokensBy } from './compare-tokens-by'
import { tokenFilter } from './token-filter'

export const prettifyTokenList = <T extends AbstractToken>(list?: T[]): T[] =>
  (list || [])
    .map(compose(fillEtherFields, idToAddress, idToAddressXToken))
    .filter(tokenFilter())
    .sort(compareTokensBy('symbol'))
