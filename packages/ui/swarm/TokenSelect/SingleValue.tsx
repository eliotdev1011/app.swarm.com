import { isSameEthereumAddress, useAccount } from '@swarm/core/web3'
import { ExtractProps } from '@swarm/types/props'
import StatusBlock from '@ui/presentational/StatusBlock'
import { components } from 'react-select'
import { Text } from 'rimble-ui'

import TokenIcon from '../TokenIcon'

import StyledSelected from './StyledSelected'

const SingleValue = (props: ExtractProps<typeof components.SingleValue>) => {
  const account = useAccount()
  const { data } = props
  return (
    <components.SingleValue {...props}>
      {' '}
      <StyledSelected>
        <TokenIcon
          symbol={data.label}
          name={data.value}
          width="32px"
          height="32px"
        />
        <Text ml={[2, '10px']} mr="4px">
          {data.label}
        </Text>
        {isSameEthereumAddress(data.value, account) && (
          <StatusBlock iconSize="12px" iconColor="success" content="" />
        )}
      </StyledSelected>
    </components.SingleValue>
  )
}

export default SingleValue
