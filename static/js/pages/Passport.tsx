import Content from '@swarm/ui/presentational/Content'
import AlertPanel from '@swarm/ui/swarm/AlertPanel'
import { useTranslation } from 'react-i18next'

import HeaderActions from 'src/components/HeaderActions'
import { InvestSecurityProvider } from 'src/components/Invest/InvestSecurityContext'
import Layout from 'src/components/Layout'
import MyAddresses from 'src/components/Passport/MyAddresses'
import PassportDetails from 'src/components/Passport/PassportDetails'

const Passport = () => {
  const { t } = useTranslation('passport')

  return (
    <Layout
      header={t('header')}
      scrollable
      headerActions={<HeaderActions addLiquidity />}
    >
      <Content bg="background">
        <AlertPanel promptSignIn />
        <InvestSecurityProvider>
          <PassportDetails />
        </InvestSecurityProvider>
        {/* Temporary pased TO DO: TO BE REMOVED */}
        {/* <Businesses /> */}
        <MyAddresses />
      </Content>
    </Layout>
  )
}

export default Passport
