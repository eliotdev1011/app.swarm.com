import styled from 'styled-components/macro'

export const CreatePoolPopupContainer = styled.div`
  width: 800px;
  max-width: calc(100vw - 304px);
  flex-direction: column;
  align-items: center;
  height: 100vh;
  overflow-y: auto;
  background: ${({ theme }) => theme.colors.background};

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints[0]}) {
    width: 100%;
    min-width: 100vw;
    padding-top: 48px;
  }
`

export interface CloseIconProps {
  onClick: () => void
}

export const CloseIcon = styled.button<CloseIconProps>`
  position: absolute;
  top: 28px;
  right: 28px;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
`

export const AssetItemContainer = styled.div`
  position: relative;
  padding: 10px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

export const RemoveIcon = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;

  svg {
    width: 13px;
    height: 13px;
  }
`

export const AssetItemGrid = styled.div`
  width: 100%;
  display: grid;
  grid-auto-columns: auto;
  grid-template-columns: 3fr 2fr 2fr 4fr 2fr 3fr;
  grid-row-gap: 20px;
  margin-top: 10px;
  gap: ${({ theme }) => `${theme.space[1]}px`};

  @media (min-width: ${({ theme }) => theme.breakpoints[1]}) {
    grid-template-columns: 3fr 2fr 2fr 4fr 2fr 3fr;
    grid-row-gap: 20px;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints[2]}) {
    grid-template-columns: 3fr 2fr 2fr 4fr 2fr 3fr;
  }
`

export const ContentWrapper = styled.div`
  flex: 1;
  padding: 20px;

  .tab-panel > * + * {
    margin-top: 20px;
  }
`
