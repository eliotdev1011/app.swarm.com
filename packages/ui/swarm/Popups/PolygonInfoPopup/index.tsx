import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import config from '@swarm/core/config'
import useEffectCompare from '@swarm/core/hooks/effects/useEffectCompare'
import api from '@swarm/core/services/api'
import { networksBridges } from '@swarm/core/shared/consts'
import { usePolygonInfoLocalStorage } from '@swarm/core/shared/localStorage'
import { useAccount, useConnectWallet } from '@swarm/core/web3'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Button, Flex, Heading, Loader, Text } from 'rimble-ui'

import Divider from '@ui/presentational/Divider'
import { Drawer } from '@ui/presentational/Drawer'
import InfoLink from '@ui/presentational/InfoLink'

import SmartButton from '../../Buttons/SmartButton'
import { useSnackbar } from '../../Snackbar'
import { AlertVariant } from '../../Snackbar/types'
import SvgIcon from '../../SvgIcon'

const { faq } = config.resources.docs.gettingStarted

interface PolygonInfoPopupProps {
  isOpen: boolean
  onClose: () => void
}

const PolygonInfoPopup = ({ isOpen, onClose }: PolygonInfoPopupProps) => {
  const { t } = useTranslation(['popups', 'transaction'])
  const account = useAccount()
  const connectWallet = useConnectWallet()
  const [shouldAutoRequest, setShouldAutoRequest] = useState(false)
  const [alreadyRequested, setAlreadyRequested] = useState(false)
  const { value: dontShowAgain, setValue: setDontShowAgain } =
    usePolygonInfoLocalStorage()
  const { addError, addAlert } = useSnackbar()

  const requestMaticToken = useCallback(
    async (address: string) => {
      try {
        await api.requestMaticFromFaucet(address)

        addAlert(
          t('polygonInfo.requestSent', {
            variant: AlertVariant.success,
          }),
        )
      } catch (e) {
        // do nothing
      } finally {
        setAlreadyRequested(true)
      }
    },
    [addAlert, t],
  )

  const handleRequestButtonClick = useCallback(async () => {
    if (!account) {
      const success = await connectWallet()

      if (success) {
        setShouldAutoRequest(true)
      } else {
        addError(new Error(t('polygonInfo.pleaseConnect')))
      }
    } else {
      await requestMaticToken(account)
    }
  }, [account, addError, connectWallet, requestMaticToken, t])

  const handleOnClose = useCallback(() => {
    onClose()
  }, [onClose])

  const handleBridgeClick = useCallback(() => {
    setDontShowAgain(true)
    handleOnClose()
    window.open(networksBridges.polygon.name, '_blank')
  }, [handleOnClose, setDontShowAgain])

  const handleDontShowAgainCheckboxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDontShowAgain(e.target.checked)
    },
    [setDontShowAgain],
  )

  useEffect(() => {
    if (shouldAutoRequest && account) {
      requestMaticToken(account)
    }
  }, [
    account,
    alreadyRequested,
    requestMaticToken,
    setAlreadyRequested,
    shouldAutoRequest,
  ])

  useEffectCompare(() => {
    setAlreadyRequested(false)
  }, [account])

  return (
    <Drawer anchor="right" open={isOpen} onClose={onClose} elevation={0}>
      <Flex
        flexDirection="column"
        width={['100%', '600px']}
        justifyContent="flex-start"
        alignItems="center"
        p={3}
      >
        <SvgIcon
          name="PolygonLogo"
          style={{ flex: '1 0 100px', marginBottom: '16px' }}
        />
        <Heading
          as="h4"
          fontSize="20px"
          fontWeight="bold"
          lineHeight="28px"
          m={0}
          mb={1}
        >
          {t('polygonInfo.title')}
        </Heading>

        <Text.span
          as="h4"
          fontSize="14px"
          fontWeight="bold"
          m={0}
          lineHeight="24px"
          width="200px"
        >
          {t('polygonInfo.subtitle')}
        </Text.span>

        <Text.span
          as="h4"
          fontSize="20px"
          fontWeight="bold"
          color="grey"
          m={0}
          my={4}
        >
          {t('polygonInfo.howToGetStarted')}
        </Text.span>

        <Box>
          <Text.span
            fontSize="16px"
            color="grey"
            lineHeight="24px"
            m={0}
            my={3}
          >
            {t('polygonInfo.instruction1_1')}
            <SvgIcon
              name="PolygonLogo"
              height="24px"
              width="24px"
              style={{
                flex: '1 0 24px',
                display: 'inline-block',
                marginRight: '8px',
                marginLeft: '8px',
                verticalAlign: 'sub',
              }}
            />
            {t('polygonInfo.instruction1_2')}
            <SmartButton
              disabled={alreadyRequested}
              onClick={handleRequestButtonClick}
              component={Button.Text}
              requireInitiated
              requireAccount
              requireLogin
              loadingText={<Loader />}
            >
              {t('polygonInfo.instruction1action')}
            </SmartButton>
          </Text.span>
          <Divider my={2} />
          <Text.span fontSize="16px" color="grey" m={0} my={3}>
            {t('polygonInfo.instruction2')}
            <SmartButton component={Button.Text} onClick={handleBridgeClick}>
              {t('polygonInfo.instruction2action')}
            </SmartButton>
          </Text.span>
        </Box>

        <InfoLink href={faq} m={0} my={4}>
          {t('polygonInfo.learnAboutOtherWays')}
        </InfoLink>

        <Divider my={4} />

        <Flex direction="row">
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                onChange={handleDontShowAgainCheckboxChange}
                value="true"
                checked={dontShowAgain}
              />
            }
            label={
              <Text.span fontSize="16px" color="grey" m={0} my={3}>
                {t('polygonInfo.dontShowAgain')}
              </Text.span>
            }
          />
          <Button.Text
            m={0}
            p={0}
            mainColor="grey"
            fontSize={2}
            fontWeight={2}
            style={{ textDecoration: 'underline' }}
            onClick={handleOnClose}
          >
            {t('actions.close')}
          </Button.Text>
        </Flex>
      </Flex>
    </Drawer>
  )
}

export default PolygonInfoPopup
