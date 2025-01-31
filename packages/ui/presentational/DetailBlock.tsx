import { ReactNode } from 'react'
import { Box, Text } from 'rimble-ui'
import styled from 'styled-components/macro'
import { space, SpaceProps } from 'styled-system'

import TextWithTooltip from './Text/TextWithTooltip'
import Translate from './Translate'

const DetailsWrapper = styled(Box)<SpaceProps>`
  ${space}
  white-space: pre-wrap;
`

const StyledText = styled(Text)`
  word-break: break-all;
  white-space: pre-wrap;
`

const Block = ({
  namespace,
  label,
  content,
  color,
  bold,
  children,
  helpText,
}: {
  namespace: string
  label: string
  content?: ReactNode
  color?: string
  bold?: boolean
  children?: React.ReactNode
  helpText?: string
}) => {
  return (
    <DetailsWrapper mt={3}>
      <Text fontWeight={4} color="grey" fontSize={1}>
        {helpText ? (
          <TextWithTooltip tooltip={helpText}>
            <Translate namespaces={[namespace]}>{label}</Translate>
          </TextWithTooltip>
        ) : (
          <Translate namespaces={[namespace]}>{label}</Translate>
        )}
      </Text>
      {children || (
        <StyledText fontWeight={bold ? 4 : 2} color={color ?? 'black'} mt={1}>
          {content ?? '-'}
        </StyledText>
      )}
    </DetailsWrapper>
  )
}

export default Block
