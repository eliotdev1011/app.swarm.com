import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  isChecked: boolean
  setIsChecked: (isChecked: boolean) => void
}

export const ShowNoLiquidityMarketsCheckbox: React.FC<Props> = (
  props: Props,
) => {
  const { isChecked, setIsChecked } = props

  const { t } = useTranslation(['lendBorrow'])

  return (
    <FormControlLabel
      control={
        <Checkbox
          color="primary"
          checked={isChecked}
          onChange={(event, checked) => {
            setIsChecked(checked)
          }}
        />
      }
      label={t('showNoLiquidityMarketsCheckbox.label')}
    />
  )
}
