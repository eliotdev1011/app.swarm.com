import { SwapTxSettings } from '@swarm/types'
import { AdvancedSettingsProps } from '@swarm/types/props'
import Dialog from '@swarm/ui/presentational/Dialog'
import Tooltip from '@swarm/ui/presentational/Tooltip'
import { useSnackbar } from '@swarm/ui/swarm/Snackbar'
import { AlertVariant } from '@swarm/ui/swarm/Snackbar/types'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Button, Flex, Heading } from 'rimble-ui'

import { useSwapContext } from 'src/components/Swap/SwapContext'
import ToggleButtonGroup from 'src/components/ToggleButtonGroup'
import {
  MAX_SAFE_SLIPPAGE,
  transactionToleranceOptions,
} from 'src/shared/consts'
import { checkIsSwarm } from 'src/shared/utils/brand'
import { saveSettingsPerSession } from 'src/shared/utils/swap-settings'

import AutoPaySwitch from './AutoPaySwitch'

const AdvancedSettings = ({ isOpen, onClose }: AdvancedSettingsProps) => {
  const { t } = useTranslation('swap')
  const { addAlert } = useSnackbar()
  const { settings, setSwapSettings } = useSwapContext()
  const [localSettings, setLocalSettings] = useState<SwapTxSettings>(settings)

  const isValid = useMemo(
    () => localSettings.tolerance <= MAX_SAFE_SLIPPAGE,
    [localSettings.tolerance],
  )

  const handleToleranceChange = useCallback(
    (tolerance: number) => setLocalSettings((prev) => ({ ...prev, tolerance })),
    [],
  )

  const handleAutoPaySmtChange = useCallback(
    () =>
      setLocalSettings((prev) => ({
        ...prev,
        autoPaySmtDiscount: !prev.autoPaySmtDiscount,
      })),
    [],
  )

  const handleSaveSettings = useCallback(() => {
    setSwapSettings(localSettings)
    saveSettingsPerSession(localSettings)
    addAlert(t('advancedSettings.savedTextToastMessage'), {
      variant: AlertVariant.success,
    })
    onClose()
  }, [t, addAlert, onClose, localSettings, setSwapSettings])

  const resetLocalSettings = useCallback(
    () => setLocalSettings(settings),
    [settings],
  )

  const isSwarm = checkIsSwarm()

  const closeModal = useCallback(() => {
    resetLocalSettings()
    onClose()
  }, [onClose, resetLocalSettings])

  return (
    <Dialog
      isOpen={isOpen}
      width={['100%', 'auto']}
      minWidth={[0, 0, '428px']}
      onClose={closeModal}
      p="24px"
      title={t('advancedSettings.header')}
      titleProps={{
        fontSize: 3,
      }}
    >
      <Flex alignItems="center" mt={3}>
        <Heading
          as="h4"
          fontSize={1}
          lineHeight="copy"
          fontWeight={5}
          m={0}
          color="black"
        >
          {t('advancedSettings.tolerance')}
        </Heading>
        <Tooltip
          placement="top"
          message={t('advancedSettings.toleranceTooltip')}
          variant="light"
        >
          <Button variant="plain" height="16px" icononly icon="Help" ml={2} />
        </Tooltip>
      </Flex>

      <Box>
        <ToggleButtonGroup
          selectedValue={localSettings.tolerance}
          options={transactionToleranceOptions}
          onSelect={handleToleranceChange}
          validator={(value) => value >= 0 && value < 100}
        />
      </Box>

      {isSwarm && (
        <>
          <Flex alignItems="center" mt="24px">
            <Heading
              as="h4"
              fontSize={1}
              lineHeight="copy"
              fontWeight={5}
              m={0}
              color="black"
            >
              {t('advancedSettings.discountAutoPay')}
            </Heading>
            <Tooltip
              placement="top"
              message={t('advancedSettings.discountAutoPayTooltip')}
              variant="light"
            >
              <Button
                variant="plain"
                height="16px"
                icononly
                icon="Help"
                ml={2}
              />
            </Tooltip>
          </Flex>
          <Box>
            <AutoPaySwitch
              checked={localSettings.autoPaySmtDiscount}
              onChange={handleAutoPaySmtChange}
            />
          </Box>
        </>
      )}

      <Box mt="24px">
        <Button disabled={!isValid} width="100%" onClick={handleSaveSettings}>
          {t('advancedSettings.saveBtn')}
        </Button>
      </Box>
    </Dialog>
  )
}

export default AdvancedSettings
