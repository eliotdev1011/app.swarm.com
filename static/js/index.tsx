import { BrandRoutes } from '@swarm/core/shared/enums'
import { getCurrentBaseName } from '@swarm/core/shared/utils'
import React from 'react'
import { createRoot } from 'react-dom/client'

import '@swarm/core/shared/i18n'
import '@swarm/ui/theme/fonts.css'
import '@swarm/ui/theme/styles.css'

const App = React.lazy(() => {
  const basename = getCurrentBaseName()

  if (basename === BrandRoutes.mattereum) {
    return import('./apps/Mattereum')
  }

  if (basename === BrandRoutes.fintiv) {
    return import('./apps/Fintiv')
  }

  return import('./App')
})

const domNode = document.getElementById('root') as HTMLElement
const root = createRoot(domNode)

root.render(
  <React.Suspense fallback={<div />}>
    <App />
  </React.Suspense>,
)
