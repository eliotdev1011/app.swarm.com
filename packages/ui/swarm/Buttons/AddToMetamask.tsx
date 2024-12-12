import useObservable from '@swarm/core/hooks/rxjs/useObservable'
import { addToken, walletProvider$ } from '@swarm/core/web3'
import { ExtractProps } from '@swarm/types/props'
import { AbstractToken } from '@swarm/types/tokens'
import { MouseEvent, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, Text } from 'rimble-ui'
import styled from 'styled-components/macro'

import SvgIcon from '../SvgIcon'

import Chip from './Chip'

const StyledChip = styled(Chip)`
  display: inline-flex;
  overflow: visible;
  padding-right: 0;

  &:after {
    content: '';
    position: absolute;
    right: -11px;
    top: 0;
    border-top: 11px solid transparent;
    border-bottom: 11px solid transparent;
    border-left: 11px solid
      ${({ theme }) => theme.colors['primary-lighter-variant2']};
  }
`

interface AddToMetaMaskProps extends ExtractProps<typeof Chip> {
  token: AbstractToken
  logo?: string
}

const AddToMetaMask = ({ token, logo, ...props }: AddToMetaMaskProps) => {
  const { t } = useTranslation('common')

  const wallet = useObservable(walletProvider$)

  const handleAddTokenToWallet = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation()
      addToken(token, logo)
    },
    [logo, token],
  )

  if (!wallet?.provider.isMetaMask) {
    return null
  }

  return (
    <StyledChip onClick={handleAddTokenToWallet} {...props}>
      <Flex alignItems="center">
        <Text.span mr={1} fontSize="11px" fontWeight={600}>
          {t('token.addToMetamask', { token: token.symbol })}
        </Text.span>
        <SvgIcon name="MetaMask" height="18px" width="18px" />
      </Flex>
    </StyledChip>
  )
}

export default AddToMetaMask
