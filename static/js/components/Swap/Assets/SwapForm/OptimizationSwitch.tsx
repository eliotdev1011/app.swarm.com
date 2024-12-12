import { big, normalize } from '@swarm/core/shared/utils/helpers/big-helpers'
import { SwapRoutesDiff, SwapTxType } from '@swarmmarkets/smart-order-router'
import { Dispatch, SetStateAction, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Button, Flex, Text } from 'rimble-ui'
import styled from 'styled-components/macro'

import { useSwapContext } from 'src/components/Swap/SwapContext'

export enum SwapOptimisationStrategy {
  gas, // shortest route
  price, // best spot price
}

interface OptimizationSwitchProps {
  strategy: SwapOptimisationStrategy
  setStrategy: Dispatch<SetStateAction<SwapOptimisationStrategy>>
  swapType: SwapTxType
  swapStrategiesDiff: SwapRoutesDiff | null
}

const OptimizationButton = styled(Button).attrs(({ checked }) => ({
  width: '100%',
  minWidth: 0,
  height: ['36px', '28px'],
  borderRadius: 1,
  boxShadow: 0,
  mainColor: checked ? 'white' : 'off-white',
  contrastColor: checked ? 'primary' : 'black',
}))<{ outlinedIcon?: boolean; iconSize?: string; hidden?: boolean }>`
  &:hover {
    box-shadow: none;

    &:active {
      background-color: ${({ checked, theme }) =>
        checked ? theme.colors.white : theme.colors['off-white']};
    }
  }

  svg {
    height: ${({ iconSize }) => iconSize};
    width: ${({ iconSize }) => iconSize};
    ${({ outlinedIcon }) =>
      outlinedIcon &&
      `
    border-radius: 50%;
    border: 1.8px solid currentColor;
  `}
  }

  & {
    width: ${({ hidden }) => hidden && '0px'};
    height: ${({ hidden }) => hidden && '0px'};
    padding: ${({ hidden }) => hidden && '0px'};
    transition: all 1s;
    transition-timing-function: ease-in-out;
  }
`

const OptimizationSwitch = ({
  strategy,
  setStrategy,
  swapType,
  swapStrategiesDiff,
}: OptimizationSwitchProps) => {
  const { t } = useTranslation('swap')
  const { tokenIn, tokenOut } = useSwapContext()

  const priceOptimizationDiff = useMemo(() => {
    if (swapStrategiesDiff !== null) {
      const totalReturnDiff =
        swapType === SwapTxType.exactIn
          ? big(swapStrategiesDiff.totalReturn)
          : big(swapStrategiesDiff.totalReturn).times(-1)

      return normalize(
        totalReturnDiff,
        swapType === SwapTxType.exactIn
          ? tokenOut?.decimals
          : tokenIn?.decimals,
      ).toNumber()
    }

    return -1
  }, [swapStrategiesDiff, swapType, tokenIn, tokenOut])

  useEffect(() => {
    if (swapStrategiesDiff === null) {
      setStrategy(SwapOptimisationStrategy.price)
    }
  }, [setStrategy, swapStrategiesDiff])

  const priceOptimizationButtonTitle = useMemo(() => {
    if (priceOptimizationDiff <= 0) {
      return t('optimization.priceIsTheBest')
    }

    if (swapType === SwapTxType.exactIn) {
      return t('optimization.receiveMore', {
        amount: priceOptimizationDiff,
        tokenSymbol: tokenOut?.symbol,
      })
    }

    return t('optimization.spendLess', {
      amount: priceOptimizationDiff,
      tokenSymbol: tokenIn?.symbol,
    })
  }, [priceOptimizationDiff, swapType, t, tokenIn?.symbol, tokenOut?.symbol])

  return (
    <Box width="100%" mt={3}>
      <Text fontSize={1} color="near-black" fontWeight={5}>
        {t('optimization.optimizedFor')}
      </Text>

      <Flex
        width="100%"
        bg="off-white"
        p={1}
        mt={2}
        borderRadius={1}
        flexDirection={['column', 'row']}
      >
        <OptimizationButton
          icon="Whatshot"
          iconSize="18px"
          disabled={priceOptimizationDiff <= 0}
          title={priceOptimizationButtonTitle}
          onClick={() => setStrategy(SwapOptimisationStrategy.price)}
          checked={strategy === SwapOptimisationStrategy.price}
        >
          {t('optimization.bestPrice')}
        </OptimizationButton>
        <OptimizationButton
          icon="AttachMoney"
          iconSize="15px"
          outlinedIcon
          hidden={priceOptimizationDiff <= 0}
          onClick={() => setStrategy(SwapOptimisationStrategy.gas)}
          checked={strategy === SwapOptimisationStrategy.gas}
        >
          {t('optimization.lowestGas')}
        </OptimizationButton>
      </Flex>
      <Text
        mx={1}
        lineHeight="20px"
        fontSize="10px"
        textAlign="center"
        borderRadius="2px"
        boxShadow="0 1px 3px rgba(0, 0, 0, 0.1)"
      >
        {t(
          `optimization.${
            strategy === SwapOptimisationStrategy.price
              ? 'bestPriceNote'
              : 'cheapestNote'
          }`,
        )}
      </Text>
    </Box>
  )
}

export default OptimizationSwitch
