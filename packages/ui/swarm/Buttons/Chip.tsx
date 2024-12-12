import { ExtractProps } from '@swarm/types/props'
import { Button, Link } from 'rimble-ui'
import styled from 'styled-components/macro'

const StyledButton = styled(Button)`
  height: 22px;
  padding: 0 8px;
  box-shadow: none;

  &:active {
    background: unset;
  }
`

const Chip = (props: ExtractProps<typeof Button>) => (
  <StyledButton
    {...props}
    size="small"
    mainColor="primary-lighter-variant2"
    contrastColor="primary"
  />
)

const StyledLink = styled(Link)`
  box-sizing: border-box;
  position: relative;
  font-weight: 500;
  line-height: 1;
  border: none;
  border-radius: 4px;
  font-size: 0.75rem;
  min-width: 2rem;
  appearance: none;
  user-select: none;
  white-space: nowrap;
  text-decoration: none;
  text-align: center;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors['primary-lighter-variant2']};
  z-index: 0;
  height: 22px;
  padding: 0 8px;

  &:hover {
    cursor: pointer;
    text-decoration: inherit;
    box-shadow: 0px 2px 4px rgb(0 0 0 / 20%);
    color: ${({ theme }) => theme.colors.primary};
  }

  &:active {
    box-shadow: none;
  }
`

Chip.Link = function ChipLink(props: ExtractProps<typeof Link>) {
  return <StyledLink {...props} />
}

export default Chip
