import TokenIcon from '@swarm/ui/swarm/TokenIcon'
import { Box, Button, Flex, Icon, Text } from 'rimble-ui'

import { XGoldInputWrapper } from './styled-components'

interface XGoldInputProps {
  name: string
  symbol: string
  value?: string | number
  maxValue?: number
  onChange?: (value: number) => void
  readonly?: boolean
  nameColor?: string
}

const XGoldInput = ({
  readonly,
  name,
  symbol,
  value = 0,
  maxValue,
  onChange,
  nameColor,
}: XGoldInputProps) => {
  const increment = () => {
    if (!maxValue || +value + 1 > maxValue) return
    onChange?.(+value + 1)
  }

  const decrement = () => {
    if (+value - 1 < 0) return
    onChange?.(+value - 1)
  }

  const max = () => {
    if (maxValue === undefined) return
    onChange?.(maxValue)
  }

  return (
    <XGoldInputWrapper>
      <Flex alignItems="center">
        <TokenIcon
          symbol={symbol}
          name={name}
          width="32px"
          height="32px"
          mr="10px"
        />
        <Box flexGrow="1">
          <Text.span color={nameColor} fontSize={2} fontWeight={5}>
            {name}
          </Text.span>
        </Box>
      </Flex>
      <Flex alignItems="center">
        <Text.span fontSize={2} fontWeight={2} ml="8px">
          {value}
          {readonly && ` ${symbol}`}
        </Text.span>
        {!readonly && (
          <>
            <Flex flexDirection="column" ml="5px">
              <Icon
                onClick={increment}
                style={{ cursor: 'pointer' }}
                name="ExpandLess"
                size="16px"
              />
              <Icon
                onClick={decrement}
                style={{ cursor: 'pointer' }}
                name="ExpandMore"
                size="16px"
              />
            </Flex>
            <Button.Text
              p={0}
              height="24px"
              width="min-content"
              onClick={max}
              fontSize="10px"
              color="grey"
            >
              Max
            </Button.Text>
          </>
        )}
      </Flex>
    </XGoldInputWrapper>
  )
}

export default XGoldInput
