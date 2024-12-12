import useCombinedRefs from '@swarm/core/hooks/dom/useCombinedRefs'
import useInputValidity from '@swarm/core/hooks/dom/useInputValidity'
import { ExtractProps } from '@swarm/types/props'
import { forwardRef, useMemo, useRef } from 'react'
import { Flex, Text } from 'rimble-ui'
import styled from 'styled-components/macro'
import { border, boxShadow, height, MarginProps, padding } from 'styled-system'

const TextInputWrapper = styled(Flex)`
  border: 1px solid ${({ theme }) => theme.colors.grey};
  border-radius: ${({ theme }) => theme.borderWidths[3]};
  height: 36px;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizes[2]}px;
  ${({ disabled }) => !disabled && 'box-shadow: 0px 2px 4px rgb(0 0 0 / 10%);'}
  max-width: 100%;
  padding: 0 8px;

  ${boxShadow}
  ${height}
  ${padding}
  ${border}

  ${({ error, theme }) =>
    error &&
    `
    border-color: ${theme.colors.danger};

    &:focus {
      border-color: ${theme.colors.danger};
    }
  `}

  &:hover {
    ${({ disabled }) =>
      !disabled && 'box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.3);'}
  }

  &:focus-within {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  & > input {
    height: 36px;
    border: none;
    background: none;
    border-radius: ${({ theme }) => theme.borderWidths[3]};
    font-weight: ${({ theme }) => theme.fontWeights[3]};
    font-size: ${({ theme }) => theme.fontSizes[2]}px;
    flex-grow: 1;
    min-width: 0;
    -moz-appearance: textfield;
    outline: none;
    width: 100%;

    ${({ disabled, theme }) => disabled && `color: ${theme.colors.grey};`}

    ${height}
  }

  & > input::placeholder {
    color: ${({ theme }) => theme.colors.grey};
    font-weight: 400;
  }

  @media (max-width: ${({ theme }) => theme?.breakpoints[0]}) {
    height: 36px;
  }
`

const StyledInput = styled.input`
  border: none;
  flex-grow: 1;

  &:focus {
    outline: none;
  }
`

// eslint-disable-next-line @typescript-eslint/no-empty-interface

interface TextInputProps extends ExtractProps<typeof Flex>, MarginProps {
  value?: string
  onChange: (value: string) => void
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
  disabled?: boolean
  error?: string
  reportError?: boolean
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    { error, reportError, inputProps, value, onChange, ...props },
    forwardedRef,
  ) => {
    const innerRef = useRef(null)
    const ref = useCombinedRefs<HTMLInputElement>(innerRef, forwardedRef)

    const handleInputValidity = useInputValidity(
      ref,
      useMemo(() => {
        return reportError
          ? {
              error,
              value,
            }
          : {}
      }, [error, reportError, value]),
    )

    return (
      <Flex flexDirection="column">
        <TextInputWrapper {...props}>
          <StyledInput
            {...inputProps}
            onFocus={handleInputValidity}
            onChange={(event) => onChange?.(event.target.value)}
          />
        </TextInputWrapper>
        {error ? (
          <Text.p color="danger" fontSize={0} mb={0} mt={1}>
            {error}
          </Text.p>
        ) : null}
      </Flex>
    )
  },
)

TextInput.displayName = 'TextInput'

export default TextInput
