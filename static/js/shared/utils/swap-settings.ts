import { BrandRoutes } from '@swarm/core/shared/enums'
import { getCurrentBaseName } from '@swarm/core/shared/utils'
import { SwapTxSettings } from '@swarm/types'

import { ADVANCED_SETTINGS_KEY, defaultSettings } from 'src/shared/consts'

const getBrandSettings = () => {
  const basename = getCurrentBaseName()

  if (basename === BrandRoutes.mattereum || basename === BrandRoutes.fintiv) {
    return {
      autoPaySmtDiscount: false,
    }
  }

  return {}
}

export const getStoredSettings = (): SwapTxSettings => {
  const storedStringValue = sessionStorage.getItem(ADVANCED_SETTINGS_KEY)
  const brandSettings = getBrandSettings()

  if (!storedStringValue) {
    sessionStorage.setItem(
      ADVANCED_SETTINGS_KEY,
      JSON.stringify(defaultSettings),
    )

    return {
      ...defaultSettings,
      ...brandSettings,
    }
  }

  const storedValue = JSON.parse(storedStringValue)

  return {
    ...defaultSettings,
    ...storedValue,
    ...brandSettings,
  }
}

export const saveSettingsPerSession = (newSettings: SwapTxSettings) =>
  sessionStorage.setItem(ADVANCED_SETTINGS_KEY, JSON.stringify(newSettings))
