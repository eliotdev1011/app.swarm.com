import usePopupState from '@swarm/core/hooks/state/usePopupState'
import { isPolygon } from '@swarm/core/shared/utils/config'
import { useNetwork } from '@swarm/core/web3'
import Tooltip from '@swarm/ui/presentational/Tooltip'
import PolygonInfoPopup from '@swarm/ui/swarm/Popups/PolygonInfoPopup'
import SvgIcon from '@swarm/ui/swarm/SvgIcon'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Button, Card, Flex, Heading } from 'rimble-ui'

import { InvestSecurityProvider } from 'src/components/Invest/InvestSecurityContext'

import SwapForm from './SwapForm'

interface SwapAssetsProps {
  toggleAdvancedSettings: () => void
  advancedSettingsOpen: boolean
  isHistoryOpened: boolean
  toggleHistoryVisibility: () => void
}

const Assets = ({
  toggleAdvancedSettings,
  advancedSettingsOpen,
  isHistoryOpened,
  toggleHistoryVisibility,
}: SwapAssetsProps) => {
  const { t } = useTranslation('swap')
  const { networkName, networkId } = useNetwork()
  const polygonInfoPopup = usePopupState()
  const polygon = useMemo(() => isPolygon(networkId), [networkId])

  return (
    <Card
      p={['16px', '24px']}
      borderRadius={1}
      boxShadow={4}
      border="0"
      display="flex"
      flexDirection="column"
      width="100%"
      height="fit-content"
    >
      <Flex alignItems="center" justifyContent="space-between" mb="24px">
        <Heading
          as="h3"
          fontSize={3}
          lineHeight="28px"
          fontWeight={5}
          color="grey"
          my={0}
        >
          {t('assets.header')}{' '}
          <SvgIcon name={polygon ? 'Polygon' : 'Ethereum-Logo.wine'} />{' '}
          {networkName}
        </Heading>
        <Box>
          <Tooltip placement="top" message={t('assets.toggleSwapHistory')}>
            <Button
              variant="plain"
              mainColor={isHistoryOpened ? 'primary' : 'grey'}
              onClick={toggleHistoryVisibility}
              height="28px"
            >
              <SvgIcon name="history" />
            </Button>
          </Tooltip>
          <Tooltip placement="top" message={t('assets.toggleSettings')}>
            <Button
              variant="plain"
              icon="Settings"
              icononly
              mainColor={advancedSettingsOpen ? 'primary' : 'grey'}
              onClick={toggleAdvancedSettings}
              height="28px"
              ml={2}
            />
          </Tooltip>
          {polygon && (
            <Button
              variant="plain"
              icon="Help"
              icononly
              mainColor="grey"
              height="28px"
              ml={2}
              onClick={polygonInfoPopup.open}
            />
          )}
        </Box>
      </Flex>
      <InvestSecurityProvider>
        <SwapForm />
      </InvestSecurityProvider>
      {polygon && (
        <PolygonInfoPopup
          isOpen={polygonInfoPopup.isOpen}
          onClose={polygonInfoPopup.close}
        />
      )}
    </Card>
  )
}

export default Assets
