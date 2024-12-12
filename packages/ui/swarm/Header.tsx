import useHasScrolled from '@swarm/core/hooks/dom/useHasScrolled'
import React, { forwardRef } from 'react'
import { Box, Flex, Heading, Text } from 'rimble-ui'
import styled from 'styled-components/macro'
import { PositionProps } from 'styled-system'

interface HeaderProps extends PositionProps {
  title: React.ReactNode
  legend?: React.ReactNode
  subheader?: React.ReactNode
  children?: React.ReactNode
  shadowOnScroll?: boolean
}

const Wrapper = styled(Box)`
  transition: box-shadow 500ms;
`

const Header = forwardRef(
  (
    {
      title,
      legend,
      subheader,
      children,
      shadowOnScroll,
      ...props
    }: HeaderProps,
    ref,
  ) => {
    const shadow = useHasScrolled({ active: shadowOnScroll })

    return (
      <Wrapper
        width="100%"
        bg="white"
        display="flex"
        flexDirection={['column', 'row']}
        justifyContent="space-between"
        p={[3, 3, 4]}
        style={{ zIndex: 2 }}
        {...(subheader ? { pb: ['18px', '18px', '18px'] } : {})}
        {...props}
        ref={ref}
        boxShadow={shadow && `0px 8px 16px rgba(0, 0, 0, 0.15)`}
      >
        <Box width="100%">
          <Flex justifyContent="space-between" flexWrap="wrap">
            {typeof title === 'string' ? (
              <Heading
                as="h2"
                fontWeight={5}
                fontSize={5}
                lineHeight="40px"
                color="text"
                my="0"
                maxWidth="676px"
                textAlign="left"
              >
                {title}
              </Heading>
            ) : (
              title
            )}
            {children && (
              <Box
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
              >
                {children}
              </Box>
            )}
          </Flex>
          {legend && (
            <Text.p color="grey" fontWeight={5} mt="14px" mb="0">
              {legend}
            </Text.p>
          )}
          {!!subheader && (
            <Box color="grey" mt="14px">
              {subheader}
            </Box>
          )}
        </Box>
      </Wrapper>
    )
  },
)

Header.displayName = 'Header'

export default Header
