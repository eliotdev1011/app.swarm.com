import { Text } from 'rimble-ui'
import styled from 'styled-components/macro'

import Clickable from '@ui/presentational/Clickable'

import TokenIcon from '../TokenIcon'

import { StyledInfoIcon } from './components/styled-components'
import { TokenItemProps } from './types'

const TokenLabel = styled(Text)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const TokenItem = ({
  symbol,
  name,
  badge,
  logo,
  onClick,
  onClickInfo,
  showTokenInfo,
  tokenId,
  ...props
}: TokenItemProps) => {
  return (
    <Clickable
      justifyContent="space-between"
      alignItems="center"
      py="12px"
      px={2}
      borderRadius={2}
      hoverBackgroundColor="rgba(200, 200, 200, 0.2)"
      onClick={onClick}
      {...props}
    >
      <TokenIcon
        symbol={symbol}
        name={name}
        logo={logo}
        width="32px"
        height="32px"
      />
      <TokenLabel
        color="black"
        fontWeight={5}
        flexGrow={1}
        mx={3}
        flexBasis="50%"
        overflow="hidden"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
      >
        {symbol}
        <Text.span fontWeight={2} title={name}>{` (${name})`}</Text.span>
      </TokenLabel>
      {tokenId && <Text.span mr={2}>ID: {tokenId}</Text.span>}
      {badge}
      {showTokenInfo && (
        <StyledInfoIcon
          name="InfoOutline"
          ml={2}
          onClick={(e: React.MouseEvent<HTMLElement>) => {
            e.stopPropagation()
            onClickInfo()
          }}
        />
      )}
    </Clickable>
  )
}

export default TokenItem
