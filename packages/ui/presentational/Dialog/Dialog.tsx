import {
  flexboxProps,
  layoutProps,
  spaceProps,
} from '@swarm/core/shared/consts/style-system'
import { ExtractProps } from '@swarm/types/props'
import pick from 'lodash/pick'
import React, { useCallback, useState } from 'react'
import { Box, Card, Flex, Heading } from 'rimble-ui'
import styled from 'styled-components/macro'
import {
  BorderRadiusProps,
  flexbox,
  FlexboxProps,
  layout,
  LayoutProps,
  space,
  SpaceProps,
} from 'styled-system'

import Portal from '../Portal'
import Wrapper from '../Wrapper'

import { DialogCloseButton } from './components/DialogCloseButton'

interface StyledOverlayProps {
  bg: string
  isFullScreen: boolean
}
const StyledOverlay = styled(Box)<StyledOverlayProps>`
  & {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: ${({ theme }) => theme.zIndices.commonDialog};
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-flow: column;
    place-items: center;
    place-content: center;
    padding: ${({ theme, isFullScreen }) =>
      isFullScreen ? 0 : theme.space[3]}px;
    ${flexbox}
    ${layout}
    ${space}

    transition: all .25s;
  }
`

StyledOverlay.defaultProps = {
  bg: 'blacks.10',
}

const modalOverlayClass = 'modal-overlay'

interface DialogProps {
  isOpen?: boolean
  isFullScreen?: boolean
  onClose?: () => void
  title?: React.ReactNode
  titleProps?: ExtractProps<typeof Heading>
  closeNode?: React.ReactNode
  children: React.ReactNode
  withoutPortal?: boolean
}

const Dialog = (
  props: DialogProps &
    LayoutProps &
    FlexboxProps &
    SpaceProps &
    BorderRadiusProps,
) => {
  const {
    isOpen = false,
    isFullScreen = false,
    onClose,
    title,
    children,
    titleProps,
    borderRadius = 1,
    closeNode = <DialogCloseButton onClick={onClose} />,
    withoutPortal = false,
    ...rest
  } = props

  const pickedLayoutProps = pick(rest, layoutProps)
  const pickedFlexboxProps = pick(rest, flexboxProps)
  const pickedSpaceProps = pick(rest, spaceProps)
  const [closeOnClickAway, setCloseOnClickAway] = useState(true)

  const handleAwayClick = useCallback(
    (e: React.BaseSyntheticEvent<HTMLDivElement>) => {
      e.stopPropagation()
      if (closeOnClickAway && e.target.classList.contains(modalOverlayClass))
        onClose?.()
    },
    [closeOnClickAway, onClose],
  )

  const handleMouseDown = useCallback(
    (e: React.BaseSyntheticEvent<HTMLDivElement>) => {
      setCloseOnClickAway(e.target.classList.contains(modalOverlayClass))
    },
    [],
  )

  if (!isOpen) {
    return null
  }

  return (
    <Wrapper lockScroll component={withoutPortal ? undefined : Portal}>
      <StyledOverlay
        onClick={handleAwayClick}
        onMouseDown={handleMouseDown}
        className={modalOverlayClass}
        isOpen={isOpen}
        isFullScreen={isFullScreen}
        pb={isFullScreen ? 0 : [0, 3]}
        px={isFullScreen ? 0 : [0, 3]}
        justifyContent={['flex-end', 'center']}
      >
        <Card
          position="relative"
          display="flex"
          flexDirection="column"
          justifyContent="stretch"
          borderTopLeftRadius={isFullScreen ? 0 : [3, borderRadius]}
          borderTopRightRadius={isFullScreen ? 0 : [3, borderRadius]}
          borderBottomLeftRadius={isFullScreen ? 0 : [0, borderRadius]}
          borderBottomRightRadius={isFullScreen ? 0 : [0, borderRadius]}
          width={isFullScreen ? '100%' : ['100%', 'auto']}
          height={isFullScreen ? '100%' : undefined}
          maxWidth="100%"
          maxHeight="100%"
          p={3}
          {...pickedLayoutProps}
          {...pickedSpaceProps}
          {...rest}
        >
          {onClose !== undefined ? (
            <Box position="absolute" right="4px" top="4px">
              {closeNode}
            </Box>
          ) : null}
          {!!title && (
            <Heading as="h4" fontSize={4} fontWeight={5} mt={0} {...titleProps}>
              {title}
            </Heading>
          )}
          <Flex
            flexDirection="column"
            height="100%"
            width="100%"
            overflow="hidden"
          >
            <Flex
              flexDirection="column"
              height="100%"
              width="100%"
              overflowY="auto"
              p={3}
              {...pickedFlexboxProps}
            >
              {children}
            </Flex>
          </Flex>
        </Card>
      </StyledOverlay>
    </Wrapper>
  )
}

export default Dialog
