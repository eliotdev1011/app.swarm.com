import Content from '@swarm/ui/presentational/Content'
import AlertPanel from '@swarm/ui/swarm/AlertPanel'
import TransactionForbidden from '@swarm/ui/swarm/FlashToasts/TransactionForbidden'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Flex } from 'rimble-ui'

import HeaderActions from 'src/components/HeaderActions'
import Layout from 'src/components/Layout'
import AdvancedSettings from 'src/components/Swap/AdvancedSettings'
import Assets from 'src/components/Swap/Assets'
import { SwapContextProvider } from 'src/components/Swap/SwapContext'
import TokenPairSwapHistory from 'src/components/Swap/TokenPairSwapHistory'

const Swap = () => {
  const { t } = useTranslation('swap')

  const [settingsOpened, setSettingsOpened] = useState(false)
  const [isHistoryOpened, setIsHistoryOpened] = useState(false)
  const toggleAdvancedSettings = useCallback(
    () => setSettingsOpened((prev) => !prev),
    [],
  )

  const closeSettingsModal = () => setSettingsOpened(false)

  const toggleHistory = () => setIsHistoryOpened((prev) => !prev)

  return (
    <SwapContextProvider>
      <TransactionForbidden />
      <Layout
        header={t('header')}
        scrollable
        headerActions={<HeaderActions addLiquidity />}
      >
        <Content bg="background">
          <Flex flexDirection="column" m="0 auto" maxWidth="520px">
            <AlertPanel />

            <Assets
              toggleAdvancedSettings={toggleAdvancedSettings}
              advancedSettingsOpen={settingsOpened}
              isHistoryOpened={isHistoryOpened}
              toggleHistoryVisibility={toggleHistory}
            />

            {isHistoryOpened && <TokenPairSwapHistory />}
          </Flex>
          <AdvancedSettings
            isOpen={settingsOpened}
            onClose={closeSettingsModal}
          />
        </Content>
      </Layout>
    </SwapContextProvider>
  )
}

export default Swap
