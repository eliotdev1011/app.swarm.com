import { ContentCopy } from '@rimble/icons'
import api from '@swarm/core/services/api'
import { truncateStringInTheMiddle } from '@swarm/core/shared/utils'
import { connect } from '@swarm/core/state/AppContext'
import { errorOccurred } from '@swarm/core/state/actions/app'
import { profileUpdated } from '@swarm/core/state/actions/users'
import { useIsLoggedIn } from '@swarm/core/state/hooks'
import {
  isSameEthereumAddress,
  unifyAddress,
  useAccount,
} from '@swarm/core/web3'
import { ProfileResponse } from '@swarm/types/api-responses'
import { AppState, DispatchWithThunk } from '@swarm/types/state'
import InlineInput from '@swarm/ui/presentational/InlineInput'
import { RouterLink } from '@swarm/ui/presentational/RouterLink'
import ExplorerLink from '@swarm/ui/swarm/Link/ExplorerLink'
import { useSnackbar } from '@swarm/ui/swarm/Snackbar'
import { AlertVariant } from '@swarm/ui/swarm/Snackbar/types'
import { Color } from '@swarm/ui/theme'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Button, Flex, Icon, Text } from 'rimble-ui'
import styled from 'styled-components/macro'

import ConfirmUnlinkModal from './ConfirmUnlinkModal'

const Underlined = styled(Text.span)`
  text-decoration: underline;
`

const Row = styled(Flex)`
  flex-wrap: wrap;
`

const Cell = styled(Flex)`
  align-items: center;
  flex-wrap: wrap;
  flex-shrink: 1;
  overflow: ${(props) => props.overflow || 'hidden'};
  text-overflow: ellipsis;
`

const Address = styled(Flex)`
  overflow: hidden;
  word-break: break-all;
  align-items: center;
`

interface AddressRowProps {
  address: string
  label: string
  linkedTo: string
  isBussinessAddress: boolean
}

interface AddressRowActions extends Record<string, unknown> {
  updateProfile: (profile: ProfileResponse) => void
  reportError: (e: string) => void
}

const AddressRow = ({
  address,
  label,
  linkedTo,
  updateProfile,
  reportError,
  isBussinessAddress,
}: AddressRowProps & AddressRowActions) => {
  const { t } = useTranslation('passport')
  const { addAlert, addError } = useSnackbar()
  const isLoggedIn = useIsLoggedIn()
  const account = useAccount()
  const [isEditing, setEditing] = useState<boolean>(false)
  const [confirmUnlinkModalIsOpen, setConfirmUnlinkModalIsOpen] =
    useState(false)

  const handleCopyClick = async () => {
    await navigator.clipboard.writeText(unifyAddress(address))
    addAlert(
      t('general.copiedToClipboard', {
        address: truncateStringInTheMiddle(address),
      }),
      {
        variant: AlertVariant.success,
      },
    )
  }

  const handleUnlinkClick = async () => {
    setConfirmUnlinkModalIsOpen(true)
  }

  const handleModalOnCancel = () => {
    setConfirmUnlinkModalIsOpen(false)
  }

  const handleModalOnConfirm = async () => {
    setConfirmUnlinkModalIsOpen(false)
    try {
      await api.deleteAddress(address)
    } catch (e) {
      addError(e, {
        description: t('myAddresses.unlinkAddressError', {
          address: truncateStringInTheMiddle(address),
        }),
      })

      reportError((e as Error)?.message)
      return
    }

    const profile = await api.profile()

    updateProfile(profile)

    addAlert(
      t('myAddresses.unlinkAddress', {
        address: truncateStringInTheMiddle(address),
      }),
      {
        variant: AlertVariant.success,
      },
    )
  }

  const handleLabelUpdate = async (addressName: string) => {
    setEditing(false)
    try {
      await api.updateAddressLabel(address, addressName)
    } catch (e) {
      addError(e, {
        description: t('myAddresses.addNameError', {
          variant: AlertVariant.error,
        }),
      })
    }
    const profile = await api.profile()
    updateProfile(profile)
  }

  return (
    <>
      <Row
        borderBottomColor="light-gray"
        borderBottomWidth={['1px']}
        borderBottomStyle="solid"
        py={2}
      >
        <Cell
          flexBasis={['100%', '100%', '100%', '25%']}
          maxWidth={['100%', '100%', '100%', '25%']}
          pr={2}
        >
          <Box
            display={['block', 'block', 'block', 'none']}
            fontWeight={4}
            color="grey"
            fontSize={1}
            mb={1}
            flexBasis="100%"
          >
            {t('myAddresses.th.address')}
          </Box>
          <Address>
            <RouterLink
              pathname="/wallets"
              state={{ preselectedAddress: address }}
            >
              <Underlined>{truncateStringInTheMiddle(address)}</Underlined>
            </RouterLink>
            <Button.Text
              iconOnly
              size="small"
              p={0}
              m={0}
              onClick={handleCopyClick}
              mainColor={Color.grey}
              title={t('myAddresses.copy')}
            >
              <ContentCopy size={18} />
            </Button.Text>
            <ExplorerLink
              type="address"
              hash={address}
              iconSize="18px"
              color="grey"
              iconOnly
              inline
            />
          </Address>
        </Cell>
        <Cell flexBasis={['100%', '100%', '100%', '30%']} flexGrow="1">
          {isLoggedIn && (
            <>
              <Box
                display={['block', 'block', 'block', 'none']}
                fontWeight={4}
                color="grey"
                fontSize={1}
                mt={3}
                mb={1}
                flexBasis="100%"
              >
                {t('myAddresses.th.label')}
              </Box>
              <Flex
                justifyContent="space-between"
                alignItems="center"
                position={isEditing && 'absolute'}
                maxWidth="200px"
                flex={1}
              >
                {!isEditing && (
                  <Text.span fontWeight={2} fontSize={2} color="near-black">
                    {label}
                  </Text.span>
                )}
                <InlineInput
                  onConfirm={handleLabelUpdate}
                  onCancel={() => setEditing(false)}
                  onClick={() => setEditing(true)}
                  initialValue={label}
                />
              </Flex>
            </>
          )}
        </Cell>
        <Cell flexBasis={['100%', '100%', '100%', '20%']}>
          <Box
            display={['block', 'block', 'block', 'none']}
            fontWeight={4}
            color="grey"
            fontSize={1}
            mt={3}
            mb={1}
            flexBasis="100%"
          >
            {t('myAddresses.th.linkedTo')}
          </Box>
          <Text.span fontWeight={2} fontSize={2} color="near-black">
            {linkedTo}
          </Text.span>
        </Cell>
        <Cell
          flexBasis={['auto', '150px']}
          flexGrow={[1, 0]}
          justifyContent={[
            'flex-start',
            'flex-start',
            'flex-start',
            'flex-end',
          ]}
        >
          {isBussinessAddress === false &&
          isSameEthereumAddress(account, address) === false ? (
            <Button.Text
              mainColor="danger"
              fontSize={2}
              height="40px"
              onClick={handleUnlinkClick}
            >
              <Icon
                name="RemoveCircleOutline"
                color="danger"
                mr="6px"
                size="16px"
              />{' '}
              {t('myAddresses.unlink')}
            </Button.Text>
          ) : null}
        </Cell>
      </Row>

      <ConfirmUnlinkModal
        isOpen={confirmUnlinkModalIsOpen}
        address={address}
        onCancel={handleModalOnCancel}
        onConfirm={handleModalOnConfirm}
      />
    </>
  )
}

const mapDispatchToProps = (dispatch: DispatchWithThunk<AppState>) => ({
  updateProfile: (profile: ProfileResponse) =>
    dispatch(profileUpdated(profile)),
  reportError: (e: string) => dispatch(errorOccurred(e)),
})

export default connect<
  AddressRowProps,
  Record<string, never>,
  AddressRowActions
>(
  null,
  mapDispatchToProps,
)(AddressRow)
