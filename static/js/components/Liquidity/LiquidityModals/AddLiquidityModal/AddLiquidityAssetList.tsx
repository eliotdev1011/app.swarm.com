import config from '@swarm/core/config'
import { ExtendedPoolToken } from '@swarm/types/tokens'
import { useTranslation } from 'react-i18next'
import { Link, Text } from 'rimble-ui'

import LiquidityAssetList from 'src/components/Liquidity/LiquidityModals/LiquidityAssetList'

import AddMultipleAssetsRow from './AddMultipleAssetsRow'
import AddSingleAssetRow from './AddSingleAssetRow'

const { poolsAddLiquidity: learnHowLink } = config.resources.docs.coreConcepts

interface AddLiquidityAssetListProps {
  tokens: ExtendedPoolToken[]
  selected?: string
  value?: number
  onChange?: (value: number) => void
  onSelection: (token: ExtendedPoolToken | 'all') => void
  maxAmountsIn: Record<string, number>
  disabled?: boolean
}

const AddLiquidityAssetList = ({
  tokens,
  selected,
  value = 0,
  maxAmountsIn,
  onChange,
  onSelection,
  disabled = false,
}: AddLiquidityAssetListProps) => {
  const { t } = useTranslation('liquidityModals')

  const noMinDenormWeight = tokens.some(
    ({ address }) => maxAmountsIn[address] === 0,
  )

  const multiple = selected === 'all' && !noMinDenormWeight

  return (
    <>
      {noMinDenormWeight && (
        <Text.span color="near-black">
          {t('add.addMultipleInstructions')}{' '}
          <Link href={learnHowLink} target="_blank" rel="noopener">
            {t('learnHow')}
          </Link>
        </Text.span>
      )}
      {!noMinDenormWeight && (
        <AddMultipleAssetsRow
          onSelect={onSelection}
          checked={selected === 'all'}
          onChange={onChange}
          value={value}
          disabled={disabled}
        />
      )}
      <LiquidityAssetList>
        {tokens.map((token) => (
          <AddSingleAssetRow
            key={token.id}
            token={token}
            checked={selected === token.id}
            onSelect={onSelection}
            onChange={onChange}
            value={multiple ? (value * maxAmountsIn[token.id]) / 100 : value}
            multiple={multiple}
            disabled={disabled || !maxAmountsIn[token.id]}
          />
        ))}
      </LiquidityAssetList>
    </>
  )
}

export default AddLiquidityAssetList
