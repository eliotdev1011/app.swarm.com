import { Add } from '@rimble/icons'
import { FlaggedFeatureName } from '@swarm/core/hooks/data/useFeatureFlags'
import { VerificationStatus } from '@swarm/core/shared/enums'
import { getVerificationStep } from '@swarm/core/shared/utils'
import { connect } from '@swarm/core/state/AppContext'
import { SmtContextProvider } from '@swarm/core/state/SmtContext'
import { AppState } from '@swarm/types/state'
import LinkButton from '@swarm/ui/swarm/Buttons/LinkButton'
import ConnectButton from '@swarm/ui/swarm/ConnectButton'
import FlaggedFeature from '@swarm/ui/swarm/FlaggedFeature'
import NetworkSelect from '@swarm/ui/swarm/NetworkSelect'
import RewardsWalletPopup from '@swarm/ui/swarm/Popups/RewardsWalletPopup'
import SmtRewardsBadge from '@swarm/ui/swarm/SmtRewardsBadge'
import { SwarmApps } from '@swarm/ui/swarm/SwarmApps'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Button, Flex } from 'rimble-ui'

import { useCreatePoolPopup } from './Popups/CreatePoolPopup'

interface HeaderActionsProps extends Record<string, unknown> {
  addLiquidity?: boolean
  createPool?: boolean
  currentStep?: number
  smtWidget?: boolean
  appsWidget?: boolean
  showPopup?: boolean
  networkSelect?: boolean
  setShowPopup?: (showPopup: boolean) => void
}

const HeaderActions = ({
  addLiquidity = false,
  createPool = false,
  smtWidget = true,
  appsWidget = true,
  currentStep = 1,
  showPopup = false,
  networkSelect = true,
  setShowPopup = () => {},
}: HeaderActionsProps) => {
  const { t } = useTranslation('pools')
  const [showRewardsBalancePopup, setShowRewardsBalancePopup] = useState(false)

  const { openCreatePoolPopup } = useCreatePoolPopup()

  const openModal = useCallback(() => {
    setShowRewardsBalancePopup(true)
    setShowPopup(true)
  }, [setShowPopup])

  const closeModal = useCallback(() => {
    setShowRewardsBalancePopup(false)
    setShowPopup(false)
  }, [setShowPopup])

  return (
    <Flex alignItems="center" display={['none', 'flex']} height="2.5rem">
      <FlaggedFeature name={FlaggedFeatureName.addLiqudity}>
        {addLiquidity && (
          <LinkButton
            mr="12px"
            pathname="/pools"
            contrastColor="primary"
            mainColor="white"
            size="medium"
            fontWeight={4}
            px={3}
          >
            <Add size="20" mr={2} />
            {t('addLiquidity')}
          </LinkButton>
        )}
      </FlaggedFeature>
      <FlaggedFeature name={FlaggedFeatureName.createPool}>
        {createPool && (
          <Button
            mr="12px"
            contrastColor="primary"
            mainColor="white"
            size="medium"
            fontWeight={4}
            px={3}
            onClick={openCreatePoolPopup}
          >
            <Add size="20" mr={2} />
            {t('createPool.title')}
          </Button>
        )}
      </FlaggedFeature>
      {networkSelect && (
        <Box mr="12px">
          <NetworkSelect />
        </Box>
      )}
      <SmtContextProvider>
        {currentStep > 0 && smtWidget && (
          <SmtRewardsBadge onClick={openModal} />
        )}

        {appsWidget && <SwarmApps />}
        <ConnectButton />

        <RewardsWalletPopup
          isOpen={showRewardsBalancePopup || showPopup}
          onClose={closeModal}
        />
      </SmtContextProvider>
    </Flex>
  )
}

const mapStateToProps = ({ user }: AppState) => {
  const { verificationStatus = VerificationStatus.notVerified } = user

  return {
    currentStep: getVerificationStep(verificationStatus),
  }
}
export default connect<HeaderActionsProps>(mapStateToProps)(HeaderActions)
