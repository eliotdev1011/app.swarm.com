import api from '@swarm/core/services/api'
import { truncateStringInTheMiddle } from '@swarm/core/shared/utils'
import { propEquals } from '@swarm/core/shared/utils/collection/filters'
import { connect } from '@swarm/core/state/AppContext'
import { profileUpdated } from '@swarm/core/state/actions/users'
import { getSigner, useAccount, useConnectWallet } from '@swarm/core/web3'
import { ProfileResponse } from '@swarm/types/api-responses'
import { ExtractProps } from '@swarm/types/props'
import { AppState, DispatchWithThunk } from '@swarm/types/state'
import UserStateAccount from '@swarm/types/state/user-account'
import Blockie from '@swarm/ui/presentational/Blockie'
import Dialog from '@swarm/ui/presentational/Dialog'
import { useSnackbar } from '@swarm/ui/swarm/Snackbar'
import { AlertVariant } from '@swarm/ui/swarm/Snackbar/types'
import { ChangeEvent, HTMLAttributes, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Button, Flex, Text } from 'rimble-ui'
import styled from 'styled-components/macro'
import { MarginProps } from 'styled-system'

import { PassportAddressItem } from './PassportAddressItem'

interface PassportNewAddressModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete?: (address: string, label: string) => void
  address?: string
  kybUserHash?: string
}

interface PassportNewAddressModalStateProps extends Record<string, unknown> {
  accounts: UserStateAccount[]
}

interface PassportNewAddressModalActions extends Record<string, unknown> {
  updateProfile: (profile: ProfileResponse) => void
}

interface InputProps extends ExtractProps<typeof Flex>, MarginProps {
  value?: string
  onChange?: (value: string) => void
  inputProps?: HTMLAttributes<HTMLInputElement>
  disabled?: boolean
  placeholder?: string
  address: string
}

const StyledWrapper = styled(Flex)`
  border: 1px solid ${({ theme }) => theme.colors.grey};
  border-radius: ${({ theme }) => theme.borderWidths[3]};
  height: 50px;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizes[2]}px;
  box-shadow: 0 2px 4px rgb(0 0 0 / 10%);
  max-width: 100%;
  padding: 0 13px;

  img {
    width: 25px;
    height: 25px;
    margin-right: 10px;
  }

  ${({ disabled, theme }) =>
    disabled
      ? `background: ${theme.colors['light-gray']};`
      : `
    &:hover {
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    }
  `}

  &:focus-within {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  & > input {
    height: ${({ height }) => height || '36px'};
    border: none;
    background: none;
    border-radius: ${({ theme }) => theme.borderWidths[3]};
    font-size: 18px;
    flex-grow: 1;
    min-width: 0;
    -moz-appearance: textfield;
    outline: none;
    width: 100%;
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  @media (max-width: ${({ theme }) => theme?.breakpoints[0]}) {
    height: 36px;
  }
`

const ChangeWalletButton = styled(Button)`
  padding: 0 8px;
  height: 28px;
  border: 1px solid ${({ theme }) => theme.colors.grey};
  background-color: ${({ theme }) => theme.colors['off-white2']};
  font-weight: 600;
`

const AddressLabelInput = ({
  onChange,
  value = '',
  disabled = false,
  placeholder,
  address,
  ...props
}: InputProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value: newValue } = e.target
    if (onChange) {
      onChange(newValue)
    }
  }

  return (
    <StyledWrapper disabled={disabled} {...props}>
      <Blockie address={address} />
      <input
        type="text"
        onChange={handleChange}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
      />
    </StyledWrapper>
  )
}

const PassportNewAddressModal = ({
  accounts,
  isOpen,
  onClose,
  onComplete,
  updateProfile,
  address,
  kybUserHash,
}: PassportNewAddressModalProps &
  PassportNewAddressModalStateProps &
  PassportNewAddressModalActions) => {
  const { t } = useTranslation('passport')
  const account = useAccount()
  const registered =
    accounts.length && accounts.find(propEquals('address', account))
  const { addAlert, addError } = useSnackbar()
  const [loading, setLoading] = useState(false)
  const [label, setLabel] = useState('')
  const connectWallet = useConnectWallet()

  const resetForm = useCallback(() => {
    setLabel('')
  }, [])

  const handleAddClick = useCallback(async () => {
    if (!account) {
      resetForm()
      return
    }
    if (registered) {
      addAlert(t('myAddresses.addressLinked'), {
        variant: AlertVariant.error,
      })
      resetForm()
      return
    }

    const signer = getSigner()

    if (!signer) {
      resetForm()
      return
    }

    setLoading(true)

    const exists = await api.checkExistence(account)

    if (exists) {
      addAlert(t('myAddresses.addressRegistered'), {
        variant: AlertVariant.warning,
      })
      setLoading(false)
      resetForm()
      return
    }

    const {
      attributes: { message },
    } = await api.nonceMessage(account)

    try {
      const signedMessage = await signer.signMessage(message)

      if (signedMessage) {
        await api.addAddress(account, signedMessage, kybUserHash)
        await api.updateAddressLabel(account, label)
      }
    } catch (e) {
      addError(e, { description: t('myAddresses.addError') })
      setLoading(false)
      onClose()
      resetForm()
      return
    }
    addAlert(
      t('myAddresses.addSuccess', {
        address: truncateStringInTheMiddle(account),
      }),
      {
        variant: AlertVariant.success,
      },
    )
    const profile = await api.profile()
    updateProfile(profile)
    setLoading(false)
    await onComplete?.(account, label)
    onClose()
    resetForm()
  }, [
    account,
    addAlert,
    addError,
    label,
    onClose,
    registered,
    resetForm,
    t,
    updateProfile,
    onComplete,
    kybUserHash,
  ])

  return (
    <Dialog
      isOpen={isOpen}
      width={['100%', '540px']}
      height="auto"
      maxHeight="80%"
      onClose={onClose}
      title={t(
        address ? 'myAddresses.modal.editAddress' : 'myAddresses.modal.header',
      )}
      titleProps={{ mb: '2', p: '3' }}
      p={2}
      pb={0}
    >
      {!address && registered ? (
        <Box>
          <Text.p fontSize="17px" color="grey" mb={3}>
            {t('myAddresses.modal.instruction')}
          </Text.p>
          <Box mt={4}>
            <Text.p color="grey" fontWeight={5}>
              {t('myAddresses.modal.selectNewAddress')} or{' '}
              <ChangeWalletButton
                mainColor="off-white"
                contrastColor="grey"
                size="small"
                onClick={() => {
                  connectWallet()
                }}
                ml={1}
              >
                {t('myAddresses.modal.changeWallet')}
              </ChangeWalletButton>
            </Text.p>
            <PassportAddressItem>
              <Blockie address={account} />
              <Text.p fontSize="18px" my={0}>
                {t('myAddresses.modal.connectNewAddress')}
              </Text.p>
            </PassportAddressItem>
          </Box>
        </Box>
      ) : (
        <Box>
          <Text.p fontSize="17px" color="grey">
            {t('myAddresses.modal.instruction')}
          </Text.p>
          <Box mt={4}>
            <Text.p color="grey" fontWeight={5}>
              {t('myAddresses.modal.yourNewAddress')}:
            </Text.p>
            <PassportAddressItem>
              <Blockie address={account} />
              <Text.p fontSize="18px" my={0}>
                (
                {truncateStringInTheMiddle(
                  account || address || t('myAddresses.noAddressConnected'),
                )}
                )
              </Text.p>
            </PassportAddressItem>
          </Box>
          <Box>
            <Text.p color="grey" fontWeight={5}>
              {t('myAddresses.modal.giveAddressName')}
            </Text.p>
            <AddressLabelInput
              value={label}
              onChange={setLabel}
              placeholder={
                account || address
                  ? t('myAddresses.modal.labelInputPlaceholder')
                  : t('myAddresses.modal.addressInputPlaceholder')
              }
              address={account || ''}
              disabled={!account}
            />
          </Box>
          <Text.p fontSize="20px" fontWeight={5} color="near-black">
            {t('myAddresses.modal.confirmInstruction')}
          </Text.p>
          <Flex mt={4}>
            <Button
              color="primary"
              onClick={handleAddClick}
              disabled={loading || !account}
              fontWeight={4}
              mr={3}
            >
              {t('myAddresses.modal.confirm')}
            </Button>
            <Button.Outline
              color="primary"
              onClick={onClose}
              disabled={loading}
              fontWeight={4}
              border="1.5px solid"
              borderColor="primary"
            >
              {t('myAddresses.modal.cancel')}
            </Button.Outline>
          </Flex>
        </Box>
      )}
    </Dialog>
  )
}

const mapStateToProps = ({ user: { accounts } }: AppState) => ({
  accounts,
})

const mapDispatchToProps = (dispatch: DispatchWithThunk<AppState>) => ({
  updateProfile: (profile: ProfileResponse) =>
    dispatch(profileUpdated(profile)),
})

export default connect<
  PassportNewAddressModalProps,
  PassportNewAddressModalStateProps,
  Record<string, unknown>
>(
  mapStateToProps,
  mapDispatchToProps,
)(PassportNewAddressModal)
