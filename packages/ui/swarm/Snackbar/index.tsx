import config from '@swarm/core/config'
import { ErrorDetails } from '@swarm/core/services/error-handler'
import { getErrorDetails } from '@swarm/core/services/error-handler/helpers'
import { AppContext } from '@swarm/core/state/AppContext'
import {
  alertAdded,
  alertDismissed,
  alertsCleared,
} from '@swarm/core/state/actions/snackbar'
import { flashLocalStorage } from '@swarm/core/shared/localStorage'
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'

import AnimationWrapper from './AnimationWrapper'
import ToastMessage from './ToastMessage'
import { AlertOptions, AlertVariant } from './types'

const { faq: faqLink } = config.resources.docs.gettingStarted

const SnackbarContext = createContext<{
  addAlert: (message: React.ReactNode, options?: AlertOptions) => void
  dismissAlert: (key: string) => void
  clearAlerts: () => void
  addError: (e: string | unknown | Error, fallback?: ErrorDetails) => void
  reportError: (e: string | unknown | Error) => void
}>({
  addAlert: () => {},
  dismissAlert: () => {},
  clearAlerts: () => {},
  addError: () => {},
  reportError: () => {},
})

const Snackbar = styled.div`
  position: fixed;
  bottom: 16px;
  left: 16px;
  right: 16px;
  z-index: ${({ theme }) => theme.zIndices.snackbar};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;

  @media (min-width: ${({ theme }) => theme.breakpoints[1]}) {
    left: 50%;
    transform: translateX(-50%);
    right: unset;
  }
`

interface SnackbarProviderProps {
  children: React.ReactNode
}

const SnackbarProvider = ({ children }: SnackbarProviderProps) => {
  const {
    dispatch,
    appState: {
      ui: { alerts },
    },
  } = useContext(AppContext)
  const { t } = useTranslation('errors')

  const dismissAlert = useCallback(
    (key: string) => dispatch(alertDismissed(key)),
    [dispatch],
  )

  const addAlert = useCallback(
    (message: React.ReactNode, options?: AlertOptions) => {
      const prevAlert = alerts.length ? alerts[alerts.length - 1] : null

      if (prevAlert?.variant === AlertVariant.error) {
        dismissAlert(prevAlert.key)
      }

      dispatch(alertAdded({ message, ...options }))
    },
    [alerts, dismissAlert, dispatch],
  )

  const clearAlerts = useCallback(() => dispatch(alertsCleared()), [dispatch])

  const addError = useCallback(
    (e: string | unknown | Error, fallback?: ErrorDetails) => {
      if (typeof e === 'string') {
        addAlert(e, {
          variant: AlertVariant.error,
          autoDismissible: false,
        })
        return
      }

      const {
        description,
        actionText,
        actionHref,
        autoDismissible = false,
        actionHrefOpenInSameTab,
      } = getErrorDetails(e as Error, fallback)

      addAlert(description, {
        variant: AlertVariant.error,
        actionText,
        actionHref,
        autoDismissible,
        actionHrefOpenInSameTab,
      })
    },
    [addAlert],
  )

  const reportError = useCallback(
    (e: string | unknown | Error) =>
      addError(e, {
        description: t('transactionGeneric'),
        actionText: 'faqs',
        actionHref: faqLink,
      }),
    [addError, t],
  )

  useEffect(() => {
    const flashMessages = flashLocalStorage.get()

    flashMessages.forEach(({ message, ...options }) =>
      addAlert(message, options),
    )

    flashLocalStorage.remove()
  }, [addAlert])

  const value = useMemo(() => {
    return {
      addAlert,
      dismissAlert,
      clearAlerts,
      addError,
      reportError,
    }
  }, [addAlert, dismissAlert, clearAlerts, addError, reportError])

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <Snackbar>
        {alerts.map((alert) => (
          <AnimationWrapper key={`snackbar-${alert.key}`} out={alert.closing}>
            {(className: string) => (
              <ToastMessage
                {...alert}
                onClose={() => dismissAlert(alert.key)}
                className={className}
              />
            )}
          </AnimationWrapper>
        ))}
      </Snackbar>
    </SnackbarContext.Provider>
  )
}

const useSnackbar = () => {
  const context = useContext(SnackbarContext)
  if (!context) {
    throw new Error('useSnackbar should be inside SnackbarProvider')
  }
  return context
}

const addFlashAlert = (message: string, options?: AlertOptions): void => {
  const messages = flashLocalStorage.get()
  flashLocalStorage.set([...messages, { message, ...options }])
}

export { SnackbarProvider, useSnackbar, addFlashAlert }
