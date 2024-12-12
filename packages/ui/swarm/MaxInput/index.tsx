import useCombinedRefs from '@swarm/core/hooks/dom/useCombinedRefs'
import useInputValidity from '@swarm/core/hooks/dom/useInputValidity'
import { DEFAULT_DECIMALS } from '@swarm/core/shared/consts'
import { big } from '@swarm/core/shared/utils/helpers'
import {
  ChangeEvent,
  FocusEvent,
  FocusEventHandler,
  forwardRef,
  useCallback,
  useMemo,
  useRef,
} from 'react'
import { NumericFormat } from 'react-number-format'
import { Button, Flex, Text } from 'rimble-ui'
import styled from 'styled-components/macro'
import { border, boxShadow, height, padding } from 'styled-system'

import { MaxInputProps } from './types'

const StyledWrapper = styled(Flex)`
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
    text-align: right;
    font-weight: ${({ theme }) => theme.fontWeights[5]};
    font-size: ${({ theme }) => theme.fontSizes[2]}px;
    flex-grow: 1;
    min-width: 0;
    -moz-appearance: textfield;
    outline: none;
    width: 100%;

    ${({ disabled, theme }) => disabled && `color: ${theme.colors.grey};`}

    ${height}
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  & > button {
    height: 36px;
    font-weight: ${({ theme }) => theme.fontWeights[5]};
    padding: 0;
    font-size: ${({ theme }) => theme.fontSizes[2]}px;

    ${height}
  }

  @media (max-width: ${({ theme }) => theme?.breakpoints[0]}) {
    height: 36px;
  }
`

const CustomNumericFormat = forwardRef<HTMLInputElement, MaxInputProps>(
  (
    {
      onFocus,
      onBlur,
      onChange,
      reportError = true,
      error,
      value = 0,
      min,
      inputProps,
      disabled = false,
      decimalScale = DEFAULT_DECIMALS,
    },
    forwardedRef,
  ) => {
    const innerRef = useRef(null)
    const ref = useCombinedRefs<HTMLInputElement>(innerRef, forwardedRef)

    const parseValue = (formattedValue: string) => {
      formattedValue = formattedValue.replace(/[^\d.]/g, '')
      return big(formattedValue)
        .toString()
        .replace(/[^\d.]/g, '')
    }

    const handleInputValidity = useInputValidity(
      ref,
      useMemo(() => {
        return reportError
          ? {
              error,
              value: value?.toString(),
              onFocus,
            }
          : {}
      }, [error, onFocus, reportError, value]),
    )

    const handleOnBlur: FocusEventHandler<HTMLInputElement> = (e) => {
      const targetValue = e.target.value
      const parsedValue = parseValue(targetValue)
      const numericValue = Number(parsedValue)
      if (numericValue !== value) {
        onChange?.(numericValue, targetValue)
      } else {
        e.target.value = targetValue || '0'
      }
      onBlur?.(e)
    }

    const handleOnFocus = useCallback(
      (e: FocusEvent<HTMLInputElement, Element>) => {
        handleInputValidity(e)
        if (e.target.value === '0') {
          e.target.value = '' // Clear the input field if the value is 0 when focused
        }
        onFocus?.(e)
      },
      [handleInputValidity, onFocus],
    )

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = parseValue(e.target.value)
        onChange?.(Number(newValue), newValue)
      },
      [onChange],
    )

    return (
      <NumericFormat
        getInputRef={ref}
        thousandSeparator=","
        valueIsNumericString
        allowLeadingZeros
        allowNegative={false}
        onBlur={handleOnBlur}
        onFocus={handleOnFocus}
        onChange={handleChange}
        value={value.toString()}
        disabled={disabled}
        decimalScale={decimalScale}
        defaultValue={min}
        {...inputProps}
      />
    )
  },
)

const MaxInputView = forwardRef<HTMLInputElement, MaxInputProps>(
  (
    {
      onChange,
      endAdornment,
      onMaxClick,
      disabled = false,
      showMax = true,
      prefix = '',
      postfix = '',
      ...props
    },
    ref,
  ) => {
    return (
      <StyledWrapper {...props} disabled={disabled}>
        {showMax && (
          <Button.Text onClick={onMaxClick} disabled={disabled}>
            MAX
          </Button.Text>
        )}
        {prefix && (
          <Text.span flexShrink="0" fontSize="12px" color="grey">
            {prefix}
          </Text.span>
        )}
        <CustomNumericFormat
          ref={ref}
          disabled={disabled}
          onChange={onChange}
          {...props}
        />
        {postfix && (
          <Text.span
            marginLeft="4px"
            flexShrink="0"
            fontSize="12px"
            color="grey"
          >
            {postfix}
          </Text.span>
        )}
        {endAdornment}
      </StyledWrapper>
    )
  },
)

const MaxInput = forwardRef<HTMLInputElement, MaxInputProps>(
  (
    {
      max = Number.MAX_SAFE_INTEGER,
      View = MaxInputView,
      onChange,
      onBlur,
      ...props
    },
    ref,
  ) => {
    const onMaxClick = () => {
      if (typeof max !== undefined) {
        onChange?.(big(max)?.toNumber(), big(max).toFixed())
      }
    }

    return (
      <View
        {...props}
        max={max}
        onChange={onChange}
        onBlur={onBlur}
        onMaxClick={onMaxClick}
        ref={ref}
      />
    )
  },
)

CustomNumericFormat.displayName = 'CustomNumericFormat'
MaxInputView.displayName = 'MaxInputView'
MaxInput.displayName = 'MaxInput'

export { CustomNumericFormat }
export default MaxInput

export * from './types'
