import Select from '@swarm/ui/presentational/Select'
import { Props as ReactSelectProps } from 'react-select'
import { Flex, Text } from 'rimble-ui'
import styled from 'styled-components/macro'

const SelectWrapper = styled.div`
  display: flex;
  max-width: 194px;
  width: 100%;
  height: 48px;

  & .Dropdown__control {
    border-color: ${({ theme }) => theme.colors.grey};
  }
`

const InvestSecurityDropdown = ({ error, ...props }: ReactSelectProps) => {
  return (
    <Flex flexDirection="column" maxWidth="194px" width="100%">
      <SelectWrapper>
        <Select
          {...props}
          border="none"
          bg="none"
          style={{ boxShadow: 'none', cursor: 'pointer' }}
          required
        />
      </SelectWrapper>
      {error ? (
        <Text.p color="danger" fontSize={0} mb={0} mt={1}>
          {error}
        </Text.p>
      ) : null}
    </Flex>
  )
}

export default InvestSecurityDropdown
