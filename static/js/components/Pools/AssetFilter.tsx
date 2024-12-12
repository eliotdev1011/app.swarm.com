import config from '@swarm/core/config'
import useFeatureFlags, {
  FlaggedFeatureName,
} from '@swarm/core/hooks/data/useFeatureFlags'
import { useStoredNetworkId } from '@swarm/core/web3'
import { AbstractToken, PoolToken } from '@swarm/types/tokens'
import Clickable from '@swarm/ui/presentational/Clickable'
import TokenIcon from '@swarm/ui/swarm/TokenIcon'
import TokenSelectorModal from '@swarm/ui/swarm/TokenSelector/TokenSelectorModal'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Button, Icon, Text } from 'rimble-ui'
import styled from 'styled-components/macro'
import { FlexBasisProps, FlexboxProps, MarginProps } from 'styled-system'

const { matchNetworkSupportsSmartPools } = config

const StyledButton = styled(Button.Text)`
  outline: none;
  height: 32px;
  /* 
    Button.Text sets a z-index on the label so we need to reset its stacking context
    so it doesn't overlap with other items in the page like the header
  */
  transform: translate(0);
`

const StyledClickable = styled(Clickable)`
  border-radius: 4px;
  padding: 4px 8px;
  display: flex;
  align-items: center;
  border: 1px solid #e9eaf2;
  height: 32px;

  &:hover {
    background: rgba(200, 200, 200, 0.2);
  }
`

const PillContainer = styled(Box)`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 8px;
`

interface TokenPillProps extends MarginProps {
  token: AbstractToken
  onRemove: () => void
}

const TokenPill = ({ token, onRemove, ...props }: TokenPillProps) => {
  return (
    <StyledClickable alignItems="center" onClick={onRemove} {...props}>
      <TokenIcon
        symbol={token.symbol}
        name={token.name}
        width="16px"
        height="16px"
        mr={1}
      />
      <Text color="black" fontSize="14px" fontWeight={600} mr={1}>
        {token.symbol}
      </Text>
      <Icon name="Close" size="16px" color="black" />
    </StyledClickable>
  )
}

interface AssetFilterProps extends FlexBasisProps, FlexboxProps {
  tokens: PoolToken[]
  loading?: boolean
  category: string
  setCategory: (category: string | undefined) => void
  value: PoolToken[]
  onSubmit: (value: PoolToken[]) => void
  showTokenInfo?: boolean
}

const AssetFilter = ({
  tokens,
  loading,
  category,
  setCategory,
  value,
  onSubmit,
  showTokenInfo = false,
  ...props
}: AssetFilterProps) => {
  const networkId = useStoredNetworkId()

  const { t } = useTranslation('pools')
  const { checkFeature } = useFeatureFlags()
  const [tempSelection, setTempSelection] = useState(value)
  const [modalOpen, setModalOpen] = useState(false)
  const [tempCategory, setTempCategory] = useState<string | undefined>(category)

  const toggleCategory = (newCategory: string): void => {
    setTempCategory((currentTempCategory) => {
      if (currentTempCategory === newCategory) {
        return undefined
      }
      return newCategory
    })
  }

  const handleFilterButtonClick = () => {
    if (value.length) {
      onSubmit([])
    } else {
      setTempSelection(value)
      setModalOpen(true)
    }
  }
  const handleModalClose = () => setModalOpen(false)

  const handleTokenSelection = (token: PoolToken) => {
    if (
      tempSelection.some(
        (selectedToken) => token.address === selectedToken.address,
      )
    ) {
      setTempSelection(
        tempSelection.filter(
          (selectedToken) => token.address !== selectedToken.address,
        ),
      )
    } else {
      setTempSelection([...tempSelection, token])
    }
  }

  const handleSubmit = () => {
    setModalOpen(false)
    onSubmit(tempSelection)
    setCategory(tempCategory)
  }

  const handleAssetRemove = (asset: PoolToken) => () => {
    onSubmit(value.filter((token) => token.address !== asset.address))
  }

  const categories = useMemo(() => {
    const networkSupportsSmartPools = matchNetworkSupportsSmartPools(networkId)
    if (
      networkSupportsSmartPools ||
      checkFeature(FlaggedFeatureName.smartPools)
    ) {
      return [{ label: t('categoriesFilter.smartPools'), value: 'smart-pools' }]
    }

    return []
  }, [networkId, t, checkFeature])

  return (
    <Box {...props}>
      <PillContainer>
        {value.map((token) => (
          <TokenPill
            key={token.address}
            token={token}
            onRemove={handleAssetRemove(token)}
          />
        ))}
        <StyledButton
          size="medium"
          onClick={handleFilterButtonClick}
          flexShrink={0}
          ml={0}
          p={0}
        >
          {value.length ? (
            t('clearAll')
          ) : (
            <>
              <Icon name="FilterList" size="16px" mr={1} />
              {t('filter')}
            </>
          )}
        </StyledButton>
      </PillContainer>
      {modalOpen && (
        <TokenSelectorModal
          isOpen={modalOpen}
          isFilter
          onClose={handleModalClose}
          selected={tempSelection}
          onSelection={handleTokenSelection}
          onCategorySelection={toggleCategory}
          onButtonClick={handleSubmit}
          title={t('filter')}
          buttonLabel={t('confirmFilter')}
          multiple
          tokens={tokens}
          loading={loading}
          categories={categories}
          selectedCategory={tempCategory}
          showTokenInfo={showTokenInfo}
        />
      )}
    </Box>
  )
}

export default AssetFilter
