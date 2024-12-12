import useCombinedRefs from '@swarm/core/hooks/dom/useCombinedRefs'
import useInputValidity from '@swarm/core/hooks/dom/useInputValidity'
import MaxInput, { MaxInputProps } from '@swarm/ui/swarm/MaxInput'
import { forwardRef, useCallback, useMemo, useRef } from 'react'
import styled from 'styled-components/macro'

import { customInputStyles } from './styles'
import { CustomInputProps } from './types'

type CustomMaxInputProps = CustomInputProps & MaxInputProps

const StyledInput = styled(MaxInput)`
  ${customInputStyles}
`

const CustomMaxInput = forwardRef<HTMLInputElement, CustomMaxInputProps>(
  ({ onChange, ...props }: CustomMaxInputProps, forwardedRef) => {
    const { error, value, inputProps } = props
    const { onFocus } = inputProps || {}
    const innerRef = useRef(null)
    const ref = useCombinedRefs<HTMLInputElement>(innerRef, forwardedRef)

    const handleOnFocus = useInputValidity(
      ref,
      useMemo(
        () => ({
          error,
          value: value?.toString(),
          onFocus,
        }),
        [error, onFocus, value],
      ),
    )

    const handleOnChange = useCallback(
      (newValue: number) => {
        if (!onChange) return

        const formattedValue =
          !Number(value) && String(value).length === 1 && newValue !== 0
            ? String(newValue).replace(/0/g, '')
            : String(newValue)

        onChange(Number(formattedValue), formattedValue)
      },
      [value, onChange],
    )

    return (
      <StyledInput
        {...props}
        ref={ref}
        value={value}
        onChange={handleOnChange}
        inputProps={useMemo(
          () => ({ ...inputProps, onFocus: handleOnFocus }),
          [handleOnFocus, inputProps],
        )}
      />
    )
  },
)

CustomMaxInput.displayName = 'CustomMaxInput'

export default CustomMaxInput
