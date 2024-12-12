import { RequiredProps } from '@swarm/types'
import {
  AffiliateLinkResponse,
  AnnouncementResponse,
  ExchangePriceResponseV2,
  MaticFaucetResponse,
  ProfileResponse,
  PublicProfileResponse,
  TierResponse,
  ToSResponse,
} from '@swarm/types/api-responses'
import capitalize from 'lodash/capitalize'
import { KybStatus } from '@core/shared/enums/kyb-status'
import { SupportedNetworkId } from '@core/shared/enums/supported-network-id'
import { jwtLocalStorage } from '@core/shared/localStorage/jwtLocalStorage'
import { vouchersYotiLocalStorage } from '@core/shared/localStorage/vouchersYotiLocalStorage'
import { getVouchersAuthToken } from '@core/shared/utils'
import { isErrorResponse } from '@core/shared/utils/response'

import { KnownError } from './error-handler'

export interface IRequestInit extends RequestInit {
  shouldNotReturnDataProperty?: boolean
}

export const genericRequest = async (url: string, options?: IRequestInit) => {
  const response = await fetch(url, options)

  let json

  try {
    json = await response.clone().json()
  } catch {
    json = await response.text()
  }

  if (response.ok) {
    if (options?.shouldNotReturnDataProperty) {
      return json
    }
    return json.data
  }

  if (response.status === 401) {
    jwtLocalStorage.remove()
    vouchersYotiLocalStorage.remove()
    throw new Error('unauthorized')
  } else if (isErrorResponse(json)) {
    const firstError = json.errors[0]
    throw new KnownError(capitalize(firstError.detail), {
      code: Number(firstError.status),
      name: firstError.code,
      type: firstError.title,
    })
  } else {
    throw new Error(response.statusText)
  }
}

const windowEnv = window?.ENV || {}
const procEnv = process.env || {}

const uniqKeys = Array.from(
  new Set([...Object.keys(windowEnv), ...Object.keys(procEnv)]),
)

const ENV: Record<string, string> = uniqKeys.reduce(
  (map, key) => ({ ...map, [key]: windowEnv?.[key] || procEnv?.[key] }),
  {},
)

const apiUrl = ENV?.REACT_APP_API_URL

export const request = async (endpoint: string, options?: IRequestInit) =>
  genericRequest(`${apiUrl}${endpoint}`, options)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const get = async <T = any>(
  endpoint: string,
  options?: IRequestInit,
): Promise<T> =>
  request(endpoint, {
    ...options,
    method: 'GET',
  })

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const post = async <T = any>(
  endpoint: string,
  options?: IRequestInit,
): Promise<T> =>
  request(endpoint, {
    ...options,
    method: 'POST',
  })

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const patch = async <T = any>(
  endpoint: string,
  options?: IRequestInit,
): Promise<T> =>
  request(endpoint, {
    ...options,
    method: 'PATCH',
  })

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const del = async <T = any>(
  endpoint: string,
  options?: IRequestInit,
): Promise<T> =>
  request(endpoint, {
    ...options,
    method: 'DELETE',
  })

const getTier = async (address: string): Promise<TierResponse> =>
  get(`addresses/${address}/tier`)

const checkExistence = async (address: string): Promise<boolean> => {
  try {
    await get(`addresses/${address}`)
    return true
  } catch {
    return false
  }
}

const profile = async (): Promise<RequiredProps<ProfileResponse, 'id'>> =>
  get(`profile`, {
    headers: {
      Authorization: `Bearer ${jwtLocalStorage.get()}`,
    },
  })

const publicProfile = async (address: string): Promise<PublicProfileResponse> =>
  get(`profile/${address}`)

const acceptToS = async (message: string, signedMessage: string) => {
  // @todo: replace id with valid Hash of the terms of service doc
  const body = JSON.stringify({
    data: {
      id: message,
      type: 'terms',
      attributes: {
        signature: signedMessage,
      },
    },
  })
  const data = await post(`terms/accept`, {
    body,
    headers: {
      Authorization: `Bearer ${jwtLocalStorage.get()}`,
    },
  })

  return data
}

const nonceMessage = async (address: string, termsHash?: string) => {
  const body = JSON.stringify({
    data: {
      type: 'auth_nonce_request',
      attributes: {
        address,
        terms_hash: termsHash,
      },
    },
  })
  const data = await post(`nonce`, {
    body,
  })

  return data
}

const register = async (address: string, signedMessage: string) => {
  const body = JSON.stringify({
    data: {
      type: 'register',
      attributes: {
        auth_pair: {
          address,
          signed_message: signedMessage,
        },
      },
    },
  })
  const data = await post(`register`, {
    body,
  })

  return data
}

const login = async (address: string, signedMessage: string) => {
  const body = JSON.stringify({
    data: {
      type: 'login_request',
      attributes: {
        auth_pair: {
          address,
          signed_message: signedMessage,
        },
      },
    },
  })
  const data = await post(`login`, {
    body,
  })

  return data
}

const location = async () => {
  const data = await get(`location`)

  return data
}

const initYesFlow = async () => {
  const data = await get(`yes/init_yes_flow`, {
    headers: {
      Authorization: `Bearer ${jwtLocalStorage.get()}`,
    },
    credentials: 'include',
  })

  return data
}

const getFeatureFlags = async () => {
  const data = await get(`featureflags`, {
    headers: {
      Authorization: `Bearer ${jwtLocalStorage.get()}`,
    },
  })
  return data
}

const getYesFlowState = async () => {
  const data = await get(`yes/flowstate`, {
    headers: {
      Authorization: `Bearer ${jwtLocalStorage.get()}`,
    },
  })

  return data
}

const resendConfirmationEmail = async () =>
  post(`email_verification/resend`, {
    headers: {
      Authorization: `Bearer ${jwtLocalStorage.get()}`,
    },
  })

const getVerificationCode = async (email: string) =>
  get(`dev/email_code?email=${email}`, {
    headers: {
      Authorization: `Bearer ${jwtLocalStorage.get()}`,
    },
  })

const verifyEmail = async (email: string, code: string) => {
  const body = JSON.stringify({
    data: {
      type: 'verify_email_request',
      attributes: {
        email,
        code,
      },
    },
  })

  await post(`email_verification/verify`, {
    headers: {
      Authorization: `Bearer ${jwtLocalStorage.get()}`,
    },
    body,
  })
}

const verifyDocscanEmail = async (email: string) => {
  const body = JSON.stringify({
    data: {
      type: 'docscan_update_email',
      attributes: {
        email,
      },
    },
  })

  await post(`yoti/docscan/update_email`, {
    headers: {
      Authorization: `Bearer ${jwtLocalStorage.get()}`,
    },
    body,
  })
}

const getYotiDocScanSession = async () =>
  get(`yoti/docscan`, {
    headers: {
      Authorization: `Bearer ${jwtLocalStorage.get()}`,
    },
  })

const getDocScanSessionResults = async (sessionID: string) =>
  get(`yoti/docscan/sessions/${sessionID}`, {
    headers: {
      Authorization: `Bearer ${jwtLocalStorage.get()}`,
    },
  })

const yotiDocScanUploaded = async () =>
  post('yoti/docscan/documents_uploaded', {
    headers: {
      Authorization: `Bearer ${jwtLocalStorage.get()}`,
    },
  })

const sendYotiToken = async (token: string) =>
  get(`yoti/tokencb?token=${token}`, {
    headers: {
      Authorization: `Bearer ${jwtLocalStorage.get()}`,
    },
  })

const getPaymentInfo = async () =>
  get(`payment_info`, {
    headers: {
      Authorization: `Bearer ${jwtLocalStorage.get()}`,
    },
  })

const updatePaymentInfo = async (paymentSent = true) =>
  patch('payment_info', {
    body: JSON.stringify({
      data: {
        id: '',
        type: 'update_payment_status',
        attributes: {
          status: paymentSent ? 'sent' : 'not_sent',
        },
      },
    }),
    headers: {
      Authorization: `Bearer ${jwtLocalStorage.get()}`,
    },
  })

interface AddAddressAttributes {
  // eslint-disable-next-line camelcase
  auth_pair: {
    address: string
    // eslint-disable-next-line camelcase
    signed_message: string
  }
  // eslint-disable-next-line camelcase
  kyb_userhash?: string
}

const addAddress = async (
  address: string,
  signedMessage: string,
  kybUserHash?: string,
) => {
  const attributes: AddAddressAttributes = {
    auth_pair: {
      address,
      signed_message: signedMessage,
    },
  }

  if (kybUserHash !== undefined) {
    attributes.kyb_userhash = kybUserHash
  }

  return post('addresses', {
    body: JSON.stringify({
      data: {
        type: 'add_address',
        attributes,
      },
    }),
    headers: {
      Authorization: `Bearer ${jwtLocalStorage.get()}`,
    },
  })
}

const deleteAddress = async (address: string) =>
  del(`addresses/${address}`, {
    headers: {
      Authorization: `Bearer ${jwtLocalStorage.get()}`,
    },
  })

const getPricesV2 = async (
  addresses: string[],
  currencies: string[] = ['usd'],
  networkId: SupportedNetworkId,
): Promise<ExchangePriceResponseV2> =>
  get(
    `exchange_prices?chain_id=${networkId}&contract_addresses=${addresses.join(
      ',',
    )}&vs_currencies=${currencies.join(',')}`,
  )

const getToS = async (): Promise<ToSResponse> =>
  get('yes/init_sign_flow', {
    headers: {
      Authorization: `Bearer ${jwtLocalStorage.get()}`,
    },
    credentials: 'include',
  })

const getSignedDocInfo = async () =>
  get('yes/signed_doc', {
    headers: {
      Authorization: `Bearer ${jwtLocalStorage.get()}`,
    },
    credentials: 'include',
  })

const getYesSignDocFlowState = async () =>
  get(`yes/docsign_flowstate`, {
    headers: {
      Authorization: `Bearer ${jwtLocalStorage.get()}`,
    },
  })

const sendVouchersYotiToken = async (token: string) =>
  post('quickbuy/yoti_token', { body: JSON.stringify({ token }) })

const getVouchersList = () =>
  get('quickbuy/profile/vouchers', {
    headers: {
      Authorization: `Bearer ${getVouchersAuthToken()}`,
    },
  })

const getMostRecentlyCreatedVoucher = () =>
  get('quickbuy/profile/vouchers?page[limit]=1', {
    headers: {
      Authorization: `Bearer ${getVouchersAuthToken()}`,
    },
  })

const getMoonPayTransactionStatus = (transactionId: string) =>
  get(`quickbuy/moonpay/transaction_update/${transactionId}`)

const getVouchers = () =>
  get('profile/vouchers', {
    headers: {
      Authorization: `Bearer ${jwtLocalStorage.get()}`,
    },
  })

const updateVouchersVoucherBackground = (
  voucherId: string,
  imageURL: string,
) => {
  const requestBody = {
    data: {
      id: voucherId,
      type: 'quickbuy_voucher_update',
      attributes: {
        background: {
          url: imageURL,
        },
      },
    },
  }

  return patch(`quickbuy/vouchers/${voucherId}`, {
    headers: {
      Authorization: `Bearer ${getVouchersAuthToken()}`,
    },
    body: JSON.stringify(requestBody),
  })
}

const redeemVoucher = (voucherId: string) =>
  post(`quickbuy/vouchers/${voucherId}/redeem`, {
    headers: {
      Authorization: `Bearer ${jwtLocalStorage.get()}`,
    },
  })

const signMoonpayURL = (url: string) =>
  post(`quickbuy/payment/sign_url`, {
    body: JSON.stringify({ url }),
    shouldNotReturnDataProperty: true,
  })

const getTotalVouchersValue = (currency: string): Promise<number> =>
  get(`quickbuy/profile/vouchers/value?currency=${currency}`, {
    headers: {
      Authorization: `Bearer ${getVouchersAuthToken()}`,
    },
    shouldNotReturnDataProperty: true,
  }).then((data) => data.value)

interface LogNotes {
  type: string
  attributes: Record<string, unknown>
}

interface AddLogResponse {
  attributes: {
    log_notes: LogNotes
    log_time: string
    user_id: number
  }
  id: string
  type: string
}

const addLog = (
  userId: string,
  logNotes: LogNotes,
): Promise<AddLogResponse> => {
  const requestBody = {
    data: {
      type: 'add_log',
      attributes: {
        user_id: parseInt(userId, 10),
        log_notes: logNotes,
      },
    },
  }

  return post('logs', {
    headers: {
      Authorization: `Bearer ${jwtLocalStorage.get()}`,
    },
    body: JSON.stringify(requestBody),
  })
}

const getSMTSupply = () =>
  get('smt_supply', {
    headers: {
      Authorization: `Bearer ${jwtLocalStorage.get()}`,
    },
  })

const getAnnouncements = (
  networkId: number,
): Promise<AnnouncementResponse[]> => {
  const token = jwtLocalStorage.get()

  return get(`announcements/for-user/list?filter[chain_id]=${networkId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

const updateAddressLabel = async (
  address: string,
  label: string,
): Promise<boolean> => {
  const requestBody = {
    data: {
      type: 'address_label',
      attributes: {
        label,
      },
    },
  }
  return post(`addresses/${address}/label`, {
    headers: {
      Authorization: `Bearer ${jwtLocalStorage.get()}`,
    },
    body: JSON.stringify(requestBody),
  })
}

const requestMaticFromFaucet = (
  address: string,
): Promise<MaticFaucetResponse> =>
  get(`addresses/${address}/faucet/matic`, {
    headers: {
      Authorization: `Bearer ${jwtLocalStorage.get()}`,
    },
  })

const loyaltyLevels = async (address: string, networkId: number) => {
  const body = JSON.stringify({
    data: {
      type: 'loyalty_level_request',
      attributes: {
        chainId: networkId,
      },
    },
  })
  const data = await post(`addresses/${address}/loyalty_levels`, {
    body,
  })

  return data
}

const createSumsubKybSession = (sourceKey: string) =>
  post(`sumsub/kyb/sessions?sourceKey=${sourceKey}`, {
    headers: {
      Authorization: `Bearer ${jwtLocalStorage.get()}`,
    },
  })

const getSumsubKybSessionAccessToken = (
  sessionId: string,
  sourceKey: string,
): Promise<string> =>
  get(
    `sumsub/kyb/access-token?userHash=${encodeURIComponent(
      sessionId,
    )}?sourceKey=${sourceKey}`,
    {
      headers: {
        Authorization: `Bearer ${jwtLocalStorage.get()}`,
      },
    },
  ).then((data) => data.attributes.token)

interface SumsubKybSessionResponse {
  id: string
  attributes: {
    status: KybStatus
    // eslint-disable-next-line camelcase
    business_name: string
    address: string
  }
}
const getSumsubKybSessions = async () => {
  const sessions = await get<SumsubKybSessionResponse[]>(
    'sumsub/kyb/sessions',
    {
      headers: {
        Authorization: `Bearer ${jwtLocalStorage.get()}`,
      },
    },
  )

  return sessions.map((session) => {
    return {
      ...session,
      attributes: {
        status: session.attributes.status,
        businessName: session.attributes.business_name,
        address: session.attributes.address,
      },
    }
  })
}

const deleteSumsubKybSession = (sessionId: string) =>
  del(`sumsub/kyb/sessions/${encodeURIComponent(sessionId)}`, {
    headers: {
      Authorization: `Bearer ${jwtLocalStorage.get()}`,
    },
  })

const setBusinessAddress = (sessionId: string, address: string) =>
  patch(`sumsub/kyb/sessions/${encodeURIComponent(sessionId)}`, {
    headers: {
      Authorization: `Bearer ${jwtLocalStorage.get()}`,
    },
    body: JSON.stringify({
      data: {
        type: 'patch_sumsub_kyb_session',
        attributes: {
          address,
        },
      },
    }),
  })

const createSumsubKYCSession = (
  sourceKey: string,
): Promise<{
  id: string
  type: 'sumsub_access_token'
  attributes: { token: string }
}> =>
  post(`sumsub/kyc/sessions?sourceKey=${sourceKey}`, {
    headers: {
      Authorization: `Bearer ${jwtLocalStorage.get()}`,
    },
  })

const getSumsubKYCSessionAccessToken = (sourceKey: string) =>
  get(`sumsub/kyc/access-token?sourceKey=${sourceKey}`, {
    headers: {
      Authorization: `Bearer ${jwtLocalStorage.get()}`,
    },
  }).then((data) => data.attributes.token)

const linkToAffiliate = (
  code: string,
  campaign?: string | null,
): Promise<AffiliateLinkResponse> =>
  post(
    `affiliate/link?${new URLSearchParams({
      code,
      ...(campaign && { campaign }),
    })}`,
    {
      headers: {
        Authorization: `Bearer ${jwtLocalStorage.get()}`,
      },
    },
  )

const sendEdgetagUserId = async (tagUserId: string) =>
  post(`edgetag/map?user_id=${tagUserId}`, {
    headers: {
      Authorization: `Bearer ${jwtLocalStorage.get()}`,
    },
  })

const initializeTtd = () =>
  get('ttd/init', {
    credentials: 'include',
    redirect: 'follow',
    shouldNotReturnDataProperty: true,
  })

interface SofVerificationPayload {
  amount: number | string
  sourceOfIncome: string
  otherSource: string
  showOtherSource: boolean
  investKnowledge: string
  annualIncome: string
  netWorth: string
  document: string
  stocksKnowledge: string
  bondsKnowledge: string
  investGoal: string
  supportIssues: string
  financialPosition: string
  comfortableRisk: string
  schoolQualification: string
  agreement: boolean
}

const sofVerification = (payload: SofVerificationPayload) =>
  post(`sof/verifications`, {
    headers: {
      Authorization: `Bearer ${jwtLocalStorage.get()}`,
    },
    body: JSON.stringify({
      data: {
        type: 'sof_verification_form',
        attributes: {
          answers_sof: {
            amount: Number(payload.amount),
            source_of_income: payload.sourceOfIncome,
            show_other_source: payload.showOtherSource,
            other_source: payload.otherSource,
            invest_knowledge: payload.investKnowledge,
            annual_income: payload.annualIncome,
            net_worth: payload.netWorth,
            document_url: payload.document,
          },
          answers_suitability: {
            knowledge_stocks: payload.stocksKnowledge,
            knowledge_bonds: payload.bondsKnowledge,
            school_qualification: payload.schoolQualification,
            held_positions: payload.financialPosition,
            risk_comfortable: payload.comfortableRisk,
            investment_goal: payload.investGoal,
            support_issues: payload.supportIssues,
          },
          terms_accepted: payload.agreement,
        },
      },
    }),
  })

const mattereumWhitelist = (): Promise<void> =>
  post('mattereum/whitelist', {
    headers: {
      Authorization: `Bearer ${jwtLocalStorage.get()}`,
    },
  })

export default {
  genericRequest,
  addLog,
  get,
  getTier,
  checkExistence,
  getPricesV2,
  nonceMessage,
  register,
  login,
  profile,
  publicProfile,
  acceptToS,
  location,
  linkToAffiliate,
  initYesFlow,
  getYesFlowState,
  resendConfirmationEmail,
  getVerificationCode,
  verifyEmail,
  verifyDocscanEmail,
  getYotiDocScanSession,
  yotiDocScanUploaded,
  getDocScanSessionResults,
  sendYotiToken,
  getPaymentInfo,
  updatePaymentInfo,
  addAddress,
  deleteAddress,
  getToS,
  getSignedDocInfo,
  getYesSignDocFlowState,
  sendVouchersYotiToken,
  getVouchersList,
  updateVouchersVoucherBackground,
  getVouchers,
  redeemVoucher,
  getSMTSupply,
  signMoonpayURL,
  getTotalVouchersValue,
  getMostRecentlyCreatedVoucher,
  getMoonPayTransactionStatus,
  updateAddressLabel,
  requestMaticFromFaucet,
  createSumsubKybSession,
  getSumsubKybSessionAccessToken,
  getSumsubKybSessions,
  deleteSumsubKybSession,
  setBusinessAddress,
  loyaltyLevels,
  createSumsubKYCSession,
  getSumsubKYCSessionAccessToken,
  getAnnouncements,
  sendEdgetagUserId,
  getFeatureFlags,
  initializeTtd,
  sofVerification,
  mattereumWhitelist,
}
