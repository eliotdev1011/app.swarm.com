import { Box } from 'rimble-ui'

import PriceChart from './PriceChart'
import { useSwapContext } from './SwapContext'
import TokenPairSwaps from './TokenPairSwaps'

const TokenPairSwapHistory = () => {
  const { xTokenPair, swaps, tokenIn, tokenOut } = useSwapContext()

  return (
    <Box>
      <PriceChart
        tokenPair={xTokenPair}
        tokenIn={tokenIn}
        tokenOut={tokenOut}
        lastSwapId={swaps?.data?.swaps?.[0]?.id}
      />
      <TokenPairSwaps swaps={swaps} tokenPair={xTokenPair} />
    </Box>
  )
}

export default TokenPairSwapHistory
