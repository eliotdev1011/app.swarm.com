import config from '@swarm/core/config'
import useRequest from '@swarm/core/hooks/async/useRequest'
import api from '@swarm/core/services/api'
import Content from '@swarm/ui/presentational/Content'
import { useSnackbar } from '@swarm/ui/swarm/Snackbar'
import { format, parseISO } from 'date-fns'
import { Trans, useTranslation } from 'react-i18next'
import {
  Box,
  Button,
  Card,
  Flash,
  Flex,
  Heading,
  Link,
  Loader,
  Text,
} from 'rimble-ui'
import styled from 'styled-components/macro'

import OnboardingHeader from 'src/components/Onboarding/OnboardingHeader'

const { coreConcepts } = config.resources.docs

const Info = styled(Box)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: ${({ theme }) => theme.fontSizes?.[1]}px;
`

interface VerifyBankProps {
  onClose: () => void
}

const VerifyBank = ({ onClose }: VerifyBankProps) => {
  const { t } = useTranslation(['onboarding'])
  const { data, ready, refetch } = useRequest(api.getPaymentInfo)
  const { addError } = useSnackbar()
  const {
    account_name: accountName,
    bank_name: bankName,
    iban,
    payment_reference: paymentReference,
    swift,
    sent_at: sentAt,
    status,
  } = data?.attributes || {}

  const confirmSent = () => {
    api.updatePaymentInfo().then(refetch).catch(addError)
  }

  const confirmNotSent = () => {
    api.updatePaymentInfo(false).then(refetch).catch(addError)
  }

  return (
    <Box
      width="100vw"
      minHeight="100vh"
      bg="background"
      display="flex"
      flexDirection="column"
    >
      <OnboardingHeader
        header={t('verifyBank.header')}
        subheader={t('verifyBank.subHeader')}
        button={t('verifyBank.headerButton')}
      />
      <Content centerH bg="background">
        <Heading
          textAlign="left"
          width={['100%', '788px']}
          fontWeight="bold"
          fontSize="20px"
        >
          {t('verifyBank.title')}
        </Heading>
        <Card width={['100%', '788px']} p={4} borderRadius={1}>
          {!ready ? (
            <Loader size="100px" m="auto" />
          ) : (
            <>
              <Box>
                <Text mb="24px" fontSize="20px">
                  <Trans ns="onboarding" i18nKey="verifyBank.intro">
                    Send
                    <Text.span fontWeight="bold" fontSize="20px">
                      1 EUR
                    </Text.span>
                    from your bank to verify your account.
                  </Trans>
                  <Text fontSize="20px" color="warning-dark">
                    {t('verifyBank.notice')}
                  </Text>
                </Text>
                <Box width={1}>
                  <Flex>
                    <Box width={1 / 2} color="grey" fontWeight={700} mb="12px">
                      {t('verifyBank.accountNumber')}
                    </Box>
                    <Info width={1 / 2} title={iban}>
                      {iban}
                    </Info>
                  </Flex>
                  <Flex>
                    <Box width={1 / 2} color="grey" fontWeight={700} mb="12px">
                      {t('verifyBank.swift')}
                    </Box>
                    <Info width={1 / 2} title={swift}>
                      {swift}
                    </Info>
                  </Flex>
                  <Flex>
                    <Box width={1 / 2} color="grey" fontWeight={700} mb="12px">
                      {t('verifyBank.bankName')}
                    </Box>
                    <Info width={1 / 2} title={bankName}>
                      {bankName}
                    </Info>
                  </Flex>
                  <Flex>
                    <Box width={1 / 2} color="grey" fontWeight={700} mb="12px">
                      {t('verifyBank.accountName')}
                    </Box>
                    <Info width={1 / 2} title={accountName}>
                      {accountName}
                    </Info>
                  </Flex>
                  <Flex>
                    <Box width={1 / 2} color="grey" fontWeight={700} mb="12px">
                      {t('verifyBank.paymentReference')}
                    </Box>
                    <Info width={1 / 2} title={paymentReference}>
                      {paymentReference}
                    </Info>
                  </Flex>
                </Box>
              </Box>
              {status !== 'sent' && (
                <Box mt="50px">
                  <Button
                    size="medium"
                    px={3}
                    width="fit-content"
                    color="primary"
                    onClick={confirmSent}
                  >
                    {t('verifyBank.confirmButton')}
                  </Button>
                  <Button.Outline
                    size="medium"
                    px={3}
                    ml={3}
                    width="fit-content"
                    color="primary"
                    border="1.5px solid"
                    borderColor="primary"
                    onClick={onClose}
                  >
                    {t('verifyBank.backButton')}
                  </Button.Outline>
                </Box>
              )}
            </>
          )}
        </Card>
        {status === 'sent' ? (
          <Card width={['100%', '788px']} p={4} mt={3} borderRadius={1}>
            <Box width={1}>
              <Flex>
                <Box width={1 / 2} color="grey" fontWeight={700} mb="12px">
                  {t('verifyBank.status')}
                </Box>
                <Info width={1 / 2}>{t('verifyBank.statusPending')}</Info>
              </Flex>
              <Flex>
                <Box width={1 / 2} color="grey" fontWeight={700} mb="12px">
                  {t('verifyBank.sent_atdateSent')}
                </Box>
                <Info width={1 / 2}>
                  {sentAt && format(parseISO(sentAt), 'hh:mm aa MM/dd/yyyy')}
                </Info>
              </Flex>
              <Flex>
                <Box width={1 / 2} color="grey" fontWeight={700} mb="12px">
                  {t('verifyBank.dateReceived')}
                </Box>
                <Info width={1 / 2}>{t('verifyBank.withinDays')}</Info>
              </Flex>
            </Box>
            <Box mt="24px">
              <Button.Outline
                size="medium"
                px={3}
                width="fit-content"
                color="primary"
                borderColor="primary"
                border="1.5px solid"
                onClick={onClose}
              >
                {t('verifyBank.backToOverviewButton')}
              </Button.Outline>
              <Button.Text
                size="medium"
                px={3}
                ml={3}
                width="fit-content"
                color="primary"
                onClick={confirmNotSent}
              >
                {t('verifyBank.resetButton')}
              </Button.Text>
            </Box>
          </Card>
        ) : (
          <Flash
            my={3}
            variant="info"
            width={['100%', '788px']}
            border="2px solid"
            mb="24px"
          >
            <Heading as="h4" color="primary" fontWeight={5} m={0}>
              {t('verifyBank.footnoteTitle')}
            </Heading>
            <Text.p color="text-light" mt={2} mb={3}>
              {t('verifyBank.footnoteBody')}
            </Text.p>
            <Link
              href={coreConcepts.passport}
              title="Learn more"
              color="primary"
              hoverColor="primary-dark"
              fontSize={2}
              fontWeight={4}
            >
              {t('verifyBank.footnoteLink')}
            </Link>
          </Flash>
        )}
      </Content>
    </Box>
  )
}

export default VerifyBank
