export interface FormikValues {
  amount: number | ''
  sourceOfIncome: string
  otherSource: string
  showOtherSource: boolean
  investKnowledge: string
  annualIncome: string
  netWorth: string
  document: string
  agreement: boolean
  stocksKnowledge: string
  bondsKnowledge: string
  investGoal: string
  supportIssues: string
  financialPosition: string
  comfortableRisk: string
  schoolQualification: string
}

export const initialValues: FormikValues = {
  amount: '',
  sourceOfIncome: '',
  otherSource: '',
  showOtherSource: false,
  investKnowledge: '',
  annualIncome: '',
  netWorth: '',
  document: '',
  agreement: false,
  stocksKnowledge: '',
  bondsKnowledge: '',
  investGoal: '',
  supportIssues: '',
  financialPosition: '',
  comfortableRisk: '',
  schoolQualification: '',
}
