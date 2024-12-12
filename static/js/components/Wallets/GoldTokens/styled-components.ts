import { Flex } from 'rimble-ui'
import styled from 'styled-components/macro'

export const SelectedNFTWrapper = styled(Flex)`
  cursor: pointer;
  border: 1px solid ${({ theme }) => theme.colors.primary};
`

export const XGoldInputWrapper = styled(Flex)`
  border: 1px solid ${({ theme }) => theme.colors.grey};
  border-radius: 8px;
  padding: 12px;
  align-items: center;
  justify-content: space-between;
`

export const GoldNftsListItemWrapper = styled(Flex)`
  cursor: pointer;
  padding: 12px;
  justify-content: space-between;
  align-items: center;

  background-color: ${({ $selected, theme }) =>
    $selected ? theme.colors['primary-light'] : 'transparent'};

  &:hover {
    background-color: ${({ theme }) =>
      theme.colors['primary-lighter-variant2']};
  }
`

export const GoldNftsListWrapper = styled(Flex)`
  flex-direction: column;
  max-height: 250px;
  overflow-y: auto;
`

export const XGoldInfoDisclamerWrapper = styled(Flex)`
  background-color: ${({ theme }) => theme.colors['orange-light']};
  padding: 6px 8px;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  align-items: center;
`
