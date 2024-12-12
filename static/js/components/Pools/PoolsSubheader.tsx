import useFeatureFlags, {
  FlaggedFeatureName,
} from '@swarm/core/hooks/data/useFeatureFlags'
import { StyledTabs } from '@swarm/ui/presentational/StyledTabs'
import FlaggedFeature from '@swarm/ui/swarm/FlaggedFeature'
import StyledTab from '@swarm/ui/swarm/StyledTab'
import { useTranslation } from 'react-i18next'
import { generatePath, Redirect, useHistory, useParams } from 'react-router'

import { ROUTES } from 'src/routes'

import { PoolCategory } from './consts'

const categories: Record<PoolCategory, number> = {
  all: 0,
  'my-pools': 1,
}

const tabs: PoolCategory[] = ['all', 'my-pools']

const PoolsSubheader = () => {
  const { t } = useTranslation('pools')
  const history = useHistory()

  const { category = 'all' } = useParams<{
    category?: PoolCategory
  }>()

  const currentTabIndex = categories[category]

  const { checkFeature } = useFeatureFlags()

  if (
    !checkFeature(FlaggedFeatureName.allPools) &&
    currentTabIndex !== categories['my-pools']
  ) {
    return (
      <Redirect
        to={generatePath(ROUTES.POOLS_CATEGORY, {
          category: tabs[categories['my-pools']],
        })}
      />
    )
  }

  const switchTab = (tab: keyof typeof categories) => {
    if (tab === tabs[0]) {
      history.push(ROUTES.POOLS)
    } else {
      history.push(
        generatePath(ROUTES.POOLS_CATEGORY, {
          category: tab,
        }),
      )
    }
  }

  const handleSwitchTab = (_: unknown, index: number) => {
    if (index !== categories[category]) {
      switchTab(tabs[index])
    }
  }

  return (
    <StyledTabs
      value={currentTabIndex}
      onChange={handleSwitchTab}
      aria-label="Pool tabs"
    >
      <FlaggedFeature name={FlaggedFeatureName.allPools}>
        <StyledTab label={t('tabs.all')} />
      </FlaggedFeature>
      <StyledTab label={t('tabs.my-pools')} />
    </StyledTabs>
  )
}

export default PoolsSubheader
