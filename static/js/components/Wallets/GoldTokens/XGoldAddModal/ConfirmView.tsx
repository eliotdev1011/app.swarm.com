import { normalize } from '@swarm/core/shared/utils/helpers'
import { AlchemyNFT } from '@swarm/types/tokens'
import { RouterLink } from '@swarm/ui/presentational/RouterLink'
import { useTranslation } from 'react-i18next'
import { generatePath } from 'react-router'
import { Flex, Heading, Icon } from 'rimble-ui'
import { Text } from 'rimble-ui'

import { ROUTES } from 'src/routes'

import { useXGoldContext } from '../XGoldContext'
import { SelectedNFTWrapper } from '../styled-components'

interface ConfirmViewProps {
  selectedNfts: AlchemyNFT[]
  onGoToSelect: () => void
  onRemoveNft: (nft: AlchemyNFT) => void
}

const ConfirmView = ({
  onGoToSelect,
  selectedNfts,
  onRemoveNft,
}: ConfirmViewProps) => {
  const { t } = useTranslation('modals', { keyPrefix: 'xGoldAddModal' })
  const { goldNfts, xGoldTokensForGoldKg, xGoldTokensForGoldOz, xGold } =
    useXGoldContext()
  const hasGoldNfts = goldNfts.length > 0
  const hasSelectedNfts = selectedNfts.length > 0
  const normalizedXGoldTokensForGoldKg =
    xGoldTokensForGoldKg &&
    normalize(xGoldTokensForGoldKg?.toString(), xGold?.decimals).toString()
  const normalizedXGoldTokensForGoldOz =
    xGoldTokensForGoldOz &&
    normalize(xGoldTokensForGoldOz?.toString(), xGold?.decimals).toString()

  const renderNftList = () => {
    if (hasSelectedNfts) {
      return (
        <Flex flexDirection="column" style={{ gap: '8px' }}>
          {selectedNfts.map((nft) => (
            <Flex alignItems="center" key={nft.id} width="100%">
              <SelectedNFTWrapper
                alignItems="center"
                justifyContent="space-between"
                p="12px"
                width="100%"
              >
                <Flex>
                  <Text.span>
                    {nft.symbol}: ID: {nft.tokenId}
                  </Text.span>
                </Flex>
                <Icon size="25px" name="CheckCircle" color="green" />
              </SelectedNFTWrapper>
              <Icon
                onClick={() => onRemoveNft(nft)}
                color="red"
                size="20px"
                ml="16px"
                name="RemoveCircleOutline"
                style={{ cursor: 'pointer' }}
              />
            </Flex>
          ))}
        </Flex>
      )
    }

    if (hasGoldNfts) {
      return (
        <SelectedNFTWrapper
          onClick={onGoToSelect}
          justifyContent="center"
          p="12px"
        >
          <Text.span>{t('selectNfts')}</Text.span>
        </SelectedNFTWrapper>
      )
    }

    return (
      <SelectedNFTWrapper justifyContent="center" p="12px">
        <Text.span>
          {t('noNfts.main')}
          <RouterLink
            pathname={generatePath(ROUTES.DOTC_CATEGORY, { category: 'gold' })}
          >
            <Text.span style={{ textDecoration: 'underline' }}>
              {t('noNfts.here')}
            </Text.span>
          </RouterLink>
          .
        </Text.span>
      </SelectedNFTWrapper>
    )
  }

  return (
    <>
      <Heading as="h4" fontSize={4} fontWeight={5} mt={0} mb="20px">
        {t('header')}
      </Heading>
      <Text.span>{t('addNfts')}</Text.span>
      <ul style={{ margin: 0, paddingLeft: '30px' }}>
        <li>
          {t('info.goldOzPrice', {
            price: normalizedXGoldTokensForGoldOz,
          })}
        </li>
        <li>
          {t('info.goldKgPrice', {
            price: normalizedXGoldTokensForGoldKg,
          })}
        </li>
      </ul>
      <Text.span mt="10px">{t('info.burn')}</Text.span>
      <Heading as="h4" fontSize={4} fontWeight={5} my="10px">
        {t('add')}
      </Heading>
      {renderNftList()}
    </>
  )
}

export default ConfirmView
