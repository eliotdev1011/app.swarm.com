import { DECIMALS_PRECISION } from '@swarm/core/shared/consts'
import MaxInput, { MaxInputProps } from '@swarm/ui/swarm/MaxInput'
import { Flex, Text } from 'rimble-ui'
import styled from 'styled-components/macro'

const InvestSecurityInputWrapper = styled(Flex)`
  flex-direction: column;
  max-width: 224px;
  border: 1px solid ${({ theme }) => theme.colors['light-gray']};
  border-radius: 4px;
  overflow: hidden;

  &:hover {
    box-shadow: 0px 1px 3px rgb(0 0 0 / 30%);
  }

  &:focus-within {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  ${({ error, theme }) =>
    error &&
    `
  border-color: ${theme.colors.danger};

  &:focus, &:focus-within {
    border-color: ${theme.colors.danger};
  } 
`}
`

const InvestSecurityInput = ({
  value,
  onChange,
  error,
  ...props
}: MaxInputProps) => {
  return (
    <Flex flexDirection="column">
      <InvestSecurityInputWrapper>
        <MaxInput
          {...props}
          min={0}
          endAdornment="USD"
          onChange={onChange}
          value={value}
          height="48px"
          px="16px"
          decimalScale={DECIMALS_PRECISION.DOLLARS.INPUT}
          showMax={false}
        />
      </InvestSecurityInputWrapper>
      <Text.p color="danger" fontSize={0} mb={0} mt={1}>
        {error}
      </Text.p>
    </Flex>
  )
}

export default InvestSecurityInput
