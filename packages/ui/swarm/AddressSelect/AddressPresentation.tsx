import { isSameEthereumAddress, useAccount } from '@swarm/core/web3'
import { truncateStringInTheMiddle } from '@swarm/core/shared/utils'
import Blockie from '@ui/presentational/Blockie'
import { Flex, Text } from 'rimble-ui'

import StatusBlock from '../../presentational/StatusBlock'

interface AddressPresentationProps {
  value: string
  label?: string
  disabled?: boolean
}

const AddressPresentation = ({
  value,
  label,
  disabled,
}: AddressPresentationProps) => {
  const account = useAccount()

  return (
    <>
      <Flex>
        <Blockie address={value} />
        {label ? (
          <>
            <Text ml={[2, '10px']} mr="4px" color={disabled ? 'grey' : 'text'}>
              {label}
            </Text>
            {value && (
              <Text ml={[2, '10px']} mr="4px" color="grey" flexGrow={1}>
                ({truncateStringInTheMiddle(value ?? '').replace('x', '×')})
              </Text>
            )}
          </>
        ) : (
          <Text
            ml={[2, '10px']}
            mr="4px"
            overflow="hidden"
            style={{
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            flexGrow={1}
          >
            {(value ?? account ?? '').replace('x', '×')}
          </Text>
        )}
      </Flex>
      {isSameEthereumAddress(value, account) && (
        <StatusBlock iconSize="12px" iconColor="success" content="" />
      )}
    </>
  )
}

export default AddressPresentation
