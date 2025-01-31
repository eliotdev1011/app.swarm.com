import { ReactNode } from 'react'
import { Card, Flex, Heading } from 'rimble-ui'
import { BackgroundColorProps, MarginProps, PaddingProps } from 'styled-system'

interface SectionProps extends MarginProps, PaddingProps, BackgroundColorProps {
  title?: ReactNode
  children: ReactNode
  badge?: ReactNode
}
const Section = ({ title, badge, children, ...props }: SectionProps) => {
  return (
    <Card
      p={[3, '24px']}
      borderRadius={1}
      boxShadow={4}
      border="0"
      width="100%"
      flexDirection="column"
      {...props}
    >
      <Flex
        alignItems="center"
        justifyContent={['space-between', 'flex-start']}
      >
        {title && (
          <Heading
            as="h3"
            fontSize={[2, 3]}
            lineHeight={['24px', '28px']}
            fontWeight={5}
            color="grey"
            m={0}
            flexGrow="1"
          >
            {title}
          </Heading>
        )}
        {badge}
      </Flex>
      {children}
    </Card>
  )
}

export default Section
