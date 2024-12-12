import { AbstractToken, TokenSelectorAsset } from '@swarm/types/tokens'
import { Flex } from 'rimble-ui'

import { TokenSelectorModalProps } from '../types'

import TokenActionButton from './TokenActionButton'

type TokenCategoryProps<T extends TokenSelectorAsset = TokenSelectorAsset> =
  Pick<
    TokenSelectorModalProps<T>,
    'onCategorySelection' | 'categories' | 'selectedCategory'
  >

const TokenCategory = <T extends TokenSelectorAsset = TokenSelectorAsset>({
  onCategorySelection,
  categories,
  selectedCategory,
}: TokenCategoryProps<T>) => {
  if (
    categories === undefined ||
    categories.length === 0 ||
    onCategorySelection === undefined
  )
    return null

  return (
    <Flex marginTop="20px">
      {categories.map((category) => {
        const isSelected = category.value === selectedCategory
        return (
          <TokenActionButton
            key={category.value}
            onClick={() => onCategorySelection(category.value)}
            selected={isSelected}
            label={category.label}
          />
        )
      })}
    </Flex>
  )
}

export default TokenCategory
