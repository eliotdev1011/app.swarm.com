import { createStyles, Tab, TabProps, withStyles } from '@material-ui/core'
import { formatBigInt } from '@swarm/core/shared/utils/formatting'
import React from 'react'
import { Box } from 'rimble-ui'
import styled from 'styled-components/macro'

import customTheme from '@ui/theme'

// eslint-disable-next-line import/no-named-default

const TabBadge = styled(Box)`
  line-height: 18px;
  font-size: 12px;
  fort-weight: 600;
  color: white;
  border-radius: 4px;
  padding: 2px 4px;
  margin-left: 6px;
  background-color: ${({ theme }) => theme.colors.black};
  order: 1;
`

interface StyledTabProps extends TabProps {
  label: string
  amountIn?: number
}

const StyledTab = withStyles((theme) =>
  createStyles({
    root: {
      padding: '6px 0',
      margin: '0 32px',
      minWidth: '0',
      minHeight: '48px',
      fontWeight: 700,
      textTransform: 'none',
      color: customTheme.colors.grey,
      opacity: 1,
      '&:first-child': {
        marginLeft: '0',
      },
      [theme.breakpoints.down('md')]: {
        margin: '0 auto',
      },
    },
    selected: {
      color: (theme as any).colors.primary,
    },
    wrapper: {
      flexDirection: 'row',
    },
  }),
)(({ amountIn, ...props }: StyledTabProps) => (
  <Tab
    icon={
      amountIn ? (
        <TabBadge title={amountIn}>{formatBigInt(amountIn)}</TabBadge>
      ) : (
        ''
      )
    }
    disableRipple
    {...props}
  />
))

export default StyledTab
