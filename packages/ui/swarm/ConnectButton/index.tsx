import useObservable from '@swarm/core/hooks/rxjs/useObservable'
import accountAddressName$ from '@swarm/core/observables/accountAddressName'
import { truncateStringInTheMiddle } from '@swarm/core/shared/utils'
import { useReadyState } from '@swarm/core/web3'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Icon, Loader } from 'rimble-ui'
import styled from 'styled-components/macro'

import DropDownButton, { Option } from '@ui/presentational/DropDownButton'

import useConnection from './useConnection'

const StyledButton = styled(Button)`
  ${({ active }) =>
    active &&
    `
  box-shadow: none !important;
  background: #000;
`}
  ${({ connected, theme }) =>
    connected &&
    `
  &:after {
    content: '';
    display: block;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background-color: ${theme.colors.success};
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: ${theme.zIndices.layerOne};
  }
  `}
`

const ConnectButton = () => {
  const { t } = useTranslation('common')
  const ready = useReadyState()
  const { connect, disconnect, account, isConnected } = useConnection()
  const accountAddressName = useObservable<string | null>(
    accountAddressName$,
    null,
  )

  const buttonLabel = useMemo(() => {
    if (!ready) {
      return <Loader color="white" />
    }

    if (accountAddressName !== null) {
      return accountAddressName
    }

    if (account) {
      return truncateStringInTheMiddle(account)
    }

    return t('connect')
  }, [account, accountAddressName, ready, t])

  const handleButtonClick = useCallback(
    (toggle: () => void) =>
      isConnected
        ? toggle
        : () => {
            connect()
          },
    [connect, isConnected],
  )

  return (
    <DropDownButton
      mr="24px"
      renderButton={(active, toggle) => (
        <StyledButton
          connected={isConnected}
          onClick={handleButtonClick(toggle)}
          size="medium"
          px={3}
          fontWeight={4}
          active={active}
          minWidth="146px"
          mainColor={isConnected ? 'white' : 'primary'}
          contrastColor={isConnected ? 'primary' : 'white'}
        >
          {buttonLabel}
        </StyledButton>
      )}
    >
      <Option onClick={disconnect} contrastColor="danger">
        <Icon name="RemoveCircleOutline" size="16" mr={1} />
        {t('disconnect')}
      </Option>
    </DropDownButton>
  )
}

export default ConnectButton
