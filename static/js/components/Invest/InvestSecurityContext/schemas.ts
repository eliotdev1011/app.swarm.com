import i18n from '@swarm/core/shared/i18n'
import * as yup from 'yup'

const SoFSchema = yup.object().shape({
  amount: yup
    .number()
    .moreThan(0, i18n.t('errors:amountMoreThan', { amount: 0 }))
    .required(i18n.t('errors:notEmpty')),
  sourceOfIncome: yup.string().required(i18n.t('errors:selectRequired')),
  showOtherSource: yup.boolean(),
  otherSource: yup.string().when('showOtherSource', {
    is: true,
    then: (schema) => schema.required(i18n.t('errors:notEmpty')),
  }),
  investKnowledge: yup.string().required(i18n.t('errors:selectRequired')),
  annualIncome: yup.string().required(i18n.t('errors:selectRequired')),
  netWorth: yup.string().required(i18n.t('errors:selectRequired')),
  document: yup.mixed().required(i18n.t('errors:uploadFile')),
  agreement: yup.boolean().oneOf([true], '*'),
})

const ISSchema = yup.object().shape({
  stocksKnowledge: yup.string().required(i18n.t('errors:selectRequired')),
  bondsKnowledge: yup.string().required(i18n.t('errors:selectRequired')),
  investGoal: yup.string().required(i18n.t('errors:selectRequired')),
  supportIssues: yup.string().required(i18n.t('errors:selectRequired')),
  financialPosition: yup.string().required(i18n.t('errors:selectRequired')),
  comfortableRisk: yup.string().required(i18n.t('errors:selectRequired')),
  schoolQualification: yup.string().required(i18n.t('errors:selectRequired')),
})

export { SoFSchema, ISSchema }
