import { useFormikContext } from 'formik'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'
import { Box, Button, Flex, Heading, Text } from 'rimble-ui'
import styled from 'styled-components/macro'

import InvestSecurityDropdown from './InvestSecurityDropdown'
import { FormikValues } from './funds.formik'

const StyledText = styled(Text.p)`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-weight: bold;
  max-width: 230px;
`

type OptionType = {
  label: string
  value: string
}

const options = [
  {
    label: i18next.t('common:yes'),
    value: i18next.t('common:yes'),
  },
  {
    label: i18next.t('common:no'),
    value: i18next.t('common:no'),
  },
]

const generateOptions = (values: string[]) => {
  return values.map((value) => ({
    label: value,
    value,
  }))
}

const ISForm = () => {
  const { t } = useTranslation(['invest'])

  const { setFieldValue, errors, handleSubmit } =
    useFormikContext<FormikValues>()

  const shouldValidate = Boolean(Object.values(errors).length)

  const handleSelectChange = (
    option: OptionType | null,
    fieldName: keyof FormikValues,
  ) => {
    if (option) {
      setFieldValue(fieldName, option.value, shouldValidate)
    }
  }

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
        {t('invest:fundsModal.investorModal.title')}
      </Heading>

      <Text.p color="text" fontWeight="bold" fontSize={[2, 1]} mt={0} mb="24px">
        {t('invest:fundsModal.investorModal.description')}
      </Text.p>

      <form onSubmit={handleSubmit}>
        <Flex flexDirection="column" justifyContent="flex-end" mb={3}>
          <Flex mb={2} justifyContent="space-between" alignItems="center">
            <StyledText fontSize={[2, 1]}>
              {t('invest:fundsModal.stocksKnowledge')}:
            </StyledText>
            <InvestSecurityDropdown
              error={errors.stocksKnowledge}
              onChange={(value) => handleSelectChange(value, 'stocksKnowledge')}
              placeholder={t('invest:fundsModal.select')}
              options={options}
            />
          </Flex>
        </Flex>

        <Flex mb={3} justifyContent="space-between" alignItems="center">
          <StyledText fontSize={[2, 1]}>
            {t('invest:fundsModal.bondsKnowledge')}
          </StyledText>
          <InvestSecurityDropdown
            error={errors.bondsKnowledge}
            onChange={(value) => handleSelectChange(value, 'bondsKnowledge')}
            placeholder={t('invest:fundsModal.select')}
            options={options}
          />
        </Flex>

        <Flex mb={3} justifyContent="space-between" alignItems="center">
          <StyledText fontSize={[2, 1]}>
            {t('invest:fundsModal.schoolQualification.title')}
          </StyledText>
          <InvestSecurityDropdown
            error={errors.schoolQualification}
            onChange={(value) =>
              handleSelectChange(value, 'schoolQualification')
            }
            placeholder={t('invest:fundsModal.selectLevel')}
            options={generateOptions([
              t('invest:fundsModal.schoolQualification.economicSecondary'),
              t('invest:fundsModal.schoolQualification.economicTertiary'),
              t('invest:fundsModal.schoolQualification.nonEconomic'),
              t('invest:fundsModal.schoolQualification.other'),
            ])}
          />
        </Flex>

        <Flex mb={3} justifyContent="space-between" alignItems="center">
          <StyledText fontSize={[2, 1]}>
            {t('invest:fundsModal.financialPosition')}
          </StyledText>
          <InvestSecurityDropdown
            error={errors.financialPosition}
            onChange={(value) => handleSelectChange(value, 'financialPosition')}
            placeholder={t('invest:fundsModal.select')}
            options={options}
          />
        </Flex>

        <Flex mb={3} justifyContent="space-between" alignItems="center">
          <StyledText fontSize={[2, 1]}>
            {t('invest:fundsModal.comfortableRisk.title')}
          </StyledText>
          <InvestSecurityDropdown
            error={errors.comfortableRisk}
            onChange={(value) => handleSelectChange(value, 'comfortableRisk')}
            placeholder={t('invest:fundsModal.select')}
            options={options}
          />
        </Flex>

        <Flex mb={3} justifyContent="space-between" alignItems="center">
          <StyledText fontSize={[2, 1]}>
            {t('invest:fundsModal.investGoal')}
          </StyledText>
          <InvestSecurityDropdown
            error={errors.investGoal}
            onChange={(value) => handleSelectChange(value, 'investGoal')}
            placeholder={t('invest:fundsModal.select')}
            options={generateOptions([
              t('invest:fundsModal.comfortableRisk.oldAgeProvision'),
              t('invest:fundsModal.comfortableRisk.familySafety'),
              t('invest:fundsModal.comfortableRisk.futurePurchases'),
              t('invest:fundsModal.comfortableRisk.speculating'),
              t('invest:fundsModal.comfortableRisk.regularIncome'),
              t('invest:fundsModal.comfortableRisk.valueIncreace'),
            ])}
          />
        </Flex>

        <Flex mb="24px" justifyContent="space-between" alignItems="center">
          <StyledText fontSize={[2, 1]}>
            {t('invest:fundsModal.supportIssues')}
          </StyledText>
          <InvestSecurityDropdown
            error={errors.supportIssues}
            onChange={(value) => handleSelectChange(value, 'supportIssues')}
            placeholder={t('invest:fundsModal.select')}
            options={options}
          />
        </Flex>

        <Button
          type="submit"
          color="primary"
          alignSelf="center"
          fontWeight={600}
          minHeight="42px"
          width="100%"
          borderWidth="2px"
        >
          {t('invest:fundsModal.next')}
        </Button>
      </form>
    </Box>
  )
}

export default ISForm
