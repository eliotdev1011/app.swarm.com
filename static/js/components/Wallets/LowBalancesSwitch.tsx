import { SwitchProps } from '@material-ui/core'
import { Help } from '@rimble/icons'
import useBreakpoints from '@swarm/core/hooks/ui/useBreakPoints'
import AngledSwitch from '@swarm/ui/presentational/AngledSwitch'
import Tooltip from '@swarm/ui/presentational/Tooltip'
import { useTranslation } from 'react-i18next'
import { Flex, Text } from 'rimble-ui'

import { useWalletsContext } from './WalletsContext'

const LowBalancesSwitch = (props: SwitchProps) => {
  const { t } = useTranslation('wallets')
  const { isSm, isXs, isLg } = useBreakpoints()
  const { hideSmallBalances, toggleHideSmallBalances } = useWalletsContext()

  const handleSwitchChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    value: boolean,
  ) => toggleHideSmallBalances(value)

  return isSm || isXs ? null : (
    <Tooltip placement="top" message={t('switchTooltip')}>
      <Flex mr={[1, 2, 2, 4]} alignItems="center">
        <AngledSwitch
          {...props}
          checked={hideSmallBalances}
          onChange={handleSwitchChange}
        />
        {isLg ? (
          <Text.span
            color="grey"
            fontWeight={4}
            ml={2}
            style={{
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {t('switchLabel')}
          </Text.span>
        ) : (
          <Help size="15" ml={2} color="grey" />
        )}
      </Flex>
    </Tooltip>
  )
}

export default LowBalancesSwitch
