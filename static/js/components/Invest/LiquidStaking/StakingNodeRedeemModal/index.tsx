import useTransactionAlerts from '@swarm/core/hooks/i18n/useTransactionAlerts'
import { BasicModalProps } from '@swarm/core/hooks/state/usePopupState'
import { prettifyBalance } from '@swarm/core/shared/utils/formatting/prettify-balance'
import {
  big,
  denormalize,
  safeDiv,
} from '@swarm/core/shared/utils/helpers/big-helpers'
import wait from '@swarm/core/shared/utils/helpers/wait'
import { getInputPrecision } from '@swarm/core/shared/utils/tokens/precision'
import { useAccount } from '@swarm/core/web3'
import { StakingNode } from '@swarm/types/tokens/invest'
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

export interface StakingNodeRedeemModalProps extends BasicModalProps {
  asset?: StakingNode
  withoutPortal?: boolean
}

const StakingNodeRedeemModal = ({
  isOpen,
  onClose,
  asset,
  withoutPortal = false,
}: StakingNodeRedeemModalProps) => {
  const { t } = useTranslation(['invest', 'popups', 'common', 'errors'])
  const { addError, reportError } = useSnackbar()
  const { track } = useTransactionAlerts()

  const account = useAccount()
  const [selectedAddress, setSelectedAddress] = useState(account ?? null)

  const [amount, setAmount] = useState(0)

  const amountToReceiveUsdValue = useMemo(
    () => big(amount).times(asset?.exchangeRate || 0),
    [amount, asset?.exchangeRate],
  )

  const amountToReceive = useMemo(
    () =>
      safeDiv(amountToReceiveUsdValue, asset?.redemptionToken?.exchangeRate),
    [amountToReceiveUsdValue, asset?.redemptionToken?.exchangeRate],
  )

  const [txLoading, setTxLoading] = useState(false)

  const handleAmountChange = useCallback(
    (value: number) => {
      if (!Number.isNaN(value)) {
        setAmount(value)
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
    setAmount(0)
    onClose?.()
  }, [onClose])

  const handleRedeemClick = useCallback(async () => {
    if (selectedAddress && asset && asset.redemptionToken) {
      try {
        setTxLoading(true)
        const tx = await asset.requestRedeem?.(
          denormalize(amount, asset.decimals),
          selectedAddress,
        )
        await track(tx, {
          confirm: {
            secondaryMessage: t('invest:redeemModal.success'),
          },
        })

        await wait(2000)
        setAmount(0)
      } catch (e) {
        reportError(e as Error)
      } finally {
        setTxLoading(false)
      }
    } else {
      addError(t('invest:redeemModal.noAddress'))
    }
  }, [addError, amount, asset, reportError, selectedAddress, t, track])

  const loading = asset?.underlyingToken === undefined

  const isRedeemDisabled =
    asset?.balance?.eq(0) ||
    big(amount).eq(0) ||
    asset?.balance?.lt(amount) ||
    amountToReceive === undefined ||
    amountToReceive?.eq(0) ||
    big(asset?.minimumRedemptionAmount).gt(amount)

  const getError = () => {
    if (
      big(amount).gt(0) &&
      asset &&
      asset.balance &&
      asset.minimumRedemptionAmount
    ) {
      if (big(amount).gt(asset.balance)) {
        return t('errors:amountExceedsBalance')
      }

      if (big(amount).lt(asset.minimumRedemptionAmount)) {
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
      justifyContent={loading ? 'center' : 'stretch'}
      alignItems={loading ? 'center' : 'stretch'}
      withoutPortal={withoutPortal}
    >
      <Loader loading={loading} size="40px">
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
            tokenOut: asset?.redemptionToken?.symbol ?? 'UNKNOWN',
          })}
        </Heading>
        <Text.p mt={0} color="text">
          {t('invest:redeemModal.description', {
            tokenIn: asset?.symbol ?? 'UNKNOWN',
            tokenOut: asset?.redemptionToken?.symbol ?? 'UNKNOWN',
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
          title={`${
            amountToReceive?.round(asset?.redemptionToken?.decimals ?? 18) ??
            '--'
          } ${asset?.redemptionToken?.symbol ?? 'UNKNOWN'}`}
        >
          {t('invest:redeemModal.youWillReceive', {
            tokenOut: asset?.redemptionToken?.symbol ?? 'UNKNOWN',
            amount: amountToReceive
              ? prettifyBalance(amountToReceive, 6)
              : '--',
          })}
        </Text.span>
        <Text.span
          textAlign="center"
          fontSize={0}
          color="text"
          title={
            amountToReceiveUsdValue === undefined
              ? '--'
              : `${amountToReceiveUsdValue} USD`
          }
        >
          {t('invest:redeemModal.currentMarketValue', {
            amount: amountToReceiveUsdValue
              ? prettifyBalance(amountToReceiveUsdValue, 2)
              : '--',
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

export default StakingNodeRedeemModal
