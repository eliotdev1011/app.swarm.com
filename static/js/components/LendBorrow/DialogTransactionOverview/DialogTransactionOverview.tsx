import React from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Text } from 'rimble-ui'
import styled from 'styled-components/macro'

interface Item {
  label: React.ReactNode
  value: React.ReactNode
}

interface Props {
  items: Item[]
}

const Items = styled(Box)`
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.colors.grey};
  border-radius: 4px;

  > * + * {
    margin-top: 8px;
  }
`

const ItemContainer = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: baseline;
`

export const DialogTransactionOverview: React.FC<Props> = (props: Props) => {
  const { items } = props

  const { t } = useTranslation(['lendBorrow'])

  return (
    <Box width="100%">
      <Text fontSize={1} color="gray" marginBottom="4px">
        {t('dialogTransactionOverview.title')}
      </Text>
      <Items>
        {items.map((item, index) => {
          return (
            // eslint-disable-next-line react/no-array-index-key -- this is totally safe
            <ItemContainer key={index}>
              <Text.span fontSize={1}>{item.label}</Text.span>
              <Text.span fontSize={1}>{item.value}</Text.span>
            </ItemContainer>
          )
        })}
      </Items>
    </Box>
  )
}
