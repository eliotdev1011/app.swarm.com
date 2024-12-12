import useClickAway from '@swarm/core/hooks/dom/useClickAway'
import { ReactChild, ReactNode } from 'react'
import { Box, Button } from 'rimble-ui'
import styled from 'styled-components/macro'
import { SpaceProps } from 'styled-system'

const Wrapper = styled(Box)`
  box-sizing: border-box;
  display: inline-flex;
  position: relative;
  align-items: center;
  justify-content: center;
`

const Menu = styled(Box)`
  position: absolute;
  top: 100%;
  margin-top: 4px;
  right: 0;
  z-index: ${({ theme }) => theme.zIndices.dropDownButtonMenu};
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: 0px 3px 8px rgba(77, 77, 77, 0.25);
  border-radius: 4px;
  list-style: none;
  min-width: 100%;
`

export const Option = styled(Button).attrs((props) => ({
  mainColor: props.mainColor || 'secondary',
  contrastColor: props.contrastColor || 'primary',
}))`
  padding: 4px 12px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-items: center;
  white-space: nowrap;
  margin: 0;
  box-shadow: none;
  width: 100%;

  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.colors['primary-light']};
    box-shadow: none;
  }
`

interface DropDownButtonProps extends SpaceProps {
  children: ReactNode
  renderButton: (active: boolean, toggle: () => void) => ReactChild
}

const DropDownButton = (props: DropDownButtonProps) => {
  const { children, renderButton, ...containerProps } = props
  const { ref, active, toggle } = useClickAway()

  return (
    <Box {...containerProps}>
      <Wrapper ref={ref}>
        {renderButton(active, toggle)}
        {active && <Menu onClick={toggle}>{children}</Menu>}
      </Wrapper>
    </Box>
  )
}

export default DropDownButton
