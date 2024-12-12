import { BasicModalProps } from '@swarm/core/hooks/state/usePopupState'
import { normalize, ZERO } from '@swarm/core/shared/utils/helpers'
import Dialog from '@swarm/ui/presentational/Dialog/Dialog'
import SmartButton from '@swarm/ui/swarm/Buttons/SmartButton'
import { BigSource } from 'big.js'
import { providers } from 'ethers'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Flex, Heading, Icon, Text } from 'rimble-ui'

import useWithdrawAssets from 'src/hooks/web3/wallet/useWithdrawAssets'

import { useXGoldContext } from '../XGoldContext'
import XGoldInput from '../XGoldInput'
import { groupGoldNfts } from '../utils'

export interface XGoldWithdrawModalProps extends BasicModalProps {
  tx?: providers.TransactionResponse
}

const XGoldWithdrawModal = ({ isOpen, onClose }: XGoldWithdrawModalProps) => {
  const { t } = useTranslation('modals', { keyPrefix: 'xGoldWithdrawModal' })

  const [withdrawAssets, { txLoading }] = useWithdrawAssets()
  const {
    xGold,
    goldNftsInBundle,
    xGoldTokensForGoldKg,
    xGoldTokensForGoldOz,
    goldKgAddress,
    goldOzAddress,
    xGoldKg,
    xGoldOz,
    openWithdrawnSuccessfullyModal,
  } = useXGoldContext()
  const [goldKgCount, setGoldKgCount] = useState(0)
  const [goldOzCount, setGoldOzCount] = useState(0)

  const { goldKgNfts: goldKgNftsInBundle, goldOzNfts: goldOzNftsInBundle } =
    useMemo(
      () => groupGoldNfts(goldNftsInBundle, goldKgAddress, goldOzAddress),
      [goldKgAddress, goldNftsInBundle, goldOzAddress],
    )

  const normalizedXGoldTokensForGoldKg =
    xGoldTokensForGoldKg &&
    normalize(xGoldTokensForGoldKg?.toString(), xGold?.decimals).toString()
  const normalizedXGoldTokensForGoldOz =
    xGoldTokensForGoldOz &&
    normalize(xGoldTokensForGoldOz?.toString(), xGold?.decimals).toString()

  const burnValue = useMemo(() => {
    const goldKgValue = xGoldTokensForGoldKg?.mul(goldKgCount)
    const goldOzValue = xGoldTokensForGoldOz?.mul(goldOzCount)

    const totalValue = goldKgValue?.add(goldOzValue || 0)

    const normalizedTotalValue =
      totalValue && normalize(totalValue.toString(), xGold?.decimals)

    return normalizedTotalValue
  }, [
    xGoldTokensForGoldKg,
    xGoldTokensForGoldOz,
    goldKgCount,
    goldOzCount,
    xGold?.decimals,
  ])

  const disabled = !(goldKgCount || goldOzCount)

  const getMaxValue = (price?: BigSource, nftsCount?: number) => {
    if (!price || !nftsCount) return 0
    const maxValue = xGold?.balance?.div(price) || ZERO

    return maxValue.gt(nftsCount) ? nftsCount : maxValue.round(0, 0).toNumber()
  }

  const handleCloseDialog = () => {
    onClose?.()
  }

  const handleBack = () => {
    onClose?.()
  }

  const handleChangeGoldKgCount = (count: number) => {
    setGoldKgCount(count)
  }

  const handleChangeGoldOzCount = (count: number) => {
    setGoldOzCount(count)
  }

  const handleConfirm = async () => {
    const withdrawnGoldKgNfts = goldKgNftsInBundle.slice(0, goldKgCount)
    const withdrawnGoldOzNfts = goldOzNftsInBundle.slice(0, goldOzCount)
    const allWithdrawnNfts = [...withdrawnGoldKgNfts, ...withdrawnGoldOzNfts]

    const receipt = await withdrawAssets(allWithdrawnNfts)

    if (receipt?.status) {
      onClose?.()
      openWithdrawnSuccessfullyModal({
        txHash: receipt.transactionHash,
        goldOzNfts: withdrawnGoldOzNfts,
        goldKgNfts: withdrawnGoldKgNfts,
      })
    }
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
      <Heading as="h4" fontSize={4} fontWeight={5} mt={0} mb="20px">
        {t('header')}
      </Heading>
      <Text.span>{t('info.burn')}</Text.span>
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
      <Heading as="h4" fontSize={4} fontWeight={5} my="10px">
        {t('withdraw')}
      </Heading>
      {xGoldKg && xGoldOz && (
        <Box>
          <XGoldInput
            onChange={handleChangeGoldKgCount}
            maxValue={getMaxValue(
              normalizedXGoldTokensForGoldKg,
              goldKgNftsInBundle.length,
            )}
            value={goldKgCount}
            name={xGoldKg?.name}
            symbol={xGoldKg?.symbol}
          />
          <XGoldInput
            onChange={handleChangeGoldOzCount}
            maxValue={getMaxValue(
              normalizedXGoldTokensForGoldOz,
              goldOzNftsInBundle.length,
            )}
            value={goldOzCount}
            name={xGoldOz?.name}
            symbol={xGoldOz?.symbol}
          />
        </Box>
      )}
      <Heading as="h4" fontSize={4} fontWeight={5} my="10px">
        {t('burn')}
      </Heading>
      {xGold?.name && xGold?.symbol && (
        <XGoldInput
          readonly
          value={burnValue?.toString()}
          name={xGold?.name}
          symbol={xGold?.symbol}
          nameColor="primary"
        />
      )}
      <SmartButton
        requireAccount
        onClick={handleConfirm}
        loading={txLoading}
        disabled={disabled}
        color="primary"
        fontWeight="600"
        height="52px"
        fontSize="20px"
        mt="20px"
      >
        {t('actions.confirm')}
      </SmartButton>
    </Dialog>
  )
}

export default XGoldWithdrawModal
