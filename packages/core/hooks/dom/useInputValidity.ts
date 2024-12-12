import { FocusEventHandler, RefObject, useCallback, useEffect } from 'react'

interface InputProps {
  error?: string
  value?: string | number
  onFocus?: FocusEventHandler<HTMLInputElement>
}

const useInputValidity = (
  ref: RefObject<HTMLInputElement>,
  inputProps: InputProps,
) => {
  const { error, value, onFocus } = inputProps

  useEffect(() => {
    ref.current?.setCustomValidity(error ?? '')
  }, [error, ref])

  const handleOnFocus: FocusEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      if (error && ref.current?.validity.customError) {
        ref.current?.reportValidity()
      }
      onFocus?.(e)
    },
    [error, onFocus, ref],
  )

  useEffect(() => {
    if (
      error &&
      ref.current?.validity.customError &&
      ref.current === document.activeElement
    ) {
      ref.current?.reportValidity()
    }
  }, [error, ref, value])

  return handleOnFocus
}

export default useInputValidity
