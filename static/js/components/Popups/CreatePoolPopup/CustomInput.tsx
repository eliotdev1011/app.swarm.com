import useCombinedRefs from '@swarm/core/hooks/dom/useCombinedRefs'
import useInputValidity from '@swarm/core/hooks/dom/useInputValidity'
import { ExtractProps } from '@swarm/types/props'
import { forwardRef, useMemo, useRef } from 'react'
import { Input } from 'rimble-ui'
import styled from 'styled-components/macro'

import { customInputStyles } from './styles'
import { CustomInputProps } from './types'

type CustomInputFullProps = CustomInputProps & ExtractProps<typeof Input>

const StyledInput = styled<CustomInputFullProps>(Input)`
  ${customInputStyles}
`

const CustomInput = forwardRef<HTMLInputElement, CustomInputFullProps>(
  (props: CustomInputFullProps, forwardedRef) => {
    const { error, value, onFocus } = props
    const innerRef = useRef(null)
    const ref = useCombinedRefs<HTMLInputElement>(innerRef, forwardedRef)

    const handleOnFocus = useInputValidity(
      ref,
      useMemo(
        () => ({
          error,
          value,
          onFocus,
        }),
        [error, onFocus, value],
      ),
    )

    return <StyledInput {...props} ref={ref} onFocus={handleOnFocus} />
  },
)

CustomInput.displayName = 'CustomInput'

export default CustomInput
