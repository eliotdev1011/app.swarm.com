import useTransactionAlerts from '@swarm/core/hooks/i18n/useTransactionAlerts'
import { BasicModalProps } from '@swarm/core/hooks/state/usePopupState'
import { prettifyBalance } from '@swarm/core/shared/utils/formatting/prettify-balance'
import {
  big,
  denormalize,
  ZERO,
} from '@swarm/core/shared/utils/helpers/big-helpers'
import wait from '@swarm/core/shared/utils/helpers/wait'
import { getInputPrecision } from '@swarm/core/shared/utils/tokens/precision'
import { useAccount } from '@swarm/core/web3'
import { StockToken } from '@swarm/types/tokens/invest'
import Dialog from '@swarm/ui/presentational/Dialog/Dialog'
import Divider from '@swarm/ui/presentational/Divider'
import Loader from '@swarm/ui/presentational/Loader'
import { AddressSelectOption } from '@swarm/ui/swarm/AddressSelect'
import ConnectedAddressSelect from '@swarm/ui/swarm/AddressSelect/ConnectedAddressSelect'
import SecondaryButton from '@swarm/ui/swarm/Buttons/SecondaryButton'
import SmartButton from '@swarm/ui/swarm/Buttons/SmartButton'
import MaxInput from '@swarm/ui/swarm/MaxInput'
import { useSnackbar } from '@swarm/ui/swarm/Snackbar'
import TokenBalance from '@swarm/ui/swarm/TokenBalance'
import capitalize from 'lodash/capitalize'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Flex, Heading, Text } from 'rimble-ui'

export interface StockTokenRedeemModalProps extends BasicModalProps {
  asset?: StockToken
  withoutPortal?: boolean
}

const StockTokenRedeemModal = ({
  isOpen,
  onClose,
  asset,
  withoutPortal = false,
}: StockTokenRedeemModalProps) => {
  const { t } = useTranslation(['invest', 'popups', 'common', 'errors'])
  const { addError } = useSnackbar()
  const { track } = useTransactionAlerts()

  const account = useAccount()
  const [selectedAddress, setSelectedAddress] = useState(account ?? null)

  const [amount, setAmount] = useState(ZERO)

  const amountToReceiveUsdValue = useMemo(
    () => amount.times(asset?.exchangeRate ?? 0),
    [amount, asset?.exchangeRate],
  )

  const [txLoading, setTxLoading] = useState(false)

  const handleAmountChange = useCallback(
    (value: number, stringValue: string) => {
      if (!Number.isNaN(value)) {
        setAmount(big(stringValue))
      }
    },
    [setAmount],
  )

  const handleSelectChange = useCallback(
    (selection: AddressSelectOption | null) => {
      if (selection && selection.value) {
        setSelectedAddress(selection.value)
      }
    },
    [],
  )

  const handleCloseClick = useCallback(() => {
    setAmount(ZERO)
    onClose?.()
  }, [onClose])

  const handleRedeemClick = useCallback(async () => {
    if (selectedAddress) {
      try {
        setTxLoading(true)
        const tx = await asset?.requestRedeem?.(
          denormalize(amount, asset?.decimals),
          selectedAddress,
        )
        await track(tx, {
          confirm: {
            secondaryMessage: t('invest:redeemModal.success'),
          },
        })

        await wait(2000)
        setAmount(ZERO)
      } catch {
        // do nothing
      } finally {
        setTxLoading(false)
      }
    } else {
      addError(t('invest:redeemModal.noAddress'))
    }
  }, [addError, amount, asset, selectedAddress, t, track])

  const isRedeemDisabled =
    asset?.balance?.eq(0) ||
    amount.eq(0) ||
    asset?.balance?.lt(amount) ||
    amount?.eq(0) ||
    big(asset?.minimumRedemptionAmount).gt(amount)

  const getError = () => {
    if (
      amount.gt(0) &&
      asset &&
      asset.balance &&
      asset.minimumRedemptionAmount
    ) {
      if (amount.gt(asset.balance)) {
        return t('errors:amountExceedsBalance')
      }

      if (amount.lt(asset.minimumRedemptionAmount)) {
        return t('errors:amountLowerThanAllowed', {
          minRedemptionAmount: asset.minimumRedemptionAmount.toString(),
          assetSymbol: asset.symbol,
        })
      }
    }
    return undefined
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleCloseClick}
      width={['100%', '550px']}
      minHeight="400px"
      maxHeight={['90%', '80%']}
      height="auto"
      justifyContent="stretch"
      alignItems="stretch"
      withoutPortal={withoutPortal}
    >
      <Loader loading={false} size="40px">
        <Heading
          as="h4"
          fontSize={4}
          fontWeight={5}
          mt={0}
          mb="20px"
          color="text"
        >
          {t('invest:redeemModal.title', {
            tokenIn: asset?.symbol ?? 'UNKNOWN',
            tokenOut: 'USDC',
          })}
        </Heading>
        <Text.p mt={0} color="text">
          {asset?.assetType === 'bond' || asset?.assetType === 'stock'
            ? t('invest:redeemModal.stockBondDescription', {
                tokenIn: asset?.symbol ?? 'UNKNOWN',
                tokenOut: 'USDC',
                network: capitalize(
                  asset?.kyaInformation?.blockchain ?? 'UNKNOWN NETWORK',
                ),
              })
            : t('invest:redeemModal.description', {
                tokenIn: asset?.symbol ?? 'UNKNOWN',
                tokenOut: 'USDC',
                network: capitalize(
                  asset?.kyaInformation?.blockchain ?? 'UNKNOWN NETWORK',
                ),
              })}
        </Text.p>
        <Box>
          <Flex width="100%" justifyContent="space-between">
            <Text.span color="near-black" fontSize={1} textAlign="right">
              {t('invest:redeemModal.amount')}
            </Text.span>
            <Text.span color="near-black" fontSize={1} textAlign="right" mr={2}>
              {t('invest:redeemModal.balance')}{' '}
              <TokenBalance
                tokenAddress={asset?.id}
                account={selectedAddress}
                symbol={asset?.symbol}
                wrapper={Text.span}
              />
            </Text.span>
          </Flex>
          <MaxInput
            height="48px"
            mb={3}
            max={asset?.balance?.toFixed(asset.decimals) ?? '0'}
            decimalScale={asset && getInputPrecision(asset)}
            value={amount}
            onChange={handleAmountChange}
            disabled={txLoading}
            error={getError()}
            reportError
          />
        </Box>
        <ConnectedAddressSelect
          height="48px"
          label={t('invest:redeemModal.selectAddress')}
          onChange={handleSelectChange}
          selectedAddress={selectedAddress}
          isDisabled={txLoading}
        />
        <Divider mb={0} />
        <Text.span
          textAlign="center"
          mt={2}
          fontSize={3}
          color="text"
          title={`${amountToReceiveUsdValue?.round(6) ?? '--'} USDC`}
        >
          {t('invest:redeemModal.youWillReceive', {
            tokenOut: 'USDC',
            amount: prettifyBalance(amountToReceiveUsdValue, 2),
          })}
        </Text.span>
        <Text.span
          textAlign="center"
          fontSize={0}
          color="text"
          title={
            asset?.exchangeRate === undefined
              ? '--'
              : `${asset.exchangeRate} USDC`
          }
        >
          {t('invest:redeemModal.currentMarketValue', {
            amount: prettifyBalance(asset?.exchangeRate ?? 0, 2),
          })}
        </Text.span>
        <Flex justifyContent="center" style={{ gap: '16px' }} mt={3}>
          <SecondaryButton size="small" onClick={handleCloseClick}>
            {t('popups:actions.close')}
          </SecondaryButton>
          <SmartButton
            requireInitiated
            requireAccount
            size="small"
            disabled={isRedeemDisabled}
            onClick={handleRedeemClick}
          >
            {t('common:token.redeem')}
          </SmartButton>
        </Flex>
      </Loader>
    </Dialog>
  )
}

export default StockTokenRedeemModal
