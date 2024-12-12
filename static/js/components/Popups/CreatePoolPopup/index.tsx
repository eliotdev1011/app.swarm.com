import config from '@swarm/core/config'
import useFeatureFlags, {
  FlaggedFeatureName,
} from '@swarm/core/hooks/data/useFeatureFlags'
import usePopupState from '@swarm/core/hooks/state/usePopupState'
import { useStoredNetworkId } from '@swarm/core/web3'
import { ChildrenProps } from '@swarm/types'
import { Drawer } from '@swarm/ui/presentational/Drawer'
import { StyledTabs } from '@swarm/ui/presentational/StyledTabs'
import StyledTab from '@swarm/ui/swarm/StyledTab'
import SvgIcon from '@swarm/ui/swarm/SvgIcon'
import { createContext, FC, useContext, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, Heading } from 'rimble-ui'

import AdvancedPoolSettings from './AdvancedPoolSettings'
import Assets from './Assets'
import { CreatePoolContextProvider } from './CreatePoolContext'
import SmartPoolRights from './SmartPoolRights'
import {
  CloseIcon,
  ContentWrapper,
  CreatePoolPopupContainer,
} from './components'

const { matchNetworkSupportsSmartPools } = config

interface TabPanelProps extends ChildrenProps {
  index: number
  value: number
}

const TabPanel: FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      className="tab-panel"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  )
}

interface CreatePoolPopupProps {
  hasSmartPoolsSupport: boolean
  isOpen: boolean
  onClose: () => void
}

const CreatePoolPopup = ({
  hasSmartPoolsSupport,
  isOpen,
  onClose,
}: CreatePoolPopupProps) => {
  const { t } = useTranslation('pools')
  const { ifFeature } = useFeatureFlags()

  const [tab, setTab] = useState<number>(0)

  const handleSwitchTab = (event: unknown, index: number) => {
    setTab(index)
  }

  const isShowingSmartPools =
    hasSmartPoolsSupport &&
    ifFeature(FlaggedFeatureName.smartPoolsCreation, true, false)

  return (
    <CreatePoolContextProvider isOpen={isOpen} isCreatingSmartPool={tab === 1}>
      <Drawer anchor="right" open={isOpen} onClose={onClose} elevation={0}>
        <CreatePoolPopupContainer>
          <Flex
            paddingX={4}
            paddingTop={4}
            paddingBottom={isShowingSmartPools ? 0 : 4}
            flexDirection="column"
            bg="white"
            position="relative"
          >
            <Heading
              as="h3"
              fontSize={5}
              lineHeight="28px"
              fontWeight={5}
              mb={isShowingSmartPools ? 2 : 0}
              mt={0}
              color="black"
            >
              {t('createPool.title')}
            </Heading>
            <CloseIcon onClick={onClose}>
              <SvgIcon name="Close" />
            </CloseIcon>
            {isShowingSmartPools ? (
              <StyledTabs
                value={tab}
                onChange={handleSwitchTab}
                aria-label="Pool tabs"
              >
                <StyledTab
                  label={t('createPool.tabs.fixed')}
                  style={{ margin: '0 15px 0 0' }}
                />
                <StyledTab
                  label={t('createPool.tabs.smart')}
                  style={{ margin: '0 0 0 15px' }}
                />
              </StyledTabs>
            ) : null}
          </Flex>
          <ContentWrapper>
            <TabPanel index={0} value={tab}>
              <Assets />
              <AdvancedPoolSettings isShowingTokenSettings={false} />
            </TabPanel>
            {isShowingSmartPools ? (
              <TabPanel index={1} value={tab}>
                <Assets />
                <SmartPoolRights />
                <AdvancedPoolSettings isShowingTokenSettings />
              </TabPanel>
            ) : null}
          </ContentWrapper>
        </CreatePoolPopupContainer>
      </Drawer>
    </CreatePoolContextProvider>
  )
}

export const CreatePoolPopupContext = createContext<{
  openCreatePoolPopup: () => void
  closeCreatePoolPopup: () => void
}>({
  openCreatePoolPopup: () => {
    throw new Error(
      "Can't call openCreatePoolPopup outside of CreatePoolPopupProvider",
    )
  },
  closeCreatePoolPopup: () => {
    throw new Error(
      "Can't call closeCreatePoolPopup outside of CreatePoolPopupProvider",
    )
  },
})

interface CreatePoolPopupProviderProps {
  children: React.ReactNode
}

export const CreatePoolPopupProvider: React.FC<CreatePoolPopupProviderProps> = (
  props: CreatePoolPopupProviderProps,
) => {
  const { children } = props

  const networkId = useStoredNetworkId()

  const networkSupportsSmartPools = matchNetworkSupportsSmartPools(networkId)

  const { isOpen, open, close } = usePopupState(false)

  const value = useMemo(() => {
    return {
      openCreatePoolPopup: open,
      closeCreatePoolPopup: close,
    }
  }, [open, close])

  return (
    <CreatePoolPopupContext.Provider value={value}>
      {children}

      <CreatePoolPopup
        hasSmartPoolsSupport={networkSupportsSmartPools}
        isOpen={isOpen}
        onClose={close}
      />
    </CreatePoolPopupContext.Provider>
  )
}

export const useCreatePoolPopup = () => {
  return useContext(CreatePoolPopupContext)
}
