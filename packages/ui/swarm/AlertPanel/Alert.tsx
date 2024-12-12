import { ExtractProps } from '@swarm/types/props'
import { ReactNode } from 'react'
import { Button, Flash, Flex, Heading, Text } from 'rimble-ui'

import { useTheme } from '@swarm/ui/theme/useTheme'

interface AlertProps extends ExtractProps<typeof Flash> {
  title: ReactNode
  children: ReactNode
  controls: ReactNode
  titleProps?: ExtractProps<typeof Heading>
  onClose?: () => void
}

const Alert = ({
  title,
  children,
  controls,
  titleProps,
  onClose,
  ...props
}: AlertProps) => {
  const theme = useTheme()

  return (
    <>
      <Flash
        mb="24px"
        variant="info"
        width="100%"
        border="2px solid"
        {...props}
      >
        <Flex justifyItems="center" alignItems="center">
          <Heading
            as="h4"
            color="text-rare"
            fontWeight={5}
            m={0}
            {...titleProps}
            flex="1"
          >
            {title}{' '}
          </Heading>
          {onClose && (
            <Button.Text
              icononly
              bg="transparent"
              mainColor="grey"
              icon="Close"
              height="28px"
              onClick={onClose}
              zIndex={theme.zIndices.alert}
              boxShadow={0}
              minWidth="0"
            />
          )}
        </Flex>
        <Text.p color="text-light" mt={2} mb={3}>
          {children}
        </Text.p>
        <Flex alignItems="center">{controls}</Flex>
      </Flash>
    </>
  )
}

export default Alert
