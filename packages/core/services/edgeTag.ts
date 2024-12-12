import * as blotoutEdgeTagSdk from '@blotoutio/edgetag-sdk-js'

import config from '@core/config/index'
import { ttdIdLocalStorage } from '@core/shared/localStorage'

import api from './api'

const { edgeTagPreferences } = config

type EdgeTagName = 'InitiateCheckout' | 'PageView'

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace edgeTag {
  export const COOKIES_USER_ID_KEY = 'tag_user_id'

  export async function initialize() {
    if (edgeTagPreferences.edgeUrl) {
      const existingTtdId = ttdIdLocalStorage.get()
      if (existingTtdId === null) {
        const ttdId = await api.initializeTtd()
        const ttdIdRegExp = new RegExp(
          '^[0-9a-fA-F]{8}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{12}$',
        )
        if (ttdIdRegExp.test(ttdId)) {
          ttdIdLocalStorage.set(ttdId)
        }
      }

      blotoutEdgeTagSdk.init({
        edgeURL: edgeTagPreferences.edgeUrl,
        disableConsentCheck: true, // initialize function is called once user has given statistic cookies consent
      })
    }
  }

  const afterTagging = (name: EdgeTagName, data?: Record<string, unknown>) => {
    /**
     * You can opt-in during development using: REACT_APP_EDGETAG_DEBUG
     * only if it is set `true` you will able to see the logs
     */
    if (edgeTagPreferences.debug) {
      // eslint-disable-next-line no-console
      console.warn(
        name,
        Object.fromEntries(
          Object.entries({ name, data }).filter(([, v]) => !!v),
        ),
      )
    }
  }

  /**
   * General method to emit an event to EdgeTag
   * @param name - name of the tag to send (see https://app.edgetag.io/integration/step-by-step)
   * @param data - data for the tag event (see https://app.edgetag.io/integration/step-by-step)
   */
  const tag = (
    name: EdgeTagName,
    data?: Record<string, unknown>,
    providers?: Record<string, unknown>,
  ): void => {
    blotoutEdgeTagSdk.tag(name, data, providers)
    afterTagging(name, data)
  }

  export const tagPageView = () => {
    tag('PageView', { value: 10.0, currency: 'USD' })
  }

  export const tagStartOnboarding = () => {
    tag('InitiateCheckout', { value: 1000, currency: 'USD' }, { ttd: true })
  }
}

export default edgeTag
