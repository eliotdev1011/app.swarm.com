import { Done } from '@rimble/icons'
import {
  BridgeName,
  evmNetworkConstantMap,
  networksBridges,
} from '@swarm/core/shared/consts'
import { SupportedNetworkId } from '@swarm/core/shared/enums'
import { isNetworkSupported } from '@swarm/core/web3'
import { ReactNode } from 'react'
import { Props as ReactSelectProps } from 'react-select/src/Select'
import { Text } from 'rimble-ui'
import styled from 'styled-components/macro'

import Divider from '@ui/presentational/Divider'

import SvgIcon from '../SvgIcon'

export interface INetworkOption {
  value: SupportedNetworkId | BridgeName
  label: string
  icon?: ReactNode
  disabled?: boolean
  divider?: boolean
}

const networksIcons = {
  [SupportedNetworkId.Ethereum]: 'Ethereum-Logo.wine',
  [SupportedNetworkId.Base]: 'Base',
  [SupportedNetworkId.Polygon]: 'Polygon',
  [SupportedNetworkId.ArbitrumSepolia]: 'Arbitrum',
}
export const getNetworkOptions = (): INetworkOption[] => {
  return [
    ...evmNetworkConstantMap
      .map((network) => ({
        icon: networksIcons[network.networkId],
        value: network.networkId,
        label: network.networkName,
      }))
      .filter(({ value }) => isNetworkSupported(value)),
    {
      icon: 'ExternalLink',
      value: networksBridges.polygon.name,
      label: networksBridges.polygon.name,
      divider: true,
    },
    ...(isNetworkSupported(SupportedNetworkId.Base)
      ? [
          {
            icon: 'ExternalLink',
            value: networksBridges.base.name,
            label: networksBridges.base.name,
          },
        ]
      : []),
  ]
}

const StyledOption = styled.div<{ disabled: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 200px;
  height: 36px;
  padding: 2px 12px;
  transition: all ease 0.3s;
  border-radius: 4px;

  &:hover {
    cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
    background: ${({ theme }) => theme.colors['off-white']};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints?.[1]}) {
    width: 130px;

    .option-value {
      margin-right: 10px !important;
    }
  }

  svg {
    width: 20px;
    height: 20px;
  }
`

export const Option = ({
  data,
  innerRef,
  innerProps,
  isSelected,
}: ReactSelectProps) => {
  return (
    <>
      {data.divider && <Divider my={2} />}
      <StyledOption ref={innerRef} {...innerProps} disabled={data.isDisabled}>
        <SvgIcon name={data.icon} />
        <Text
          className="option-value"
          ml={[2, '10px']}
          mr="auto"
          color={data.isDisabled ? 'grey' : 'text'}
        >
          {data.label}
        </Text>
        {isSelected && <Done color="primary" />}
      </StyledOption>
    </>
  )
}
