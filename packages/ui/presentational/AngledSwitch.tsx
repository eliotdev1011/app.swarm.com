import {
  createStyles,
  Switch,
  SwitchClassKey,
  SwitchProps,
  withStyles,
} from '@material-ui/core'
import { Done } from '@rimble/icons'

import { Color } from '@ui/theme'

interface Styles extends Partial<Record<SwitchClassKey, string>> {
  focusVisible?: string
}

interface Props extends SwitchProps {
  classes: Styles
}

const thumbStyles = {
  borderRadius: 2,
  margin: 3,
  height: 16,
  width: 16,
}

const AngledSwitch = withStyles(() =>
  createStyles({
    root: {
      border: `1px solid ${Color.grey}`,
      borderRadius: 4,
      height: 24,
      width: 44,
      padding: 0,
    },
    switchBase: {
      padding: 0,
      '&$checked': {
        '& + $track': {
          backgroundColor: 'transparent',
        },
      },
    },
    thumb: {
      ...thumbStyles,
      backgroundColor: Color.grey,
    },
    track: {
      borderRadius: 2,
      backgroundColor: 'transparent',
    },
    checked: {
      ...thumbStyles,
      backgroundColor: `#0078EF !important`,
    },
    disabled: {
      ...thumbStyles,
      backgroundColor: `${Color.grey} !important`,
    },
    focusVisible: {},
  }),
)(({ classes, ...props }: Props) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      checkedIcon={<Done size={14} color="white" />}
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
        disabled: classes.disabled,
      }}
      {...props}
    />
  )
})

export default AngledSwitch
