import { toggleWalletAutoDisconnect } from '@swarm/core/observables/walletAutoDisconnect'
import { connect } from '@swarm/core/state/AppContext'
import { useIsLoggedIn } from '@swarm/core/state/hooks'
import { useAccount, useReadyState } from '@swarm/core/web3'
import { AppState } from '@swarm/types/state'
import Divider from '@swarm/ui/presentational/Divider'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Card, Heading, Icon, Loader } from 'rimble-ui'
import styled from 'styled-components/macro'

import PassportNewAddressModal from '../PassportNewAddressModal'

import AddressRow from './AddressRow'

const StyledHead = styled(Box)`
  width: 100%;
`

const Status = styled.div`
  display: inline-block;
  width: 12px;
  margin-right: 4px;
`

interface AccountProps {
  label?: string
  businessName?: string
  address: string
  cpkAddress?: {
    ethereum: string
    polygon: string
  }
}

interface MyAddressesStateProps {
  name: string
  accounts: AccountProps[]
  isStoreReady: boolean
}

const MyAddresses = ({
  name,
  accounts,
  isStoreReady,
}: MyAddressesStateProps) => {
  const { t } = useTranslation('passport')
  const activeAccount = useAccount()
  const ready = useReadyState()
  const isLoggedIn = useIsLoggedIn()
  const [newAddressModalOpen, setNewAddressModalOpen] = useState(false)
  const [editAddress, setEditAddress] = useState<string>('')

  const getAccountLinkedTo = (account: AccountProps): string => {
    if (account.businessName !== undefined) {
      return account.businessName
    }

    return name
  }

  const getAccountsToDisplay = (): AccountProps[] => {
    if (isLoggedIn) {
      return accounts
    }

    if (activeAccount === undefined) {
      return accounts
    }

    return [...accounts, { address: activeAccount }]
  }

  const handleCloseModal = () => {
    setNewAddressModalOpen(false)
    toggleWalletAutoDisconnect(true)
    if (editAddress) {
      setEditAddress('')
    }
  }

  if (!isStoreReady || !ready) {
    return <Loader m="30px auto" size={30} />
  }

  return (
    <>
      <Card
        p={['16px', '24px']}
        borderRadius={1}
        boxShadow={4}
        border="0"
        width="100%"
        flexDirection="column"
        mt={4}
      >
        {' '}
        <Heading
          as="h3"
          fontSize={3}
          lineHeight="28px"
          fontWeight={5}
          color="grey"
          m={0}
          id="my-addresses"
        >
          {t('myAddresses.header')}
        </Heading>
        <Box textAlign="left" p={[0, 0, 0, 2]} mt={2}>
          {!!activeAccount && (
            <StyledHead
              color="grey"
              fontSize={1}
              fontWeight={5}
              pb={2}
              display={['none', 'none', 'none', 'flex']}
            >
              <Box flexBasis="25%">{t('myAddresses.th.address')}</Box>
              <Box flexBasis="30%" flexGrow="1">
                {isLoggedIn && t('myAddresses.th.label')}
              </Box>
              <Box flexBasis="20%">
                {isLoggedIn && t('myAddresses.th.linkedTo')}
              </Box>
              <Box flexBasis="150px" />
            </StyledHead>
          )}
          <Divider my="0" />
          <Box>
            {!activeAccount ? (
              <Box
                borderBottomColor="light-gray"
                borderBottomWidth={['1px']}
                borderBottomStyle="solid"
                py={3}
              >
                <Status>
                  <Icon name="Lens" size="12" color="danger" />
                </Status>
                {t('myAddresses.noAddressConnected')}
              </Box>
            ) : (
              getAccountsToDisplay().map((accountInfo) => (
                <AddressRow
                  key={accountInfo.address}
                  address={accountInfo.address}
                  label={accountInfo.label || ''}
                  linkedTo={getAccountLinkedTo(accountInfo)}
                  isBussinessAddress={accountInfo.businessName !== undefined}
                />
              ))
            )}
          </Box>
        </Box>
      </Card>
      <PassportNewAddressModal
        isOpen={newAddressModalOpen || !!editAddress}
        onClose={handleCloseModal}
        address={editAddress}
      />
    </>
  )
}

const mapStateToProps = ({
  user: { accounts, givenName, familyName },
  initiated,
}: AppState) => ({
  name: `${givenName || ''} ${familyName || ''}`,
  accounts,
  isStoreReady: initiated,
})

export default connect(mapStateToProps)(MyAddresses)
