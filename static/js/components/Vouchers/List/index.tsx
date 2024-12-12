import useRequest from '@swarm/core/hooks/async/useRequest'
import useTimeout from '@swarm/core/hooks/effects/useTimeout'
import api from '@swarm/core/services/api'
import Content from '@swarm/ui/presentational/Content'
import { StyledTabs } from '@swarm/ui/presentational/StyledTabs'
import StyledTab from '@swarm/ui/swarm/StyledTab'
import qs from 'query-string'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Redirect, useHistory, useLocation } from 'react-router'
import { Button, Flex } from 'rimble-ui'
import styled from 'styled-components/macro'

import Layout from 'src/components/Layout'
import VoucherCard from 'src/components/Vouchers/List/VoucherCard'
import { IVoucherResponse } from 'src/components/Vouchers/interfaces'
import { ROUTES } from 'src/routes'

const VOUCHER_STATUSES = ['approved', 'redeem_pending', 'redeemed']

const HeaderButton = styled(Button)`
  bottom: 80px;

  @media (max-width: 831px) {
    bottom: 63px;
  }
`

const VouchersList = () => {
  const history = useHistory()
  const { search } = useLocation()
  const { t } = useTranslation('vouchers')
  const [activeTabIndex, setActiveTabIndex] = useState(0)

  const { data, refetch, error } = useRequest<
    () => Promise<IVoucherResponse[]>
  >(api.getVouchersList)

  const { newVoucherID } = qs.parse(search)

  useTimeout(
    () => {
      history.push('/vouchers/list')
    },
    newVoucherID ? 5000 : null,
  )

  const handleBuyMoreClick = () => {
    history.push('/vouchers')
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  const handleTabChange = (e: React.ChangeEvent<{}>, index: number) => {
    setActiveTabIndex(index)
  }

  const getTabs = () => {
    return VOUCHER_STATUSES.map((status, index) => {
      const vouchers = data?.filter((v) => v.attributes.status === status) || []
      const title = t(`${'vouchersList.sectionTitles'}.${status}`)

      return (
        <StyledTab
          key={`tab-${title}`}
          label={title}
          amountIn={vouchers.length}
          value={index}
        />
      )
    })
  }

  if (error) {
    return <Redirect to={ROUTES.VOUCHERS} />
  }

  const vouchers =
    data?.filter(
      (v) => v.attributes.status === VOUCHER_STATUSES[activeTabIndex],
    ) || []

  return (
    <Layout
      header={t('vouchersList.header')}
      subheader={
        <Flex flex="1" flexDirection="column">
          <StyledTabs
            value={activeTabIndex}
            indicatorColor="primary"
            textColor="primary"
            onChange={handleTabChange}
            aria-label="Voucher tabs"
          >
            {getTabs()}
          </StyledTabs>
          <HeaderButton
            position="absolute"
            width="120px"
            fontWeight="600"
            height="37px"
            alignSelf="flex-end"
            onClick={handleBuyMoreClick}
          >
            Buy More
          </HeaderButton>
        </Flex>
      }
    >
      <Content bg="background">
        <Flex flexWrap="wrap" flexDirection="column" width="100%">
          <Flex flexWrap="wrap" flexDirection="row" width="100%">
            {vouchers.map((voucher) => (
              <VoucherCard
                key={`voucher-${voucher.id}`}
                data={voucher}
                refetch={refetch}
                animate={voucher.id.toString() === newVoucherID}
              />
            ))}
          </Flex>
        </Flex>
      </Content>
    </Layout>
  )
}

export default VouchersList
