import { useAccount } from '@swarm/core/web3'
import { AlchemyNFT } from '@swarm/types/tokens'
import NftBalance from '@swarm/ui/swarm/NftBalance'
import TokenIcon from '@swarm/ui/swarm/TokenIcon'
import { useTranslation } from 'react-i18next'
import { Box, Flex, Heading, Text } from 'rimble-ui'

import { useXGoldContext } from '../XGoldContext'
import {
  GoldNftsListItemWrapper,
  GoldNftsListWrapper,
} from '../styled-components'

interface SelectViewProps {
  selectedNfts: AlchemyNFT[]
  onSelect: (nft: AlchemyNFT) => void
}

const SelectView = ({ selectedNfts, onSelect }: SelectViewProps) => {
  const { t } = useTranslation('modals', { keyPrefix: 'xGoldAddModal' })
  const account = useAccount()
  const { goldNfts } = useXGoldContext()

  const checkNftSelected = (nftToCheck: AlchemyNFT) =>
    selectedNfts.some((nft) => nft.id === nftToCheck.id)

  return (
    <>
      <Heading as="h4" fontSize={4} fontWeight={5} mt={0} mb="20px">
        {t('actions.selectNfts')}
      </Heading>
      <GoldNftsListWrapper>
        {goldNfts.map((nft) => (
          <GoldNftsListItemWrapper
            onClick={() => onSelect(nft)}
            $selected={checkNftSelected(nft)}
            key={nft.id}
          >
            <Flex ml={2} alignItems="center">
              <TokenIcon
                symbol={nft.symbol}
                name={nft.name}
                width="32px"
                height="32px"
                mr="10px"
              />
              <Box>
                <Text.span fontSize={2} fontWeight={5}>
                  {nft.symbol}
                </Text.span>
                {nft.name && (
                  <Text.span fontSize={2} fontWeight={2} ml="8px">
                    ({nft.name})
                  </Text.span>
                )}
                <Text.span fontSize={2} fontWeight={2} ml="8px">
                  ID: {nft.tokenId}
                </Text.span>
              </Box>
            </Flex>
            <NftBalance
              account={account}
              contractAddress={nft.address}
              tokenId={nft.tokenId}
            />
          </GoldNftsListItemWrapper>
        ))}
      </GoldNftsListWrapper>
    </>
  )
}

export default SelectView
