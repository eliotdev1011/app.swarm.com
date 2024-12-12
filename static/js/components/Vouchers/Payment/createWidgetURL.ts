import config from '@swarm/core/config'
import { getCurrentConfig } from '@swarm/core/observables/configForNetwork'
import api from '@swarm/core/services/api'
import theme from '@swarm/ui/theme'
import queryString from 'query-string'

const defaultConfig = {
  apiKey: config.moonPayApiKey,
  enabledPaymentMethods: [
    'credit_debit_card',
    'apple_pay',
    'google_pay',
    'samsung_pay',
    'sepa_bank_transfer',
    'gbp_bank_transfer',
    'gbp_open_banking_payment',
  ].join(','),
  colorCode: theme.colors.primary,
  language: 'en',
  kycAvailable: true,
  showAllCurrencies: false,
  walletAddress: getCurrentConfig().vouchersCustodyWalletAddress,
  lockAmount: true,
}

const createWidgetURL = async (
  externalTransactionId: string,
  email: string,
  externalCustomerId: string,
  currencyCode: string,
  baseCurrencyAmount: number,
  baseCurrencyCode: string,
): Promise<string> => {
  const widgetConfig = {
    ...defaultConfig,
    email,
    externalCustomerId,
    baseCurrencyAmount,
    baseCurrencyCode,
    currencyCode,
    externalTransactionId,
  }

  const widgetQueryString = queryString.stringify(widgetConfig)
  const widgetURL = `${config.moonPayBaseURL}/?${widgetQueryString}`
  const response = await api.signMoonpayURL(widgetURL)

  return response.signedURL
}

export default createWidgetURL
