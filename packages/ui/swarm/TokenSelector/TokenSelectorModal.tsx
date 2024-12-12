import { arrayWrap, tokenFilter } from '@swarm/core/shared/utils'
import { compareTokensBy } from '@swarm/core/shared/utils/filters'
import { normalizeUSDCE } from '@swarm/core/shared/utils/tokens'
import { isSameEthereumAddress } from '@swarm/core/web3/utils'
import { TokenSelectorAsset } from '@swarm/types/tokens'
import uniqBy from 'lodash/uniqBy'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Button, Flex, Heading, Input, Loader, Text } from 'rimble-ui'

import Dialog from '@ui/presentational/Dialog'
import Divider from '@ui/presentational/Divider'

import TokenInfoPopup from '../Popups/TokenInfoPopup'

import TokenItem from './TokenItem'
import TokenCategory from './components/TokenCategory'
import { TokenSelectorModalProps } from './types'

const TokenSelectorModal = <T extends TokenSelectorAsset>({
  isOpen,
  isFilter = false,
  onClose,
  selected,
  onSelection,
  onCategorySelection,
  onButtonClick,
  onSearch,
  title = isFilter ? 'tokenModal.filterHeader' : 'tokenModal.selectHeader',
  buttonLabel = 'tokenModal.button',
  filter,
  badge,
  tokens = [],
  categories,
  selectedCategory,
  loading = false,
  orderBy,
  withoutPortal = false,
  orderDirection = 'asc',
  showTokenInfo = false,
  ActionComponent,
  BottomActionComponent,
  NoResultsComponent = '',
  disableSearching = false,
  groupNFTsByAddress = false,
}: TokenSelectorModalProps<T>) => {
  const { t } = useTranslation('swap')
  const [search, setSearch] = useState('')
  const [infoToken, setInfoToken] = useState<T | null>(null)
  const filteredTokens: T[] = useMemo(() => {
    let filtered = disableSearching
      ? tokens.filter((token) => filter?.(token) ?? true)
      : tokens.filter(tokenFilter(search))

    if (groupNFTsByAddress) {
      filtered = uniqBy(filtered, 'address')
    }

    if (orderBy) {
      filtered.sort(compareTokensBy([orderBy, orderDirection]))
    }
    return filtered.map(normalizeUSDCE)
  }, [
    disableSearching,
    tokens,
    search,
    groupNFTsByAddress,
    orderBy,
    filter,
    orderDirection,
  ])

  const getShowTokenInfo = (token: T) => {
    switch (typeof showTokenInfo) {
      case 'boolean': {
        return showTokenInfo
      }
      case 'function': {
        return showTokenInfo(token)
      }
      default: {
        return false
      }
    }
  }

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    onSearch?.(e.target.value)
  }

  const handleTokenClick = useCallback(
    (token: T) => () => onSelection(token),
    [onSelection],
  )

  const handleInfoTokenClick = (token: T) => () => setInfoToken(token)
  const handleCloseInfoPopup = () => setInfoToken(null)

  return (
    <Dialog
      isOpen={isOpen}
      width={['100%', '460px']}
      maxHeight={['90%', '80%']}
      height={['90%', 'auto']}
      justifyContent="stretch"
      flex="1 0 100%"
      withoutPortal={withoutPortal}
    >
      <Box>
        <Button.Text
          icononly
          bg="transparent"
          mainColor="grey"
          icon="Close"
          position="absolute"
          top="34px"
          right="18px"
          height="28px"
          onClick={onClose}
          boxShadow={0}
        />
        <Heading color="text" as="h4" fontSize={4} fontWeight={5} mt={0}>
          {t(title)}
        </Heading>
        <Input
          width="100%"
          bg="white"
          height="36px"
          placeholder="Search token name or paste contract address"
          onChange={inputChangeHandler}
          defaultValue={search}
        />
        {ActionComponent}
        <TokenCategory
          categories={categories}
          onCategorySelection={onCategorySelection}
          selectedCategory={selectedCategory}
        />
        <Divider mb={0} marginTop={ActionComponent ? '10px' : '20px'} />
      </Box>
      <Flex
        flexDirection="column"
        overflowY="auto"
        minHeight="100px"
        py={3}
        flex="1 1 auto"
      >
        {loading ? (
          <Text.span fontWeight={2} color="grey">
            <Loader size="30px" mt={4} mx="auto" />
          </Text.span>
        ) : !tokens.length ? (
          NoResultsComponent || (
            <Text.span fontWeight={2} color="grey" textAlign="center">
              {t('tokenModal.noResults')}
            </Text.span>
          )
        ) : (
          filteredTokens.map((token) => (
            <TokenItem
              key={token.id}
              symbol={token.symbol}
              tokenId={groupNFTsByAddress ? undefined : token.tokenId}
              name={token.name}
              logo={token?.logo}
              badge={badge?.(token)}
              onClick={handleTokenClick(token)}
              onClickInfo={handleInfoTokenClick(token)}
              showTokenInfo={getShowTokenInfo(token)}
              background={
                arrayWrap(selected).some((selectedToken) =>
                  isSameEthereumAddress(selectedToken.id, token.id),
                )
                  ? 'rgba(150,150,150,0.2)'
                  : 'none'
              }
            />
          ))
        )}
      </Flex>
      <Divider mt={0} />
      {BottomActionComponent}
      {!!onButtonClick && (
        <Box>
          <Button
            type="submit"
            width="100%"
            height={['40px', '52px']}
            fontWeight={4}
            fontSize={[2, 3]}
            onClick={onButtonClick}
            style={{ display: 'flex', justifyContent: 'flex-start' }}
          >
            {t(buttonLabel)}
          </Button>
        </Box>
      )}
      {infoToken && getShowTokenInfo(infoToken) && (
        <TokenInfoPopup
          token={infoToken}
          kya={infoToken.kya}
          isOpen={!!infoToken}
          onClose={handleCloseInfoPopup}
        />
      )}
    </Dialog>
  )
}

export default TokenSelectorModal
