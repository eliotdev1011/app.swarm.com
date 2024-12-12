import { AbstractToken } from '@swarm/types/tokens'
import { Flex } from 'rimble-ui'
import styled from 'styled-components/macro'
import { FlexWrapProps, MarginProps } from 'styled-system'

import TokenIcon from './TokenIcon'

interface TokenIconsProps extends MarginProps, FlexWrapProps {
  tokens: AbstractToken[]
  size?: number
}

const TokenIconsWrapper = styled(Flex)`
  position: relative;
`

const SingleTokenIconWrapper = styled.div`
  width: 16px;
  flex: 0 1 0;
`

const TokenIcons = ({
  tokens,
  size = 20,
  ...wrapperProps
}: TokenIconsProps) => {
  return (
    <TokenIconsWrapper flexWrap="wrap" {...wrapperProps}>
      {tokens.map((token) => (
        <SingleTokenIconWrapper key={token.id}>
          <TokenIcon
            width={`${size}px`}
            height={`${size}px`}
            symbol={token.symbol}
            name={token.name}
            maxWidth="none"
          />
        </SingleTokenIconWrapper>
      ))}
    </TokenIconsWrapper>
  )
}

export default TokenIcons
