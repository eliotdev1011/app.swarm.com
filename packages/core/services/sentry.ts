import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'

let isInitialized = false

export function setupSentry(
  dsn: string,
  release: string,
  environment: string,
): void {
  Sentry.init({
    release,
    dsn,
    integrations: [new BrowserTracing()],
    tracesSampleRate: 0.25,
    environment,
  })

  isInitialized = true
}

export function setSentryNetworkContext(
  networkId: number,
  networkName: string,
): void {
  Sentry.setContext('network', {
    chainId: networkId,
    name: networkName,
  })
}

export const captureException: typeof Sentry.captureException = (...args) => {
  if (isInitialized) {
    return Sentry.captureException(...args)
  }

  // eslint-disable-next-line no-console
  console.error(...args)
  return ''
}
