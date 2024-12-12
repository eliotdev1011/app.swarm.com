import { useTranslation } from 'react-i18next'

import HeaderActions from 'src/components/HeaderActions'
import Layout from 'src/components/Layout'
import Pools from 'src/components/Pools'
import PoolsSubheader from 'src/components/Pools/PoolsSubheader'

const PoolsPage = () => {
  const { t } = useTranslation('pools')
  return (
    <Layout
      header={t('header')}
      subheader={<PoolsSubheader />}
      scrollable
      headerActions={<HeaderActions createPool />}
    >
      <Pools />
    </Layout>
  )
}

export default PoolsPage
