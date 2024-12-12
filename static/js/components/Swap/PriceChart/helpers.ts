import { Color } from '@swarm/ui/theme'
import match from 'conditional-expression'

export const getColors = (change: number) =>
  match(change)
    .lessThan(0)
    .then({ stroke: Color.dangerDark, fill: Color.danger, status: 'danger' })
    .isGreaterThan(0)
    .then({
      stroke: Color.success,
      fill: Color.successLight2,
      status: 'success',
    })
    .else({ stroke: Color.warningDark, fill: Color.warning, status: 'warning' })
