import Checkbox from '@material-ui/core/Checkbox'
import { GENERIC_ERROR } from '@swarm/core/services/error-handler'
import { uploadFileToS3 } from '@swarm/core/services/s3'
import DropzoneField from '@swarm/ui/presentational/DropzoneField'
import SmartButton from '@swarm/ui/swarm/Buttons/SmartButton'
import TextInput from '@swarm/ui/swarm/Input/TextInput/TextInput'
import { useFormikContext } from 'formik'
import { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Box, Flex, Heading, Link, Text } from 'rimble-ui'
import styled from 'styled-components/macro'

import InvestSecurityDropdown from './InvestSecurityDropdown'
import InvestSecurityInput from './InvestSecurityInput'
import { FormikValues } from './funds.formik'

const StyledText = styled(Text.p)`
  margin: 14px 0 0;
  color: ${({ theme }) => theme.colors.text};
  font-weight: bold;
  max-width: 195px;
`

const StyledSpan = styled(Text.span)`
  color: ${({ theme }) => theme.colors.text};
  font-weight: bold;
`

const StyledLink = styled(Link)`
  color: ${({ theme }) => theme.colors.text};
  font-weight: bold;
  text-decoration: underline;
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    opacity: 0.95;
  }
`

type OptionType = {
  label: string
  value: string
}

const SoFModal = () => {
  const { t } = useTranslation(['invest'])

  const { setFieldValue, values, errors, handleSubmit, isSubmitting } =
    useFormikContext<FormikValues>()

  const shouldValidate = Boolean(Object.values(errors).length)
  const [loadingDocument, setLoadingDocument] = useState(false)

  const handleSelectChange = (
    option: OptionType | null,
    fieldName: keyof FormikValues,
  ) => {
    if (option) {
      setFieldValue(fieldName, option.value, shouldValidate)
    }
  }

  const handleFileLoading = async (file: File) => {
    try {
      setLoadingDocument(true)
      const fileURL = await uploadFileToS3(file)
      setFieldValue('document', fileURL, shouldValidate)
      setLoadingDocument(false)
      return null
    } catch (e) {
      setLoadingDocument(false)
      return [
        {
          code: GENERIC_ERROR.type,
          message: GENERIC_ERROR.description,
        },
      ]
    }
  }

  const handleFileDialogClose = () => {
    setFieldValue('document', '', false)
  }

  const handleInputChange = (
    fieldName: keyof FormikValues,
    value: string | number | boolean,
  ) => {
    setFieldValue(fieldName, value, shouldValidate)
  }

  useEffect(() => {
    const other = t('invest:fundsModal.sourceOfIncome.other')
    setFieldValue(
      'showOtherSource',
      values.sourceOfIncome === other,
      shouldValidate,
    )
  }, [values.sourceOfIncome, setFieldValue, t, shouldValidate])

  return (
    <Box>
      <Heading
        as="h4"
        fontSize={[2, 3]}
        fontWeight={5}
        mt={0}
        mb="24px"
        color="grey"
      >
        {t('invest:fundsModal.title')}
      </Heading>

      <Heading
        as="h4"
        fontSize={[2, 3]}
        fontWeight={5}
        mt={0}
        mb="24px"
        color="grey"
      >
        {t('invest:fundsModal.subtitle')}
      </Heading>

      <Text.p color="text" fontWeight="bold" fontSize={[2, 1]} mt={0} mb="24px">
        {t('invest:fundsModal.description')}
      </Text.p>

      <form onSubmit={handleSubmit}>
        <Flex justifyContent="space-between" mb={3}>
          <Text.p color="text" fontWeight="bold" fontSize={[2, 1]}>
            {t('invest:fundsModal.amount')}
          </Text.p>
          <InvestSecurityInput
            value={values.amount}
            onChange={(value) => handleInputChange('amount', value)}
            error={errors.amount}
          />
        </Flex>

        <Flex flexDirection="column" justifyContent="flex-end" mb={3}>
          <Flex mb={2} justifyContent="space-between">
            <StyledText fontSize={[2, 1]}>
              {t('invest:fundsModal.sourceOfIncome.title')}:
            </StyledText>
            <InvestSecurityDropdown
              error={errors.sourceOfIncome}
              onChange={(value) => handleSelectChange(value, 'sourceOfIncome')}
              placeholder={t('invest:fundsModal.sourceOfIncome.placeholder')}
              options={[
                {
                  label: t('invest:fundsModal.sourceOfIncome.salary'),
                  value: t('invest:fundsModal.sourceOfIncome.salary'),
                },
                {
                  label: t('invest:fundsModal.sourceOfIncome.rent'),
                  value: t('invest:fundsModal.sourceOfIncome.rent'),
                },
                {
                  label: t('invest:fundsModal.sourceOfIncome.invest'),
                  value: t('invest:fundsModal.sourceOfIncome.invest'),
                },
                {
                  label: t('invest:fundsModal.sourceOfIncome.other'),
                  value: t('invest:fundsModal.sourceOfIncome.other'),
                },
              ]}
            />
          </Flex>
          {values.showOtherSource ? (
            <TextInput
              onChange={(value: string) =>
                handleInputChange('otherSource', value)
              }
              error={errors.otherSource}
              inputProps={{
                placeholder: t('invest:fundsModal.sourceOfIncome.title'),
              }}
            />
          ) : null}
        </Flex>

        <Flex mb={3} justifyContent="space-between">
          <StyledText fontSize={[2, 1]}>
            {t('invest:fundsModal.investKnowledge.title')}
          </StyledText>
          <InvestSecurityDropdown
            error={errors.investKnowledge}
            onChange={(value) => handleSelectChange(value, 'investKnowledge')}
            placeholder={t('invest:fundsModal.investKnowledge.placeholder')}
            options={[
              {
                label: t('invest:fundsModal.investKnowledge.poor'),
                value: t('invest:fundsModal.investKnowledge.poor'),
              },
              {
                label: t('invest:fundsModal.investKnowledge.limited'),
                value: t('invest:fundsModal.investKnowledge.limited'),
              },
              {
                label: t('invest:fundsModal.investKnowledge.good'),
                value: t('invest:fundsModal.investKnowledge.good'),
              },
              {
                label: t('invest:fundsModal.investKnowledge.sophist'),
                value: t('invest:fundsModal.investKnowledge.sophist'),
              },
            ]}
          />
        </Flex>

        <Flex mb={3} justifyContent="space-between">
          <StyledText fontSize={[2, 1]}>
            {t('invest:fundsModal.annualIncome.title')}
          </StyledText>
          <InvestSecurityDropdown
            error={errors.annualIncome}
            onChange={(value) => handleSelectChange(value, 'annualIncome')}
            placeholder={t('invest:fundsModal.annualIncome.placeholder')}
            options={[
              {
                label: t('invest:fundsModal.annualIncome.less200'),
                value: t('invest:fundsModal.annualIncome.less200'),
              },
              {
                label: t('invest:fundsModal.annualIncome.200_1000'),
                value: t('invest:fundsModal.annualIncome.200_1000'),
              },
              {
                label: t('invest:fundsModal.annualIncome.300_1000'),
                value: t('invest:fundsModal.annualIncome.300_1000'),
              },
              {
                label: t('invest:fundsModal.annualIncome.over1000'),
                value: t('invest:fundsModal.annualIncome.over1000'),
              },
            ]}
          />
        </Flex>

        <Flex mb="24px" justifyContent="space-between">
          <StyledText fontSize={[2, 1]}>
            {t('invest:fundsModal.netWorth.title')}
          </StyledText>
          <InvestSecurityDropdown
            error={errors.netWorth}
            onChange={(value) => handleSelectChange(value, 'netWorth')}
            placeholder={t('invest:fundsModal.netWorth.placeholder')}
            options={[
              {
                label: t('invest:fundsModal.netWorth.less500'),
                value: t('invest:fundsModal.netWorth.less500'),
              },
              {
                label: t('invest:fundsModal.netWorth.500_1000'),
                value: t('invest:fundsModal.netWorth.500_1000'),
              },
              {
                label: t('invest:fundsModal.netWorth.1000_5000'),
                value: t('invest:fundsModal.netWorth.1000_5000'),
              },
              {
                label: t('invest:fundsModal.netWorth.over5000'),
                value: t('invest:fundsModal.netWorth.over5000'),
              },
            ]}
          />
        </Flex>

        <Text.p
          color="text"
          fontWeight="bold"
          fontSize={[2, 1]}
          mt={0}
          mb="24px"
        >
          {t('invest:fundsModal.dropzoneTitle')}
        </Text.p>
        <Box mb="24px">
          <DropzoneField
            loading={loadingDocument}
            error={errors.document}
            dropzoneOptions={{
              asyncValidator: handleFileLoading,
              onFileDialogCancel: handleFileDialogClose,
            }}
            uploadText={t('invest:fundsModal.document.upload')}
            successText={t('invest:fundsModal.document.success')}
          />
        </Box>

        <Flex alignItems="center" mb="24px">
          <Checkbox
            color="primary"
            checked={values.agreement}
            onChange={(event, checked) => {
              handleInputChange('agreement', checked)
            }}
          />
          <StyledSpan fontSize="14px">
            <Trans ns="invest" i18nKey="fundsModal.agreement">
              <StyledLink
                fontSize="14px"
                href="https://docs.swarmx.net/other/terms-for-tokenizaton-of-stock-certificate-tokens"
                target="_blank"
              >
                SwarmX Terms for Tokenizaton of Stock Certificate Tokens.
              </StyledLink>
            </Trans>
            <Text.span color="danger">{errors.agreement}</Text.span>
          </StyledSpan>
        </Flex>

        <SmartButton
          onClick={() => {}}
          type="submit"
          color="primary"
          alignSelf="center"
          fontWeight={600}
          minHeight="42px"
          width="100%"
          borderWidth="2px"
          loading={isSubmitting}
        >
          {t('invest:fundsModal.submit')}
        </SmartButton>
      </form>
    </Box>
  )
}

export default SoFModal
