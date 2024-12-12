import SvgIcon from '@swarm/ui/swarm/SvgIcon'
import { Color } from '@swarm/ui/theme'
import match from 'conditional-expression'
import { ReactNode } from 'react'
import { Box, Card, Heading, Text } from 'rimble-ui'
import styled from 'styled-components/macro'

import StepIndicator from './StepIndicator'

const Icon = styled.div`
  height: 30px;
  display: flex;
  align-items: center;
`

interface OverviewCardIconProps {
  stepNumber: string
}
const OverviewCardIcon = ({ stepNumber }: OverviewCardIconProps) =>
  match(stepNumber)
    .equals('1')
    .then(<SvgIcon name="Wallet" height="30px" fill={Color.primary} />)
    .equals('2')
    .then(<SvgIcon name="WalletChecked" height="40px" fill={Color.primary} />)
    .equals('3')
    .then(<SvgIcon name="Passport" height="30px" fill={Color.primary} />)
    .equals('4')
    .then(<SvgIcon name="Mail" height="20px" fill={Color.primary} />)
    .else('')

interface OverviewCardProps {
  title: string
  description: string
  stepNumber: string
  stepCompleted: boolean
  isActive: boolean
  children?: ReactNode
}

const OverviewCard = ({
  title,
  description,
  stepNumber,
  stepCompleted,
  isActive,
  children,
}: OverviewCardProps) => (
  <Card
    p="24px"
    borderRadius={1}
    boxShadow={2}
    display="flex"
    flexDirection="column"
    opacity={stepCompleted ? 0.5 : 1}
  >
    <StepIndicator isActive={isActive} hide={false} />
    <Icon>
      {stepCompleted ? (
        <SvgIcon name="Completed" height="30px" fill={Color.primary} />
      ) : (
        <OverviewCardIcon stepNumber={stepNumber} />
      )}
    </Icon>
    <Heading mt="10px" mb={0} fontWeight={5}>
      {stepNumber}. {title}
    </Heading>

    <Box
      flexGrow="1"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <Text color="text-light" mt="24px" mb={3}>
        {description}
      </Text>
      {children}
    </Box>
  </Card>
)

export default OverviewCard
