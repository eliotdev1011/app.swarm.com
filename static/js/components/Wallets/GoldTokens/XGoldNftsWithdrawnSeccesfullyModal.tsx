import { BasicModalProps } from '@swarm/core/hooks/state/usePopupState'
import { generateExplorerUrl } from '@swarm/core/shared/utils'
import { AbstractNFT } from '@swarm/types/tokens'
import Dialog from '@swarm/ui/presentational/Dialog'
import Chip from '@swarm/ui/swarm/Buttons/Chip'
import TokenIcon from '@swarm/ui/swarm/TokenIcon'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Flex, Text } from 'rimble-ui'
import styled from 'styled-components/macro'

import { useXGoldContext } from './XGoldContext'

const DetailsList = styled.ul`
  margin: 0;
  padding-left: 30px;
  margin-left: 0px;
  margin-bottom: 20px;

  li::marker {
    color: ${({ theme }) => theme.colors.primary};
  }
`
export interface XGoldNftsWithdrawnSuccessfullyModalProps
  extends BasicModalProps {
  goldKgNfts: AbstractNFT[]
  goldOzNfts: AbstractNFT[]
  txHash: string
}

const XGoldNftsWithdrawnSuccessfullyModal = ({
  isOpen,
  onClose,
  goldKgNfts,
  goldOzNfts,
  txHash,
}: XGoldNftsWithdrawnSuccessfullyModalProps) => {
  const { t } = useTranslation('modals', {
    keyPrefix: 'xGoldNftsWithdrawnSeccesfullyModal',
  })
  const { xGold } = useXGoldContext()

  const explorerUrl = useMemo(
    () => generateExplorerUrl({ type: 'tx', hash: txHash }),
    [txHash],
  )

  const goldKgCount = goldKgNfts.length
  const goldOzCount = goldOzNfts.length
  const nftsCount = goldKgCount + goldOzCount

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      width={['100%', '550px']}
      maxHeight={['90%', '80%']}
      height="auto"
      padding={0}
    >
      <Flex flexDirection="column" alignItems="center" mb={3}>
        <TokenIcon symbol={xGold?.symbol} height="95px" maxWidth="95px" />

        <Text
          fontSize={4}
          fontWeight={5}
          mb={3}
          color="primary"
          textAlign="center"
        >
          {t('header', { count: nftsCount })}
        </Text>

        <Chip.Link href={explorerUrl} target="_blank" mb={3}>
          {t('actions.viewTx')}
        </Chip.Link>

        <Text fontSize="18px" fontWeight={4}>
          {t('info.whatHappens')}
        </Text>
      </Flex>

      <DetailsList>
        <li>
          <Text fontSize={2} color="primary">
            {t('info.youReceived')}
            {goldOzCount ? `${goldOzCount} ${goldOzNfts[0].symbol}` : ''}
            {goldOzCount && goldKgCount ? t('info.and') : ''}
            {goldKgCount ? `${goldKgCount} ${goldKgNfts[0].symbol}` : ''}
            {t('info.nftsFromBundle')}
          </Text>
        </li>
        <li>
          <Text fontSize={2} color="primary">
            {t('info.trade')}
          </Text>
        </li>
        <li>
          <Text fontSize={2} color="primary">
            {t('info.nonGoverned')}
          </Text>
        </li>
      </DetailsList>

      <Button.Outline
        mx="auto"
        width="auto"
        height="36px"
        px="94px"
        py="6px"
        borderColor="primary"
        border="1.5px solid"
        fontWeight={4}
        onClick={onClose}
      >
        {t('actions.gotIt')}
      </Button.Outline>
    </Dialog>
  )
}

export default XGoldNftsWithdrawnSuccessfullyModal
