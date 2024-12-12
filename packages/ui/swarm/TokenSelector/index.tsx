import { TokenSelectorAsset } from '@swarm/types/tokens'
import { useCallback, useState } from 'react'

import BalanceTokenSelectorModal from './BalanceTokenSelectorModal'
import TokenSelectorView from './TokenSelectorView'
import { TokenSelectorProps } from './types'

const TokenSelector = <T extends TokenSelectorAsset = TokenSelectorAsset>({
  tokens,
  onChange,
  selected,
  filter,
  loading = false,
  orderBy,
  orderDirection = 'asc',
  emptyValue,
  readonly = false,
  showTokenInfo = false,
  withoutPortal,
  View = TokenSelectorView,
  onSearch,
  groupNFTsByAddress = false,
}: TokenSelectorProps<T>) => {
  const [modalOpen, setModalOpen] = useState(false)

  const handleModalClose = () => {
    setModalOpen(false)
  }

  const onModalOpen = () => {
    if (!readonly) {
      setModalOpen(true)
    }
  }

  const handleTokenSelection = useCallback(
    (token: T) => {
      setModalOpen(false)
      onChange?.(token)
    },
    [onChange],
  )

  return (
    <>
      <View
        tokens={tokens}
        onChange={onChange}
        selected={selected}
        loading={loading}
        emptyValue={emptyValue}
        readonly={readonly}
        onModalOpen={onModalOpen}
        onTokenSelection={handleTokenSelection}
      />

      {modalOpen && (
        <BalanceTokenSelectorModal
          isOpen={modalOpen}
          onClose={handleModalClose}
          selected={selected}
          onSearch={onSearch}
          onSelection={handleTokenSelection}
          filter={filter}
          tokens={tokens}
          loading={loading}
          orderBy={orderBy}
          orderDirection={orderDirection}
          withoutPortal={withoutPortal}
          showTokenInfo={showTokenInfo}
          groupNFTsByAddress={groupNFTsByAddress}
        />
      )}
    </>
  )
}

export default TokenSelector

export * from './types'
