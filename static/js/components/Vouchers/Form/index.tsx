import config from '@swarm/core/config'
import useInterval from '@swarm/core/hooks/effects/useInterval'
import api from '@swarm/core/services/api'
import { lastSavedAmountKeyLocalStorage } from '@swarm/core/shared/localStorage'
import { vouchersYotiLocalStorage } from '@swarm/core/shared/localStorage/vouchersYotiLocalStorage'
import newGuid from '@swarm/core/shared/utils/helpers/new-guid'
import { useStoredNetworkId } from '@swarm/core/web3'
import Content from '@swarm/ui/presentational/Content'
import Tooltip from '@swarm/ui/presentational/Tooltip'
import { useSnackbar } from '@swarm/ui/swarm/Snackbar'
import { AlertVariant } from '@swarm/ui/swarm/Snackbar/types'
import qs from 'query-string'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory, useLocation } from 'react-router'
import {
  Box,
  Button,
  Card,
  Flash,
  Flex,
  Heading,
  Input,
  Link,
  Select,
  Text,
} from 'rimble-ui'
import styled from 'styled-components/macro'

import Layout from 'src/components/Layout'
import { ROUTES } from 'src/routes'

import ConnectDigitalIDModal from './ConnectDigitalIDModal'
import {
  AVAILABLE_CRYPTOCURRENCIES,
  AVAILABLE_FIATS,
  PREDEFINED_AMOUNTS,
  PRICE_POLL_INTERVAL,
} from './constants'

const StyledInput = styled(Input)`
  text-indent: 47px;
  font-size: 30px;
  font-weight: 600;
`
const HelpButton = styled(Button)`
  svg {
    width: 16px;
    height: 16px;
  }
`

const PredefinedAmount = styled.div<{ selected?: boolean }>`
  width: 50px;
  background-color: #d3d5e540;
  text-align: center;
  padding: 5px;
  border-radius: 8px;
  color: #4d4d4d;
  cursor: pointer;
  font-weight: 600;
  margin-left: 15px
    ${(props) =>
      props.selected &&
      `
    border: 1px solid #eb5757;
    padding: 4px;
    color: #e40101;
  `};
`

const Form = () => {
  const history = useHistory()
  const { search } = useLocation()
  const { addAlert } = useSnackbar()
  const { t } = useTranslation('vouchers')
  const networkId = useStoredNetworkId()

  const [voucherValue, setVoucherValue] = useState<number | string>('')
  const [cryptoBaseSymbol, setCryptoBaseSymbol] = useState<string>(
    AVAILABLE_CRYPTOCURRENCIES[0].symbol,
  )
  const [currentlyWorth, setCurrentlyWorth] = useState<string>('0')
  const [vouchersYotiTokenResponse, setVouchersYotiTokenResponse] = useState(
    vouchersYotiLocalStorage.get(),
  )
  const [totalVouchersValue, setTotalVouchersValue] = useState(0)
  const [showUserNeedVerificationMessage, setShowUserNeedVerificationMessage] =
    useState(false)
  const [amountValidationError, setAmountValidationError] = useState<
    'LOWER_THAN_MIN' | 'HIGHER_THAN_MAX' | ''
  >('')
  const [connectModalOpen, setConnectModalOpen] = useState(false)
  const [selectedFiatSymbol, setSelectedFiatSymbol] = useState(
    AVAILABLE_FIATS[0].symbol,
  )
  const SELECTED_FIAT =
    AVAILABLE_FIATS.find((f) => f.symbol === selectedFiatSymbol) ||
    AVAILABLE_FIATS[0]

  const MAX_VOUCHER_AMOUNT = SELECTED_FIAT.limit - totalVouchersValue

  const yotiTokenHandler = useCallback(
    async (token: string, done: () => void) => {
      try {
        const tokenResponse = await api.sendVouchersYotiToken(token)
        const { access_token: accessToken, status } = tokenResponse

        if (status === 'pending') {
          setShowUserNeedVerificationMessage(true)
        } else if (accessToken) {
          setVouchersYotiTokenResponse(tokenResponse)
          vouchersYotiLocalStorage.set(tokenResponse)
          addAlert(t('form.userLoggedInMessage'), {
            variant: AlertVariant.success,
          })
        }
        done()
        setConnectModalOpen(false)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('An error occurred while sending the yoti token', error)
      }
    },
    [addAlert, t],
  )

  const updatePriceInfo = useCallback(async () => {
    const amount = Number(voucherValue) || 0

    if (amount === 0) {
      setCurrentlyWorth('0')
      return
    }

    try {
      const address =
        AVAILABLE_CRYPTOCURRENCIES.find(
          (c) => c.symbol.toUpperCase() === cryptoBaseSymbol.toUpperCase(),
        )?.address || ''
      const currency = SELECTED_FIAT.code.toLowerCase()

      const res = await api.getPricesV2([address], [currency], networkId)
      const price = res.attributes.prices[address][currency]

      setCurrentlyWorth((amount / price).toFixed(6))
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('An error occurred while fetching the price info', error)
    }
  }, [SELECTED_FIAT.code, cryptoBaseSymbol, networkId, voucherValue])

  const handleVoucherValueInputChange = useCallback(
    (e: { target: { value: string } }) => {
      const { value: newValue } = e.target
      const newNumberValue = Number(newValue)

      setAmountValidationError('')

      if (newValue === '') {
        setVoucherValue(newValue)
        setAmountValidationError('')
      } else if (newNumberValue) {
        setVoucherValue(newNumberValue)

        if (newNumberValue < PREDEFINED_AMOUNTS[0]) {
          setAmountValidationError('LOWER_THAN_MIN')
        } else if (newNumberValue > MAX_VOUCHER_AMOUNT) {
          setAmountValidationError('HIGHER_THAN_MAX')
        }
      }
      // This is added to save the amount and later set it after users login with yoti
      lastSavedAmountKeyLocalStorage.set(newValue)
    },
    [MAX_VOUCHER_AMOUNT],
  )

  const handleFiatSelectionChange = (e: { target: { value: string } }) => {
    const { value } = e.target
    setSelectedFiatSymbol(value)
  }

  const handleCryptoBaseChange = (e: { target: { value: string } }) => {
    const { value: newValue } = e.target
    setCryptoBaseSymbol(newValue)
  }

  const handleBuyClick = () => {
    if (voucherValue) {
      history.push('/vouchers/payment', {
        voucherValue: Number(voucherValue),
        cryptoAmount: Number(currentlyWorth),
        cryptoBase: cryptoBaseSymbol,
        fiat: SELECTED_FIAT.code,
        transactionId: newGuid(),
      })
    }
  }

  useEffect(() => {
    updatePriceInfo()
  }, [voucherValue, cryptoBaseSymbol, updatePriceInfo])

  useEffect(() => {
    async function fetchTotalVouchersValue() {
      const value = await api.getTotalVouchersValue(SELECTED_FIAT.code)

      setTotalVouchersValue(value)
    }
    if (vouchersYotiTokenResponse) {
      fetchTotalVouchersValue()
    }
  }, [vouchersYotiTokenResponse, SELECTED_FIAT.code])

  useEffect(() => {
    const searchParams = qs.parse(search)
    const token = searchParams.token?.toString()

    if (token) {
      yotiTokenHandler(token, () => {
        history.push('/vouchers')
        const lastSavedAmount = lastSavedAmountKeyLocalStorage.get()
        if (lastSavedAmount !== null) {
          handleVoucherValueInputChange({ target: { value: lastSavedAmount } })
          lastSavedAmountKeyLocalStorage.remove()
        }
      })
    }
  }, [search, yotiTokenHandler, history, handleVoucherValueInputChange])

  useInterval(
    () => updatePriceInfo(),
    voucherValue ? PRICE_POLL_INTERVAL : null,
  )

  const isCheckoutButtonDisabled =
    !Number(currentlyWorth) || amountValidationError

  return (
    <Layout header={t('form.header')} subheader={t('form.subheader')}>
      <Content bg="background">
        {showUserNeedVerificationMessage && (
          <Flash variant="warning" marginBottom={20}>
            {t('form.userNeedVerificationMessage')}
          </Flash>
        )}
        <Card
          p={[3, '24px']}
          borderRadius={1}
          boxShadow={4}
          border="0"
          width="100%"
          maxWidth="500px"
          alignSelf="center"
          flexDirection="column"
        >
          <Flex width="100%" flexDirection="column" position="relative">
            <Heading fontSize={17}>
              {t('form.priceInputLabel')}
              <Tooltip placement="top" message={t('form.amountLabelTooltip')}>
                <HelpButton
                  onClick={() =>
                    window.open(config.resources.docs.coreConcepts.vouchers)
                  }
                  variant="plain"
                  height="16px"
                  width="16px"
                  icononly
                  icon="Help"
                  ml={1}
                />
              </Tooltip>
            </Heading>
            <Box position="absolute" bottom="0px" left="16px">
              <Select
                style={{
                  fontSize: '25px',
                  color: '#9fa3bc',
                  background: 'none',
                  border: 'none',
                  boxShadow: 'none',
                  appearance: 'none',
                  paddingRight: 0,
                  width: '35px',
                  cursor: 'pointer',
                }}
                value={SELECTED_FIAT.symbol}
                options={AVAILABLE_FIATS.map((fiat) => ({
                  value: fiat.symbol,
                  label: `${fiat.symbol} ${fiat.code}`,
                }))}
                onChange={handleFiatSelectionChange}
              />
            </Box>
            <StyledInput
              value={voucherValue}
              onChange={handleVoucherValueInputChange}
              width="100%"
              bg="white"
              boxShadow="1"
              type="text"
              required
              number
            />
          </Flex>
          <Flex height="23px">
            {amountValidationError && (
              <Text
                color="#eb5757"
                marginLeft="10px"
                fontSize="14px"
                paddingTop="2px"
              >
                {amountValidationError === 'LOWER_THAN_MIN'
                  ? `*${t(
                      'form.minVoucherValueValidationMessage',
                    )} ${selectedFiatSymbol}${PREDEFINED_AMOUNTS[0]}`
                  : `*${t('form.maxVoucherValueValidationMessage', {
                      currencySymbol: selectedFiatSymbol,
                      remaining: MAX_VOUCHER_AMOUNT.toFixed(),
                      limit: SELECTED_FIAT.limit,
                    })}`}
              </Text>
            )}
          </Flex>
          <Flex justifyContent="flex-end">
            {PREDEFINED_AMOUNTS.map((amount) => {
              const isSelected = amount === Number(voucherValue)

              return (
                <PredefinedAmount
                  selected={isSelected}
                  key={`qb-predefined-amount-${amount}`}
                  onClick={() =>
                    handleVoucherValueInputChange({
                      target: { value: amount.toString() },
                    })
                  }
                >{`${selectedFiatSymbol}${amount}`}</PredefinedAmount>
              )
            })}
          </Flex>
          <Flex marginTop={30} flexDirection="column">
            <Flex justifyContent="space-between">
              <Heading fontSize={17}>{t('form.currentWorthLabel')}</Heading>
              <Heading marginRight="20px" fontSize={17}>
                {t('form.selectCryptoLabel')}
              </Heading>
            </Flex>
            <Flex
              flexDirection="row"
              borderBottom={1}
              borderColor="#d3d5e5"
              alignItems="center"
            >
              <Text flex={1} paddingLeft={15} fontSize={30} color="primary">
                {currentlyWorth}
              </Text>
              <Select
                value={cryptoBaseSymbol}
                border="none"
                bg="none"
                style={{ boxShadow: 'none', cursor: 'pointer' }}
                required
                onChange={handleCryptoBaseChange}
                options={AVAILABLE_CRYPTOCURRENCIES.map((crypto) => ({
                  value: crypto.symbol.toLowerCase(),
                  label: crypto.symbol,
                }))}
              />
            </Flex>
          </Flex>
          <Flex flexDirection="column" alignItems="center">
            {vouchersYotiTokenResponse ? (
              <>
                <Button
                  width="100%"
                  margin={20}
                  fontSize={22}
                  onClick={handleBuyClick}
                  disabled={isCheckoutButtonDisabled}
                >
                  {t('form.buyButton')}
                </Button>
                <Link
                  href={ROUTES.VOUCHERS_LIST}
                  alignSelf="center"
                  fontSize={15}
                  marginBottom={10}
                >
                  {t('vouchersList.myVouchersButton')}
                </Link>
              </>
            ) : (
              <>
                <Button
                  width="100%"
                  margin={20}
                  fontSize={22}
                  onClick={() => setConnectModalOpen(true)}
                >
                  {t('form.connectDigitalIdButton')}
                </Button>
              </>
            )}
            <Flex color="grey" alignItems="center">
              <Text fontSize={14} color="grey">
                Works with:&nbsp;
              </Text>
              <img
                height={25}
                alt="easy-id-logo"
                src="https://www.yoti.com/share/static/button/assets/easy-id-app-logo.svg"
              />
              &nbsp;&nbsp;|&nbsp;&nbsp;
              <img
                height={20}
                alt="yoti-logo"
                src="https://www.yoti.com/share/static/button/assets/yoti-app-logo.svg"
              />
            </Flex>
          </Flex>
        </Card>
      </Content>
      <ConnectDigitalIDModal
        isOpen={connectModalOpen}
        yotiTokenHandler={yotiTokenHandler}
        setModalOpen={setConnectModalOpen}
      />
    </Layout>
  )
}

export default Form
