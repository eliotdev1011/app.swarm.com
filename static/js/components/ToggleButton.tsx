import { ToggleButtonOption } from '@swarm/types/toggle-button-option'
import { useCallback, useRef } from 'react'
import { Button } from 'rimble-ui'
import styled from 'styled-components/macro'

import CustomInput from 'src/components/Popups/CreatePoolPopup/CustomInput'

interface InputWrapperProps {
  selected: boolean
  error?: string
}

const CustomButtonWrapper = styled.div<InputWrapperProps>`
  position: relative;
  display: inline-block;
  width: fit-content;

  & > input {
    ::placeholder {
      color: ${({ theme, selected }) =>
        selected ? theme.colors.white : theme.colors.primary};
    }

    color: ${({ theme, selected }) =>
      selected ? theme.colors.white : theme.colors.primary};
    background-color: ${({ theme, selected, error }) =>
      selected
        ? (error && theme.colors.danger) || theme.colors.primary
        : theme.colors.white};
    border-color: ${({ theme, selected, error }) =>
      selected
        ? (error && theme.colors.danger) || theme.colors.primary
        : theme.colors.grey};

    &:focus {
      border-color: ${({ theme, selected, error }) =>
        selected
          ? (error && theme.colors.danger) || theme.colors.primary
          : theme.colors.grey};
    }

    text-align: right;
  }

  &::after {
    content: '%';
    position: absolute;
    right: 10px;
    top: 24px;
    font-weight: ${({ theme }) => theme.fontWeights?.[5]};
    color: ${({ theme, selected }) =>
      selected ? theme.colors.white : theme.colors.primary};
  }
`

const ToggleButton = ({
  selected,
  option,
  onSelect,
  error,
}: {
  selected: boolean
  option: ToggleButtonOption
  onSelect: (option: number) => void
  error?: string | undefined
}) => {
  const customInputRef = useRef<HTMLInputElement>(null)

  const select = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (option.custom && e.target.value === '') {
        return
      }

      const newValue = option.custom ? Number(e.target.value) : option.value

      if (newValue !== null) {
        onSelect(newValue)
      }
    },
    [onSelect, option],
  )

  const handleCustomOnFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      if (e.target.value === '') {
        e.target.setAttribute('placeholder', '')
      }
    },
    [],
  )

  const handleCustomOnBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      if (e.target.value === '') {
        e.target.setAttribute(
          'placeholder',
          option.value === null ? 'Custom' : String(option.value),
        )
      }
    },
    [option.value],
  )

  if (option.custom) {
    return (
      <CustomButtonWrapper selected={selected} error={error}>
        <CustomInput
          ref={customInputRef}
          type="number"
          min="0"
          step=".01"
          onClick={select}
          onChange={select}
          height="36px"
          p="10px 24px 10px 8px"
          mt={3}
          width="97px"
          fontWeight={5}
          border="2px solid"
          boxShadow="none"
          placeholder={option.value === null ? 'Custom' : option.value}
          error={error}
          onFocus={handleCustomOnFocus}
          onBlur={handleCustomOnBlur}
        />
      </CustomButtonWrapper>
    )
  }

  const ButtonVariant = selected ? Button : Button.Outline

  return (
    <ButtonVariant
      mr={2}
      mt={3}
      height="36px"
      px="10px"
      border="2px solid"
      borderColor={selected ? 'primary' : 'grey'}
      fontWeight={5}
      role="button"
      tabIndex={-1}
      onClick={select}
      onKeyDown={select}
    >
      {option.label}
    </ButtonVariant>
  )
}

export default ToggleButton
