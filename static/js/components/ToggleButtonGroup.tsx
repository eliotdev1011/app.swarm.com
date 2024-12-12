import { ToggleButtonOption } from '@swarm/types/toggle-button-option'
import { useCallback, useState } from 'react'

import ToggleButton from './ToggleButton'

const ToggleButtonGroup = ({
  options,
  onSelect,
  validator,
  selectedValue,
  error,
}: {
  options: ToggleButtonOption[]
  onSelect: (value: number) => void
  validator?: (value: number) => boolean
  selectedValue: number
  error?: string | undefined
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(() => {
    const index = options.findIndex(({ value }) => value === selectedValue)
    return index === -1 ? 3 : index
  })

  const bindSelectListener = useCallback(
    (index: number) => (value: number | null) => {
      setActiveIndex(index)
      if (value !== null) {
        if (validator && !validator(value)) {
          return
        }
        onSelect(value)
      }
    },
    [onSelect, validator],
  )

  return (
    <>
      {options.map((option, index: number) => (
        <ToggleButton
          error={error}
          key={`toggleButton-${option.value}`}
          selected={activeIndex === index}
          onSelect={bindSelectListener(index)}
          option={
            index === 3 && activeIndex === 3
              ? {
                  ...option,
                  value: selectedValue,
                }
              : option
          }
        />
      ))}
    </>
  )
}

export default ToggleButtonGroup
