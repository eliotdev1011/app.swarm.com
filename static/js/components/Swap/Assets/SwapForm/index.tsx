import config from '@swarm/core/config'
import { SmtPriceFeed } from '@swarm/core/contracts/SmtPriceFeed'
import { useCpk } from '@swarm/core/contracts/cpk'
import useAsyncMemo from '@swarm/core/hooks/async/useAsyncMemo'
import useAsyncState from '@swarm/core/hooks/async/useAsyncState'
import useFeatureFlags, {
  FlaggedFeatureName,
} from '@swarm/core/hooks/data/useFeatureFlags'
import useTransactionAlerts from '@swarm/core/hooks/i18n/useTransactionAlerts'
import usePopupState from '@swarm/core/hooks/state/usePopupState'
import { getCurrentConfig } from '@swarm/core/observables/configForNetwork'
import { useIsProxyDeployed } from '@swarm/core/observables/proxyDeployed'
import { TRANSACTION_RELOAD_DELAY } from '@swarm/core/shared/consts'
import { Tier } from '@swarm/core/shared/enums'
import { propEquals } from '@swarm/core/shared/utils/collection/filters'
import { prettifyBalance } from '@swarm/core/shared/utils/formatting'
import {
  big,
  denormalize,
  normalize,
} from '@swarm/core/shared/utils/helpers/big-helpers'
import repeat from '@swarm/core/shared/utils/helpers/repeat'
import wait from '@swarm/core/shared/utils/helpers/wait'
import autoRound from '@swarm/core/shared/utils/math/autoRound'
import autoRoundWithFallback from '@swarm/core/shared/utils/math/autoRoundWithFallback'
import {
  cpkAllowanceLoading,
  isEnabled,
} from '@swarm/core/shared/utils/tokens/allowance'
import { isNativeToken } from '@swarm/core/shared/utils/tokens/filters'
import { getInputPrecision } from '@swarm/core/shared/utils/tokens/precision'
import { useTier } from '@swarm/core/state/hooks'
import { isSameEthereumAddress, useAccount } from '@swarm/core/web3'
import { ExtendedNativeToken } from '@swarm/types/tokens'
import Collapsible from '@swarm/ui/presentational/Collapsible'
import Label from '@swarm/ui/presentational/Form/Label'
import Grid from '@swarm/ui/presentational/Grid'
import TextWithTooltip from '@swarm/ui/presentational/Text/TextWithTooltip'
import Balance from '@swarm/ui/swarm/Balance'
import SmartButton from '@swarm/ui/swarm/Buttons/SmartButton'
import TenderlyButton from '@swarm/ui/swarm/Buttons/TenderlyButton'
import FlaggedFeature from '@swarm/ui/swarm/FlaggedFeature'
import MaxInput from '@swarm/ui/swarm/MaxInput'
import { useSnackbar } from '@swarm/ui/swarm/Snackbar'
import SvgIcon from '@swarm/ui/swarm/SvgIcon'
import TokenSelector from '@swarm/ui/swarm/TokenSelector'
import { SwapTxType } from '@swarmmarkets/smart-order-router'
import { BigSource } from 'big.js'
import { TransactionResult } from 'contract-proxy-kit'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Flex, Loader, Text } from 'rimble-ui'

import CpkBalanceModal from 'src/components/CpkBalanceModal'
import { useInvestSecurityContext } from 'src/components/Invest/InvestSecurityContext'
import ProxyContractModal from 'src/components/Swap/Assets/ProxyContractModal'
import { FlipButton } from 'src/components/Swap/Assets/styled-components'
import { useSwapContext } from 'src/components/Swap/SwapContext'
import { BPoolProxy } from 'src/contracts/BPoolProxy'
import { NativeTokenWrapper } from 'src/contracts/NativeTokenWrapper'
import { checkIsSwarm } from 'src/shared/utils/brand'

import DiscountSwitch from './DiscountSwitch'
import OptimizationSwitch, {
  SwapOptimisationStrategy,
} from './OptimizationSwitch'
import Price from './Price'
import useSwapValues from './useSwapValues'
import {
  matchIsUnwrappingNativeToken,
  matchIsWrappingNativeToken,
} from './utils'

const { faq: faqLink } = config.resources.docs.gettingStarted

const SwapForm = () => {
  const { t } = useTranslation(['swap', 'errors'])
  const { addError } = useSnackbar()
  const { track } = useTransactionAlerts()
  const account = useAccount()
  const cpk = useCpk()
  const tier = useTier()
  const isProxyDeployed = useIsProxyDeployed()
  const { checkFeature } = useFeatureFlags()
  const [isProxyModalOpen, setIsProxyModalOpen] = useState(false)
  const cpkBalanceModal = usePopupState(false)
  const [isCpkBalanceModalConfirmed, setIsCpkBalanceModalConfirmed] =
    useState(false)

  const {
    tokenIn,
    tokenOut,
    settings,
    setTokenPair,
    swaps,
    queryParams,
    fullTokens,
    reloadTokens,
    loading: tokensLoading,
    balancesLoading,
    initiated,
  } = useSwapContext()

  const isWrappingNativeToken = matchIsWrappingNativeToken(tokenIn, tokenOut)
  const isUnwrappingNativeToken = matchIsUnwrappingNativeToken(
    tokenIn,
    tokenOut,
  )

  const [isDiscountEnabled, setIsDiscountEnabled] = useState(
    settings.autoPaySmtDiscount,
  )

  const isSmtProtocolFeeDiscountApplied =
    isDiscountEnabled &&
    isWrappingNativeToken === false &&
    isUnwrappingNativeToken === false

  const [swapType, setSwapType] = useState<SwapTxType>(SwapTxType.exactIn)

  const [optimizationStrategy, setOptimisationStrategy] =
    useState<SwapOptimisationStrategy>(SwapOptimisationStrategy.gas)

  const {
    amountIn,
    amountOut,
    maxAmountIn,
    maxNativeTokenAmountIn,
    lastPrice,
    protocolFee,
    swaps: swapSequences,
    totalSwapFeeAmount,
    valid,
    error: validationError,
    setAmountIn,
    setAmountOut,
    swapStrategiesDiff,
    swapPrice,
  } = useSwapValues(
    tokenIn,
    tokenOut,
    swapType,
    settings,
    !isSmtProtocolFeeDiscountApplied,
    optimizationStrategy,
  )

  const { checkSecurityPermission } = useInvestSecurityContext()

  const minimumReceived = useMemo(
    () => big(amountOut).times(1 - settings.tolerance / 100),
    [amountOut, settings.tolerance],
  )

  const maximumPaid = useMemo(
    () => big(amountIn).times(1 + settings.tolerance / 100),
    [amountIn, settings.tolerance],
  )

  const willUseCpkBalance = tokenIn?.xToken?.cpkBalance?.gt(0) ?? false

  const willReceiveCpkBalance = tokenOut?.xToken?.cpkBalance?.gt(0) ?? false

  const [txLoading, setTxLoading] = useAsyncState(false)

  const [utilityTokenAddress] = useAsyncMemo(
    () => BPoolProxy.getUtilityTokenAddress(),
    null,
    [],
  )

  const utilityToken = useMemo(
    () => fullTokens.find(propEquals('id', utilityTokenAddress)),
    [fullTokens, utilityTokenAddress],
  )

  const [smtFeeAmount] = useAsyncMemo<BigSource>(
    async () => {
      const bigProtocolFee = big(protocolFee)
      if (tokenIn?.xToken?.id && bigProtocolFee.gt(0)) {
        const denormSmtFeeAmount = await SmtPriceFeed.calculateAmount(
          tokenIn.xToken.id,
          bigProtocolFee.div(2),
        )

        return normalize(denormSmtFeeAmount, utilityToken?.decimals).toString()
      }
      return '0'
    },
    '0',
    [tokenIn?.xToken?.id, protocolFee, utilityToken?.decimals],
  )

  const [tenderlyTxs] = useAsyncMemo(
    async () => {
      if (
        !account ||
        !tokenIn ||
        !tokenOut ||
        !checkFeature(FlaggedFeatureName.tenderlySimulation)
      )
        return []

      const denormFee = isSmtProtocolFeeDiscountApplied
        ? denormalize(smtFeeAmount, utilityToken?.decimals)
        : protocolFee

      if (swapType === SwapTxType.exactIn) {
        const { storedTxs } = await BPoolProxy.multihopBatchSwapExactInStatic(
          account,
          swapSequences,
          tokenIn,
          tokenOut,
          big(amountOut).times(1 - settings.tolerance / 100),
          denormFee,
          isSmtProtocolFeeDiscountApplied ? utilityToken : undefined,
        )

        return storedTxs
      }

      const { storedTxs } = await BPoolProxy.multihopBatchSwapExactOutStatic(
        account,
        swapSequences,
        tokenIn,
        tokenOut,
        big(amountIn)
          .times(1 + settings.tolerance / 100)
          .toString(),
        big(denormFee).times(1 + settings.tolerance / 100),
        isSmtProtocolFeeDiscountApplied ? utilityToken : undefined,
      )

      return storedTxs
    },
    [],
    [
      account,
      amountIn,
      amountOut,
      isSmtProtocolFeeDiscountApplied,
      protocolFee,
      settings.tolerance,
      smtFeeAmount,
      swapSequences,
      swapType,
      tokenIn,
      tokenOut,
      utilityToken,
    ],
  )

  const handleAmountInChange = useCallback(
    (value: number) => {
      if (!Number.isNaN(value)) {
        setAmountIn(Number(value))
        setSwapType(SwapTxType.exactIn)
      }
    },
    [setAmountIn],
  )

  const handleAmountOutChange = useCallback(
    (value: number) => {
      if (!Number.isNaN(value)) {
        setAmountOut(Number(value))
        setSwapType(SwapTxType.exactOut)
      }
    },
    [setAmountOut],
  )

  useEffect(() => {
    if (queryParams.amountOut) {
      handleAmountOutChange(queryParams.amountOut)
    }
  }, [queryParams.amountOut, handleAmountOutChange])

  const handleTokenInSelection = useCallback(
    (token: ExtendedNativeToken) => {
      if (tokenOut?.id === token.id) {
        setTokenPair({
          tokenInAddress: token.id,
          tokenOutAddress: tokenIn?.id,
        })
        setAmountIn(amountOut)
        setSwapType(SwapTxType.exactIn)
      } else {
        setTokenPair({ tokenInAddress: token.id })
      }
    },
    [tokenOut?.id, setTokenPair, tokenIn, setAmountIn, amountOut],
  )

  const handleTokenOutSelection = (token: ExtendedNativeToken) =>
    setTokenPair({ tokenOutAddress: token.id })

  const handleFlipClick = useCallback(() => {
    setTokenPair({
      tokenInAddress: tokenOut?.id,
      tokenOutAddress: tokenIn?.id,
    })
    setAmountIn(amountOut)
    setSwapType(SwapTxType.exactIn)
  }, [setTokenPair, tokenOut, tokenIn, setAmountIn, amountOut])

  const handleSwap = useCallback(async () => {
    if (!account || !tokenIn || !tokenOut) return

    if (!isProxyDeployed && !isProxyModalOpen) {
      setIsProxyModalOpen(true)
      return
    }

    if (
      (willReceiveCpkBalance || willUseCpkBalance) &&
      !cpkBalanceModal.isOpen &&
      !isCpkBalanceModalConfirmed
    ) {
      cpkBalanceModal.open()
      return
    }

    setIsCpkBalanceModalConfirmed(false)
    setTxLoading(true)
    try {
      let tx: TransactionResult | undefined

      const denormFee = isSmtProtocolFeeDiscountApplied
        ? denormalize(smtFeeAmount, utilityToken?.decimals)
        : protocolFee

      if (swapType === SwapTxType.exactIn) {
        tx = await BPoolProxy.multihopBatchSwapExactIn(
          account,
          swapSequences,
          tokenIn,
          tokenOut,
          big(amountOut).times(1 - settings.tolerance / 100),
          denormFee,
          isSmtProtocolFeeDiscountApplied ? utilityToken : undefined,
        )
      } else {
        tx = await BPoolProxy.multihopBatchSwapExactOut(
          account,
          swapSequences,
          tokenIn,
          tokenOut,
          big(amountIn)
            .times(1 + settings.tolerance / 100)
            .toString(),
          big(denormFee).times(1 + settings.tolerance / 100),
          isSmtProtocolFeeDiscountApplied ? utilityToken : undefined,
        )
      }

      await track(tx)

      repeat(
        () =>
          Promise.all([
            reloadTokens(),
            swaps.refetch(
              swaps.data?.swaps !== undefined
                ? swaps.data.swaps.length + 1
                : swaps.options.limit,
            ),
          ]),
        TRANSACTION_RELOAD_DELAY * 3,
        4,
      )
    } catch (e) {
      addError(e as Error, {
        description: t('errors:transactionGeneric'),
        actionText: 'faqs',
        actionHref: faqLink,
      })
    } finally {
      setTxLoading(false)
    }
  }, [
    account,
    tokenIn,
    tokenOut,
    isProxyDeployed,
    isProxyModalOpen,
    willReceiveCpkBalance,
    willUseCpkBalance,
    cpkBalanceModal,
    isCpkBalanceModalConfirmed,
    setTxLoading,
    isSmtProtocolFeeDiscountApplied,
    smtFeeAmount,
    utilityToken,
    swapSequences,
    protocolFee,
    swapType,
    track,
    amountIn,
    amountOut,
    settings.tolerance,
    reloadTokens,
    swaps,
    addError,
    t,
  ])

  const handleCpkBalanceModalConfirm = () => {
    cpkBalanceModal.close()
    setIsCpkBalanceModalConfirmed(true)
    handleSwap()
  }

  const onCloseProxyModal = async (action: 'resolve' | 'reject') => {
    setIsProxyModalOpen(false)
    if (action === 'resolve') await handleSwap()
  }

  const handleEnableToken = useCallback(
    async (token: ExtendedNativeToken) => {
      setTxLoading(true)
      try {
        const tx = await token?.contract?.enableToken(cpk?.address || '')

        await track(tx, {
          skipSubmit: true,
          confirm: { message: `${token?.name} is enabled` },
        })

        await wait(2000)
      } catch (e) {
        addError(e as Error)
      } finally {
        setTxLoading(false)
      }
    },
    [cpk?.address, setTxLoading, track, addError],
  )

  const handleWrapNativeToken = useCallback(async () => {
    const networkConfig = getCurrentConfig()

    setTxLoading(true)
    try {
      const nativeTokenWrapper = new NativeTokenWrapper(
        networkConfig.nativeTokenWrapperAddress,
      )
      const tx = await nativeTokenWrapper.deposit(amountIn)

      await track(tx, {
        confirm: {
          message: t('assets.wrappedNativeToken', {
            nativeTokenSymbol: tokenIn?.symbol,
          }),
        },
      })

      setTimeout(reloadTokens, TRANSACTION_RELOAD_DELAY)
    } catch (e) {
      addError(e as Error)
    } finally {
      setTxLoading(false)
    }
  }, [amountIn, setTxLoading, track, addError, reloadTokens, t, tokenIn])

  const handleUnwrapNativeToken = useCallback(async () => {
    const networkConfig = getCurrentConfig()

    setTxLoading(true)
    try {
      const nativeTokenWrapper = new NativeTokenWrapper(
        networkConfig.nativeTokenWrapperAddress,
      )
      const tx = await nativeTokenWrapper.withdraw(amountIn)

      await track(tx, {
        confirm: {
          message: t('assets.unwrappedNativeToken', {
            wrapperNativeTokenSymbol: tokenIn?.symbol,
          }),
        },
      })

      setTimeout(reloadTokens, TRANSACTION_RELOAD_DELAY)
    } catch (e) {
      addError(e as Error)
    } finally {
      setTxLoading(false)
    }
  }, [amountIn, setTxLoading, track, addError, reloadTokens, t, tokenIn])

  const isTokenInAllowanceLoading =
    tokenIn && cpkAllowanceLoading(tokenIn, account)
  const isUtilityAllowanceLoading =
    utilityToken && cpkAllowanceLoading(utilityToken, account)
  const isTokenInEnabled = tokenIn && isEnabled(tokenIn, amountIn)

  const isUtilityTokenEnabled =
    utilityToken && isEnabled(utilityToken, smtFeeAmount)

  const handleSwapButtonClick = useCallback(async () => {
    if (!tokenIn || !tokenOut) return undefined

    const securityGranted = await checkSecurityPermission(tokenIn, tokenOut)
    if (!securityGranted) {
      return undefined
    }

    if (isWrappingNativeToken) {
      return handleWrapNativeToken()
    }

    if (isUnwrappingNativeToken) {
      return handleUnwrapNativeToken()
    }

    if (tokenIn && !isTokenInAllowanceLoading && !isTokenInEnabled) {
      return handleEnableToken(tokenIn)
    }
    if (
      isSmtProtocolFeeDiscountApplied &&
      utilityToken &&
      !isUtilityAllowanceLoading &&
      !isUtilityTokenEnabled
    ) {
      return handleEnableToken(utilityToken)
    }

    return handleSwap()
  }, [
    checkSecurityPermission,
    tokenIn,
    tokenOut,
    isWrappingNativeToken,
    isUnwrappingNativeToken,
    isTokenInAllowanceLoading,
    isTokenInEnabled,
    isSmtProtocolFeeDiscountApplied,
    utilityToken,
    isUtilityAllowanceLoading,
    isUtilityTokenEnabled,
    handleSwap,
    handleWrapNativeToken,
    handleUnwrapNativeToken,
    handleEnableToken,
  ])

  const loading = useMemo(
    () =>
      !initiated ||
      txLoading ||
      tokensLoading ||
      balancesLoading ||
      isTokenInAllowanceLoading ||
      (isSmtProtocolFeeDiscountApplied && isUtilityAllowanceLoading),
    [
      initiated,
      txLoading,
      tokensLoading,
      balancesLoading,
      isTokenInAllowanceLoading,
      isSmtProtocolFeeDiscountApplied,
      isUtilityAllowanceLoading,
    ],
  )

  const disabled = !account || loading || tier === Tier.tier0 || !valid

  const getSwapButtonLabel = (): React.ReactNode => {
    if (loading) {
      return (
        <>
          <Loader mr={2} color="white" />
          {t('assets.loading')}
        </>
      )
    }

    if (!account) {
      return t('assets.swapButton')
    }

    if (validationError) {
      return validationError
    }

    if (isWrappingNativeToken) {
      return t('assets.wrapNativeToken', {
        nativeTokenSymbol: tokenIn?.symbol,
        wrappedNativeTokenSymbol: tokenOut?.symbol,
      })
    }

    if (isUnwrappingNativeToken) {
      return t('assets.unwrapNativeToken', {
        nativeTokenSymbol: tokenOut?.symbol,
        wrappedNativeTokenSymbol: tokenIn?.symbol,
      })
    }

    if (!isTokenInEnabled) {
      return t('assets.enableToken', { tokenName: tokenIn?.symbol })
    }

    if (isSmtProtocolFeeDiscountApplied && !isUtilityTokenEnabled) {
      return t('assets.enableToken', { tokenName: utilityToken?.symbol })
    }

    return t('assets.swapButton')
  }

  const isSwarm = checkIsSwarm()

  const priceImpactPercentage = useMemo(() => {
    const bigSwapPrice = big(swapPrice)
    const bigLastPrice = big(lastPrice)

    if (bigSwapPrice.lte(0) || bigLastPrice.lte(0)) return 0

    return bigLastPrice
      .sub(bigSwapPrice)
      .div(bigLastPrice)
      .round(2, 3)
      .abs()
      .toNumber()
  }, [lastPrice, swapPrice])

  return (
    <>
      <Grid gridTemplateColumns="2fr 150px" gridGap={[2, 3]}>
        <Flex width="100%" flexDirection="column" justifyContent="flex-end">
          <Label mobile>{t('assets.from')}</Label>
          <Box position="relative">
            <MaxInput
              onChange={handleAmountInChange}
              value={amountIn}
              max={isWrappingNativeToken ? maxNativeTokenAmountIn : maxAmountIn}
              decimalScale={tokenIn && getInputPrecision(tokenIn)}
              height="48px"
              px="16px"
              disabled={loading}
            />
          </Box>
        </Flex>
        <Flex width="100%" flexDirection="column" justifyContent="flex-end">
          <TokenSelector
            onChange={handleTokenInSelection}
            selected={tokenIn}
            tokens={fullTokens}
            loading={!initiated}
            orderBy="userBalances.usd"
            orderDirection="desc"
            readonly={loading}
            showTokenInfo
          />
        </Flex>
      </Grid>

      <Flex my={3} justifyContent="center" width="100%">
        <FlipButton onlyIcon onClick={handleFlipClick}>
          <SvgIcon name="DownIcon" />
        </FlipButton>
      </Flex>

      <Grid gridTemplateColumns="2fr 150px" gridGap={[2, 3]}>
        <Flex width="100%" flexDirection="column" justifyContent="flex-end">
          <Label mobile>{t('assets.to')}</Label>
          <MaxInput
            onChange={handleAmountOutChange}
            value={amountOut}
            decimalScale={tokenOut && getInputPrecision(tokenOut)}
            disabled={loading || !tokenOut}
            height="48px"
            px="16px"
            showMax={false}
          />
        </Flex>
        <Flex width="100%" flexDirection="column" justifyContent="flex-end">
          <TokenSelector
            onChange={handleTokenOutSelection}
            selected={tokenOut}
            filter={(token) => !isSameEthereumAddress(token.id, tokenIn?.id)}
            tokens={fullTokens}
            loading={!initiated}
            emptyValue={
              <Text.span color="grey">{t('assets.selectToken')}</Text.span>
            }
            orderBy="userBalances.usd"
            orderDirection="desc"
            readonly={loading || (!!tokenIn && isNativeToken(tokenIn))}
            showTokenInfo
          />
        </Flex>
      </Grid>

      <Price
        swapPrice={swapPrice}
        tokenInSymbol={tokenIn?.symbol}
        tokenOutSymbol={tokenOut?.symbol}
        tokenInExchangeRate={tokenIn?.exchangeRate}
        tokenOutExchangeRate={tokenOut?.exchangeRate}
        disabled={!tokenOut || !tokenIn}
      />

      <FlaggedFeature name={FlaggedFeatureName.smartOrderRouter}>
        <OptimizationSwitch
          strategy={optimizationStrategy}
          setStrategy={setOptimisationStrategy}
          swapType={swapType}
          swapStrategiesDiff={swapStrategiesDiff}
        />
      </FlaggedFeature>

      <Flex flexDirection="column" alignItems="end">
        <SmartButton
          type="button"
          disabled={disabled}
          width="100%"
          height={['40px', '52px']}
          fontWeight={4}
          fontSize={[2, 3]}
          mt="24px"
          mainColor={loading ? 'grey' : 'primary'}
          onClick={handleSwapButtonClick}
          loadingText={
            <>
              <Loader mr={2} color="white" />
              {t('assets.loading')}
            </>
          }
        >
          {getSwapButtonLabel()}
        </SmartButton>
        <FlaggedFeature name={FlaggedFeatureName.tenderlySimulation}>
          <TenderlyButton disabled={disabled} txs={tenderlyTxs} mt="4px" />
        </FlaggedFeature>
      </Flex>
      <Collapsible title={t('assets.moreInfo')} dividerThickness={0} mt="24px">
        <Flex flexDirection="column" color="grey">
          {isSwarm && (
            <Flex justifyContent="space-between" width="100%">
              <TextWithTooltip tooltip={t('assets.discountFeeTooltip')}>
                <Text.span fontSize={1}>{t('assets.discountFee')}</Text.span>
              </TextWithTooltip>
              &nbsp;
              <DiscountSwitch
                checked={isSmtProtocolFeeDiscountApplied}
                setChecked={setIsDiscountEnabled}
                feeAmount={smtFeeAmount}
                utilityToken={utilityToken}
                isDisabled={
                  loading || isWrappingNativeToken || isUnwrappingNativeToken
                }
              />
            </Flex>
          )}

          <Flex mt={3} justifyContent="space-between" width="100%">
            <TextWithTooltip tooltip={t('assets.priceImpactTooltip')}>
              <Text.span fontSize={1}>{t('assets.priceImpact')} </Text.span>
            </TextWithTooltip>
            <Text.span fontSize={1} color="success">
              {priceImpactPercentage > 0 ? `<${priceImpactPercentage}%` : `0%`}
            </Text.span>
          </Flex>

          <Flex mt={3} justifyContent="space-between" width="100%">
            <TextWithTooltip
              tooltip={t(
                `assets.${
                  swapType === SwapTxType.exactIn
                    ? 'minimumReceived'
                    : 'maximumPaid'
                }`,
                {
                  slippage: settings.tolerance,
                },
              )}
            >
              <Text.span fontSize={1}>
                {t(
                  `assets.${
                    swapType === SwapTxType.exactIn
                      ? 'minimumReceived'
                      : 'maximumPaid'
                  }`,
                  { slippage: settings.tolerance },
                )}
              </Text.span>
            </TextWithTooltip>
            <Balance
              balance={
                swapType === SwapTxType.exactIn ? minimumReceived : maximumPaid
              }
              symbol={
                swapType === SwapTxType.exactIn
                  ? tokenOut?.symbol
                  : tokenIn?.symbol
              }
              wrapper={Text.span}
              color="text"
              base={4}
              fontSize={1}
            />
          </Flex>

          <Flex mt={3} justifyContent="space-between" width="100%">
            <TextWithTooltip
              tooltip={t('assets.transactionFeeTooltip', {
                swapFee: prettifyBalance(
                  autoRound(normalize(totalSwapFeeAmount, tokenIn?.decimals), {
                    maxDecimals: 18,
                  }),
                ),
                protocolFee: prettifyBalance(
                  autoRound(
                    isSmtProtocolFeeDiscountApplied
                      ? smtFeeAmount
                      : normalize(protocolFee, tokenIn?.decimals),
                    { maxDecimals: 18 },
                  ),
                ),
                swapFeeToken: tokenIn?.symbol,
                protocolFeeToken: (isSmtProtocolFeeDiscountApplied
                  ? utilityToken
                  : tokenIn
                )?.symbol,
              })}
            >
              <Text.span fontSize={1}>{t('assets.transactionFee')} </Text.span>
            </TextWithTooltip>

            <Text.span color="black" fontSize={1}>
              {autoRoundWithFallback(
                normalize(
                  big(totalSwapFeeAmount).add(
                    isSmtProtocolFeeDiscountApplied ? '0' : protocolFee,
                  ),
                  tokenIn?.decimals,
                ),
                { maxDecimals: 4, minValue: 0 },
              )}
              &nbsp;
              {tokenIn?.symbol || '--'}
              {isSmtProtocolFeeDiscountApplied &&
                ` + ${autoRoundWithFallback(smtFeeAmount, {
                  maxDecimals: 5,
                  minValue: 0,
                })} ${utilityToken?.symbol || '--'}`}
            </Text.span>
          </Flex>
        </Flex>
      </Collapsible>

      <ProxyContractModal
        isOpen={isProxyModalOpen}
        onResolve={() => onCloseProxyModal('resolve')}
        onReject={() => onCloseProxyModal('reject')}
      />
      <CpkBalanceModal
        onClose={cpkBalanceModal.close}
        isOpen={cpkBalanceModal.isOpen}
        onConfirm={handleCpkBalanceModalConfirm}
        tokenIn={tokenIn}
        tokenOut={tokenOut}
      />
    </>
  )
}

export default SwapForm
