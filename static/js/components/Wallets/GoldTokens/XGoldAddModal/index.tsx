import { BasicModalProps } from '@swarm/core/hooks/state/usePopupState'
import useAllowance from '@swarm/core/hooks/web3/useAllowance'
import useEnableAsset from '@swarm/core/hooks/web3/useEnableAsset'
import { TokenType } from '@swarm/core/shared/enums'
import { normalize } from '@swarm/core/shared/utils/helpers'
import { useAccount } from '@swarm/core/web3'
import { AlchemyNFT } from '@swarm/types/tokens'
import Dialog from '@swarm/ui/presentational/Dialog/Dialog'
import SmartButton from '@swarm/ui/swarm/Buttons/SmartButton'
import { providers } from 'ethers'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, Heading, Icon, Text } from 'rimble-ui'

import useDepositNewAssets from 'src/hooks/web3/wallet/useDepositNewAssets'

import { useXGoldContext } from '../XGoldContext'
import XGoldInput from '../XGoldInput'
import { groupGoldNfts } from '../utils'

import ConfirmView from './ConfirmView'
import SelectView from './SelectView'

export interface XGoldAddModalProps extends BasicModalProps {
  tx?: providers.TransactionResponse
}

enum View {
  Select,
  Confirm,
}

const XGoldAddModal = ({ isOpen, onClose }: XGoldAddModalProps) => {
  const { t } = useTranslation('modals', { keyPrefix: 'xGoldAddModal' })

  const [view, setView] = useState<View>(View.Confirm)
  const {
    xGold,
    goldKgAddress,
    goldOzAddress,
    xGoldTokensForGoldKg,
    xGoldTokensForGoldOz,
  } = useXGoldContext()
  const { goldNfts, openAddedSuccessfullyModal } = useXGoldContext()
  const [selectedNfts, setSelectedNfts] = useState<AlchemyNFT[]>([])
  const { goldKgNfts: selectedGoldKgNfts, goldOzNfts: selectedGoldOzNfts } =
    useMemo(
      () => groupGoldNfts(selectedNfts, goldKgAddress, goldOzAddress),
      [goldKgAddress, goldOzAddress, selectedNfts],
    )
  const [depositNewAssets, { txLoading }] = useDepositNewAssets()
  const [enableAsset, { txLoading: enableAssetLoading }] = useEnableAsset()
  const account = useAccount()
  const [goldKgAllowance, { allowanceLoading: goldKgAllowanceLoading }] =
    useAllowance({
      account,
      spender: xGold?.id,
      asset: goldKgAddress,
      type: TokenType.erc1155,
    })
  const [goldOzAllowance, { allowanceLoading: goldOzAllowanceLoading }] =
    useAllowance({
      account,
      spender: xGold?.id,
      asset: goldOzAddress,
      type: TokenType.erc1155,
    })
  const receivedValue = useMemo(() => {
    const goldKgValue = xGoldTokensForGoldKg?.mul(
      selectedGoldKgNfts?.length || 0,
    )
    const goldOzValue = xGoldTokensForGoldOz?.mul(
      selectedGoldOzNfts?.length || 0,
    )

    const totalValue = goldKgValue?.add(goldOzValue || 0)

    const normalizedTotalValue =
      totalValue && normalize(totalValue.toString(), xGold?.decimals)

    return normalizedTotalValue
  }, [
    xGoldTokensForGoldKg,
    xGoldTokensForGoldOz,
    selectedGoldKgNfts?.length,
    selectedGoldOzNfts?.length,
    xGold?.decimals,
  ])

  const hasGoldNfts = goldNfts.length > 0
  const hasSelectedNfts = selectedNfts.length > 0

  const disabled = !hasGoldNfts || !hasSelectedNfts
  const loading =
    txLoading ||
    enableAssetLoading ||
    goldKgAllowanceLoading ||
    goldOzAllowanceLoading

  const resetDialog = () => {
    setView(View.Confirm)
    setSelectedNfts([])
  }

  const handleCloseDialog = () => {
    onClose?.()
    resetDialog()
  }

  const handleBack = () => {
    if (view === View.Confirm) {
      resetDialog()
      onClose?.()
      return
    }
    setSelectedNfts([])
    setView(View.Confirm)
  }

  const handleSelectNft = (selectedNft: AlchemyNFT) => {
    const nft = selectedNfts.find((_nft) => selectedNft.id === _nft.id)

    if (nft) {
      setSelectedNfts(selectedNfts.filter((_nft) => selectedNft.id !== _nft.id))
      return
    }
    setSelectedNfts([...selectedNfts, selectedNft])
  }

  const handleConfirm = async () => {
    if (selectedGoldKgNfts.length && !goldKgAllowance?.gt(0) && xGold) {
      enableAsset(selectedGoldKgNfts[0], xGold?.id, TokenType.erc1155)
      return
    }

    if (selectedGoldOzNfts.length && !goldOzAllowance?.gt(0) && xGold) {
      enableAsset(selectedGoldOzNfts[0], xGold?.id, TokenType.erc1155)
      return
    }

    const receipt = await depositNewAssets(selectedNfts)

    if (receipt?.status && receivedValue) {
      onClose?.()
      openAddedSuccessfullyModal({
        txHash: receipt.transactionHash,
        nftsCount: selectedNfts.length,
        xGoldAmount: receivedValue,
      })
    }
  }

  const handleSelect = () => {
    setView(View.Confirm)
  }

  const getButtonCaption = () => {
    if (view === View.Select) {
      return t('actions.select')
    }
    if (selectedGoldKgNfts.length && !goldKgAllowance?.gt(0)) {
      return t('actions.approve', { symbol: selectedGoldKgNfts[0]?.symbol })
    }
    if (selectedGoldOzNfts.length && !goldOzAllowance?.gt(0)) {
      return t('actions.approve', { symbol: selectedGoldOzNfts[0]?.symbol })
    }

    return t('actions.confirm')
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleCloseDialog}
      width={['100%', '550px']}
      minHeight="450px"
      height="auto"
      closeNode={null}
    >
      <Flex
        alignItems="center"
        onClick={handleBack}
        style={{ cursor: 'pointer' }}
        mb="16px"
      >
        <Icon color="primary" size="16px" name="ArrowBack" />
        <Text.span ml="4px" color="primary">
          {t('actions.goBack')}
        </Text.span>
      </Flex>
      {view === View.Confirm && (
        <ConfirmView
          selectedNfts={selectedNfts}
          onGoToSelect={() => setView(View.Select)}
          onRemoveNft={handleSelectNft}
        />
      )}
      {view === View.Select && (
        <SelectView onSelect={handleSelectNft} selectedNfts={selectedNfts} />
      )}
      <Heading as="h4" fontSize={4} fontWeight={5} my="10px">
        {t('receive')}
      </Heading>
      {xGold?.name && xGold?.symbol && (
        <XGoldInput
          readonly
          value={receivedValue?.toString()}
          name={xGold?.name}
          symbol={xGold?.symbol}
          nameColor="primary"
        />
      )}
      <SmartButton
        requireInitiated
        requireAccount
        loading={loading}
        disabled={disabled}
        color="primary"
        fontWeight="600"
        height="52px"
        fontSize="20px"
        mt="20px"
        onClick={view === View.Confirm ? handleConfirm : handleSelect}
      >
        {getButtonCaption()}
      </SmartButton>
    </Dialog>
  )
}

export default XGoldAddModal
