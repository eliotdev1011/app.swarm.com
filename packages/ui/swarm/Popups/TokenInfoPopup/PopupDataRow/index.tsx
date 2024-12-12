import Collapse from '@material-ui/core/Collapse'
import { useToggle } from '@swarm/core/hooks/state/useToggle'
import { PropsWithChildren, ReactNode, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Flex, Icon, Text } from 'rimble-ui'

import ToggleButton from '@ui/presentational/Collapsible/ToggleBotton'
import Tooltip from '@ui/presentational/Tooltip'

import PopupDataBox from '../PopupDataBox'

import ValuePresenter, { ValuePresenterProps } from './ValuePresenter'

interface PopupDataRowProps extends ValuePresenterProps {
  label: string
  value: ReactNode
  tooltip?: string
}

const PopupDataRow = ({
  label,
  value,
  tooltip,
  document = false,
  children,
  ...props
}: PropsWithChildren<PopupDataRowProps>) => {
  const { t } = useTranslation('popups')

  const { isOn: expanded, toggle } = useToggle(false)

  const translatedLabel = useMemo(() => {
    return t(`assetInfo.${label}`, {
      defaultValue: label,
    })
  }, [label, t])

  return (
    <Flex alignItems="stretch" flexDirection="column" width="100%">
      <Flex justifyContent="space-between">
        <Box flexBasis="50%" flexGrow={0} flexShrink={0} width="50%">
          {children === undefined ? (
            <Text.span color="grey">
              {translatedLabel}{' '}
              {tooltip && (
                <Tooltip placement="top" message={tooltip}>
                  <Icon
                    size="16px"
                    name="Help"
                    mt={-1}
                    style={{ cursor: 'pointer' }}
                  />
                </Tooltip>
              )}
            </Text.span>
          ) : (
            <ToggleButton
              icon={expanded ? 'KeyboardArrowUp' : 'KeyboardArrowDown'}
              onClick={toggle}
              iconpos="right"
              color="grey"
            >
              {tooltip && (
                <Tooltip placement="top" message={tooltip}>
                  <Icon
                    size="16px"
                    name="Help"
                    mt={-1}
                    style={{ cursor: 'pointer' }}
                  />
                </Tooltip>
              )}
              <Text.span color="grey">{translatedLabel}</Text.span>
            </ToggleButton>
          )}
        </Box>
        <Box flexBasis="50%" flexGrow={0} flexShrink={0} width="50%">
          <ValuePresenter value={value} document={document} {...props} />
        </Box>
      </Flex>
      {children && (
        <Collapse in={expanded} timeout={300}>
          <PopupDataBox py={0} px={5} mt={3}>
            {children}
          </PopupDataBox>
        </Collapse>
      )}
    </Flex>
  )
}

export default PopupDataRow
