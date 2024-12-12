import { Obj } from '@swarm/types'
import BaseResponse from '@swarm/types/api-responses/base.response'
import { ProfileAttributes } from '@swarm/types/api-responses/profile.response'
import { AppState, DispatchWithThunk } from '@swarm/types/state'
import { AlertVariant } from '@swarm/ui/swarm/Snackbar/types'

import api from '@core/services/api'
import { kycProviderMap } from '@core/shared/consts/kyc-provider-map'
import i18n from '@core/shared/i18n'
import { yotiDocScanSessionIdLocalStorage } from '@core/shared/localStorage'
import { jwtLocalStorage } from '@core/shared/localStorage/jwtLocalStorage'
import repeat from '@core/shared/utils/helpers/repeat'

import {
  ACCEPT_TOS_FAILED,
  ACCEPT_TOS_SUCCESS,
  ACCOUNT_CHANGED,
  DOC_SCAN_OUTCOME_REASON,
  DOC_SCAN_SESSION_WAITING,
  EMAIL_VERIFIED_FAILED,
  LOGIN_FAILED,
  PROFILE_UPDATED,
  REGISTER_FAILED,
  SESSION_EXPIRED,
  YES_FLOW_FAILED,
  YOTI_FLOW_FAILED,
} from './action-types'
import { alertAdded } from './snackbar'
import { parseUserAddresses, parseUserData } from './utils'

export const profileUpdated = (
  profile: BaseResponse<Partial<ProfileAttributes>>,
) => ({
  type: PROFILE_UPDATED,
  payload: {
    user: {
      id: profile.id,
      ...(profile.attributes.verification_status && {
        verificationStatus: profile.attributes.verification_status,
      }),
      ...(profile.attributes.kyc_status && {
        kycStatus: profile.attributes.kyc_status,
      }),
      ...(profile.attributes.tier && { tier: profile.attributes.tier }),
      ...(profile.attributes.userhash && {
        userHash: profile.attributes.userhash,
      }),
      ...(profile.attributes.email_verified && {
        emailVerified: profile.attributes.email_verified,
      }),
      ...{
        ...(profile.attributes.userdata && {
          ...parseUserData(profile.attributes.userdata),
        }),
      },
      ...(profile.attributes.ethereum_addresses && {
        accounts: parseUserAddresses(profile.attributes.ethereum_addresses),
      }),
    },
  },
})

export const accountChanged =
  (account: string) => async (dispatch: DispatchWithThunk<AppState>) => {
    let payload: Obj = { account }

    try {
      const {
        attributes: { tier },
      } = await api.getTier(account)
      payload = { ...payload, tier }
    } catch {
      /* do nothing */
    }

    try {
      const {
        attributes: { kyc_provider: kycProviderKey },
      } = await api.publicProfile(account)
      payload = {
        ...payload,
        ...(kycProviderKey && { kycProvider: kycProviderMap[kycProviderKey] }),
      }
    } catch {
      /* do nothing */
    }

    dispatch({ type: ACCOUNT_CHANGED, payload })
  }

// @todo Fix types when possible
export const registrationFailed = (error: unknown) => ({
  type: REGISTER_FAILED,
  payload: {
    error,
  },
})

// @todo Fix types when possible
export const loginFailed = (error: unknown) => ({
  type: LOGIN_FAILED,
  payload: {
    error,
  },
})

export const acceptToSSuccess = () => ({
  type: ACCEPT_TOS_SUCCESS,
})

// @todo Fix types when possible
export const acceptToSFailed = (error: unknown) => ({
  type: ACCEPT_TOS_FAILED,
  payload: {
    error,
  },
})

export const yesFlowFailed = (error: unknown) => ({
  type: YES_FLOW_FAILED,
  payload: {
    error,
  },
})

export const sessionExpired = () => ({
  type: SESSION_EXPIRED,
  payload: {
    error: SESSION_EXPIRED,
  },
})

export const docScanSessionWaitingUpdated = (status: number) => ({
  type: DOC_SCAN_SESSION_WAITING,
  payload: {
    status,
  },
})

export const docScanSessionOutcomeReason = (reason: string) => ({
  type: DOC_SCAN_OUTCOME_REASON,
  payload: {
    reason,
  },
})

export const register =
  (address: string, signedMessage: string) =>
  async (dispatch: DispatchWithThunk<AppState>) => {
    try {
      const response = await api.register(address, signedMessage)
      jwtLocalStorage.set(response.attributes.access_token)
      const profile = await api.profile()

      dispatch(profileUpdated(profile))
    } catch (error) {
      dispatch(registrationFailed(error))
    }
  }

export const login =
  (address: string, signedMessage: string) =>
  async (dispatch: DispatchWithThunk<AppState>) => {
    try {
      const response = await api.login(address, signedMessage)
      jwtLocalStorage.set(response.attributes.access_token)
      const profile = await api.profile()

      dispatch(profileUpdated(profile))
      dispatch(
        alertAdded({
          message: 'Ethereum address verified',
          variant: AlertVariant.success,
        }),
      )
    } catch (error) {
      dispatch(loginFailed(error))
    }
  }

export const acceptToS =
  (message: string, signedMessage: string) =>
  async (dispatch: DispatchWithThunk<AppState>) => {
    try {
      await api.acceptToS(message, signedMessage)

      dispatch(acceptToSSuccess())
    } catch (error) {
      dispatch(acceptToSFailed(error))
    }
  }

// @todo unused code
export const emailVerifiedFailed = (error: unknown) => ({
  type: EMAIL_VERIFIED_FAILED,
  payload: {
    error,
  },
})

export const resendConfirmationEmail = () => async () => {
  await api.resendConfirmationEmail()
}

let yesWindowRef: Window | null

export const initYesFlow =
  () => async (dispatch: DispatchWithThunk<AppState>) => {
    try {
      const data = await api.initYesFlow()

      if (!yesWindowRef || yesWindowRef.closed) {
        yesWindowRef = window.open(
          data.attributes.location,
          'Verify using Yes.com',
          'resizable,width=600,height=800',
        )

        await repeat(async (stop) => {
          if (yesWindowRef?.closed) {
            stop()
          }
          try {
            const response = await api.getYesFlowState()
            const { state } = response?.attributes || {}
            if (state === 'authorized') {
              stop()
              yesWindowRef?.close()
              const profile = await api.profile()

              dispatch(profileUpdated(profile))
              await i18n.loadNamespaces('onboarding')

              if (profile.attributes.kyc_status === 'approved') {
                dispatch(
                  alertAdded({
                    message: i18n.t(
                      `verifyIdentity.messages.yes.successMessage.message`,
                      { ns: 'onboarding' },
                    ) as string,
                    variant: AlertVariant.success,
                  }),
                )
              }

              if (profile.attributes.kyc_status === 'rejected') {
                dispatch(
                  alertAdded({
                    message: i18n.t(
                      `verifyIdentity.messages.yes.errorMessage.message`,
                      { ns: 'onboarding' },
                    ) as string,
                    secondaryMessage: i18n.t(
                      `verifyIdentity.messages.yes.errorMessage.secondaryMessage`,
                      { ns: 'onboarding' },
                    ),
                    variant: AlertVariant.error,
                  }),
                )
              }
            }
          } catch (e) {
            stop()
            yesWindowRef?.close()
            dispatch(sessionExpired())
          }
        }, 2000)
      } else {
        yesWindowRef.focus()
      }
    } catch (error) {
      dispatch(yesFlowFailed(error))
      dispatch(
        alertAdded({
          message: i18n.t(`verifyIdentity.messages.yes.errorMessage.message`, {
            ns: 'onboarding',
          }) as string,
          secondaryMessage: i18n.t(
            `verifyIdentity.messages.yes.errorMessage.secondaryMessage`,
            { ns: 'onboarding' },
          ),
          variant: AlertVariant.error,
        }),
      )
      const profile = await api.profile()

      dispatch(profileUpdated(profile))
    }
  }

export const yotiFlowFailed = () => ({
  type: YOTI_FLOW_FAILED,
})

export const initYotiDocScan = () => async () => {
  const data = await api.getYotiDocScanSession()

  yotiDocScanSessionIdLocalStorage.set(data.id)

  window.location.replace(
    `https://api.yoti.com/idverify/v1/web/index.html?sessionID=${data.id}&sessionToken=${data.attributes.client_session_token}`,
  )
}

export const docScanSessionResults =
  (sessionID: string) => async (dispatch: DispatchWithThunk<AppState>) => {
    await api.yotiDocScanUploaded()

    const profile = await api.profile()
    dispatch(profileUpdated(profile))

    dispatch(docScanSessionWaitingUpdated(2))
    await repeat(async (stop) => {
      try {
        const data = await api.getDocScanSessionResults(sessionID)
        if (
          data.attributes.status === 'EXPIRED' ||
          (data.attributes.status === 'COMPLETED' &&
            data.attributes.outcome_status === 'rejected')
        ) {
          dispatch(
            docScanSessionOutcomeReason(
              data.attributes.outcome_reason &&
                data.attributes.outcome_reason.length
                ? data.attributes.outcome_reason[0].reason
                : 'DEFAULT',
            ),
          )
          dispatch(
            alertAdded({
              message: 'Verification failed.',
              secondaryMessage:
                'An error happened while trying to verify your Kyc',
              variant: AlertVariant.error,
            }),
          )
          stop()
        } else if (
          data.attributes.status === 'COMPLETED' &&
          data.attributes.outcome_status === 'approved'
        ) {
          dispatch(
            alertAdded({
              message: 'Verification Success.',
              secondaryMessage: 'Your identity has been verified',
              variant: AlertVariant.success,
            }),
          )
          stop()
        }
      } catch (e) {
        stop()
        dispatch(docScanSessionOutcomeReason('DEFAULT'))
        dispatch(
          alertAdded({
            message: 'Verification failed.',
            secondaryMessage:
              'An error happened while trying to verify your Kyc',
            variant: AlertVariant.error,
          }),
        )
      }
    }, 5000)
    dispatch(docScanSessionWaitingUpdated(1))

    const updatedProfile = await api.profile()
    dispatch(profileUpdated(updatedProfile))
  }

export const yotiTokenSent =
  (token: string) => async (dispatch: DispatchWithThunk<AppState>) => {
    try {
      await api.sendYotiToken(token)
    } catch (error) {
      dispatch(yotiFlowFailed())
      dispatch(
        alertAdded({
          message: 'Verification failed.',
          secondaryMessage:
            'An error happened while trying to verify your identity',
          variant: AlertVariant.error,
        }),
      )
    }

    const profile = await api.profile()

    dispatch(profileUpdated(profile))
  }

export const initYesSignDocFlow =
  (url: string) => async (dispatch: DispatchWithThunk<AppState>) => {
    try {
      if (!yesWindowRef || yesWindowRef.closed) {
        yesWindowRef = window.open(
          url,
          'Sign ToS using Yes.com',
          'resizable,width=600,height=800',
        )

        await repeat(async (stop) => {
          if (yesWindowRef?.closed) {
            dispatch(
              alertAdded({
                message: 'Signing document failed.',
                secondaryMessage:
                  'Signing document not completed because Yes.com window was closed.',
                variant: AlertVariant.error,
              }),
            )
            stop()
          }

          try {
            const response = await api.getYesSignDocFlowState()
            const { state } = response?.attributes || {}
            if (state === 'in_progress') {
              return
            }

            stop()
            yesWindowRef?.close()
            if (state === 'approved') {
              const profile = await api.profile()

              dispatch(profileUpdated(profile))
            } else {
              dispatch(
                alertAdded({
                  message: 'Signing document failed.',
                  variant: AlertVariant.error,
                }),
              )
            }
          } catch (e) {
            stop()
            yesWindowRef?.close()
            dispatch(sessionExpired())
          }
        }, 1000)
      } else {
        yesWindowRef.focus()
      }
    } catch (error) {
      dispatch(
        alertAdded({
          message: 'Signing document failed.',
          secondaryMessage:
            'An error happened while trying to sign the document',
          variant: AlertVariant.error,
        }),
      )

      const profile = await api.profile()

      dispatch(profileUpdated(profile))
    }
  }
