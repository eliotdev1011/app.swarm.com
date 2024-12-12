import { prettifyBalance } from '@swarm/core/shared/utils/formatting'
import { big } from '@swarm/core/shared/utils/helpers/big-helpers'
import { BigSource } from 'big.js'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Text } from 'rimble-ui'

interface PriceProps {
  swapPrice: BigSource
  disabled?: boolean
  tokenInSymbol?: string
  tokenOutSymbol?: string
  tokenInExchangeRate?: number | null
  tokenOutExchangeRate?: number | null
}

const Price = ({
  swapPrice,
  disabled,
  tokenInSymbol,
  tokenOutSymbol,
  tokenInExchangeRate,
  tokenOutExchangeRate,
}: PriceProps) => {
  const { t } = useTranslation('swap')

  const [isPriceReverted, setIsPriceReverted] = useState(false)

  const tokenSymbols = useMemo(
    () =>
      isPriceReverted
        ? [tokenOutSymbol, tokenInSymbol]
        : [tokenInSymbol, tokenOutSymbol],
    [isPriceReverted, tokenInSymbol, tokenOutSymbol],
  )

  const usdPrice = useMemo(() => {
    const price = big(swapPrice)
    if (price.eq(0) || !tokenOutExchangeRate || !tokenInExchangeRate) {
      return undefined
    }

    if (isPriceReverted) {
      return big(1).div(price).times(tokenInExchangeRate).toNumber()
    }

    return price.times(tokenOutExchangeRate).toNumber()
  }, [isPriceReverted, swapPrice, tokenInExchangeRate, tokenOutExchangeRate])

  const handleFlipPrice = useCallback(
    () => setIsPriceReverted((prevState) => !prevState),
    [],
  )

  const formattedPrice = useMemo(() => {
    const price = big(swapPrice)
    if (!price.eq(0)) {
      return t('assets.exchangeRate', {
        tokenIn: tokenSymbols[0],
        rate: prettifyBalance(isPriceReverted ? big(1).div(price) : price, 6),
        tokenOut: tokenSymbols[1],
        usdValue: usdPrice ? prettifyBalance(usdPrice) : '--',
      })
    }

    return '--'
  }, [isPriceReverted, swapPrice, t, tokenSymbols, usdPrice])

  return (
    <Text
      fontSize={1}
      color="grey"
      textAlign="center"
      mt="20px"
      display="flex"
      justifyContent="center"
      alignItems="center"
      opacity={disabled ? 0 : 1}
    >
      {formattedPrice}
      <Button.Text
        onlyIcon
        icon="SwapHoriz"
        height="auto"
        onClick={handleFlipPrice}
      />
    </Text>
  )
}

export default Price
