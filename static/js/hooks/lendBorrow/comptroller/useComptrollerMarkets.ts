import useObservable from '@swarm/core/hooks/rxjs/useObservable'
import { captureException } from '@swarm/core/services/sentry'
import { DEFAULT_DECIMALS } from '@swarm/core/shared/consts'
import {
  CNATIVE_TOKEN,
  NATIVE_ETH,
  NATIVE_MATIC,
} from '@swarm/core/shared/consts/known-tokens'
import { isPolygon } from '@swarm/core/shared/utils/config'
import { normalize } from '@swarm/core/shared/utils/helpers/big-helpers'
import {
  isSameEthereumAddress,
  provider$,
  useAccount,
  useNetwork,
} from '@swarm/core/web3'
import {
  CErc20Market,
  CNativeTokenMarket,
  Market,
} from '@swarm/types/lend-borrow'
import { ethers, providers } from 'ethers'
import { useEffect, useState } from 'react'

import { CErc20 } from 'src/contracts/LendBorrow/CErc20'
import { CNativeToken } from 'src/contracts/LendBorrow/CNativeToken'
import { Comptroller } from 'src/contracts/LendBorrow/Comptroller'

async function getCErc20MarketsViewData(
  cErc20MarketAddress: string,
  account: string,
  network: { blocksPerDay: number },
  updateMarket: (updatedMarket: CErc20Market) => void,
): Promise<CErc20Market | undefined> {
  const cErc20MarketContract = await CErc20.getInstance(cErc20MarketAddress)

  const marketUnderlyingContract =
    await cErc20MarketContract.getUnderlyingAssetContract()
  const comptrollerContract =
    await cErc20MarketContract.getComptrollerContract()

  if (marketUnderlyingContract === undefined) {
    captureException(
      new Error(
        `Unable to retrieve underlying contract for market ${cErc20MarketAddress}`,
      ),
    )
    return undefined
  }
  if (comptrollerContract === undefined) {
    captureException(
      new Error(
        `Unable to retrieve comptroller contract for market ${cErc20MarketAddress}`,
      ),
    )
    return undefined
  }

  const priceFeedOracleContract =
    await comptrollerContract.getPriceFeedOracleContract()

  if (priceFeedOracleContract === undefined) {
    captureException(
      new Error(
        `Unable to retrieve price feed oracle contract for market ${cErc20MarketAddress}`,
      ),
    )
    return undefined
  }

  const marketValuesPromise = Promise.all([
    cErc20MarketContract.normalizedBalanceOf(account),
    cErc20MarketContract.getCurrentBorrowedBalance(),
    cErc20MarketContract.getDecimals(),
    cErc20MarketContract.getCurrentExchangeRate(),
    cErc20MarketContract.getProtocolUnderlyingBalance(),
    cErc20MarketContract.getSupplyAPY(network.blocksPerDay),
    cErc20MarketContract.getBorrowAPY(network.blocksPerDay),
    comptrollerContract.getMarketInfo(cErc20MarketAddress),
    comptrollerContract.matchHasEnteredMarket(cErc20MarketAddress),
  ])
  const underlyingValuesPromise = Promise.all([
    marketUnderlyingContract.getSymbol(),
    marketUnderlyingContract.normalizedBalanceOf(account),
    marketUnderlyingContract.allowance(account, cErc20MarketAddress),
    marketUnderlyingContract.getDecimals(),
    priceFeedOracleContract.getMarketDollarsPrice(
      cErc20MarketAddress,
      (await marketUnderlyingContract.getDecimals()) || DEFAULT_DECIMALS,
    ),
  ])

  const [marketValues, underlyingValues] = await Promise.all([
    marketValuesPromise,
    underlyingValuesPromise,
  ])

  const [
    balance,
    borrowedUnderlyingBalance,
    decimals,
    exchangeRate,
    protocolUnderlyingBalance,
    supplyAPY,
    borrowAPY,
    marketInfo,
    isEntered,
  ] = marketValues

  const [
    underlyingSymbol,
    underlyingBalance,
    underlyingAllowance,
    underlyingDecimals,
    underlyingDollarsPrice,
  ] = underlyingValues

  if (balance === undefined) {
    captureException(
      new Error(`Unable to retrieve balance for market ${cErc20MarketAddress}`),
    )
    return undefined
  }
  if (borrowedUnderlyingBalance === undefined) {
    captureException(
      new Error(
        `Unable to retrieve borrowed underlying balance for market ${cErc20MarketAddress}`,
      ),
    )
    return undefined
  }
  if (decimals === undefined) {
    captureException(
      new Error(
        `Unable to retrieve decimals for market ${cErc20MarketAddress}`,
      ),
    )
    return undefined
  }
  if (exchangeRate === undefined) {
    captureException(
      new Error(
        `Unable to retrieve exchange rate for market ${cErc20MarketAddress}`,
      ),
    )
    return undefined
  }
  if (protocolUnderlyingBalance === undefined) {
    captureException(
      new Error(
        `Unable to retrieve protocol underlying balance for market ${cErc20MarketAddress}`,
      ),
    )
    return undefined
  }
  if (supplyAPY === undefined) {
    captureException(
      new Error(
        `Unable to retrieve supply APY for market ${cErc20MarketAddress}`,
      ),
    )
    return undefined
  }
  if (borrowAPY === undefined) {
    captureException(
      new Error(
        `Unable to retrieve borrow APY for market ${cErc20MarketAddress}`,
      ),
    )
    return undefined
  }
  if (underlyingDollarsPrice === undefined) {
    captureException(
      new Error(
        `Unable to underlying dollars price for market ${cErc20MarketAddress}`,
      ),
    )
    return undefined
  }
  if (marketInfo === undefined) {
    captureException(
      new Error(
        `Unable to retrieve market info on comptroller for market ${cErc20MarketAddress}`,
      ),
    )
    return undefined
  }
  if (isEntered === undefined) {
    captureException(
      new Error(
        `Unable to retrieve membership on comptroller for market ${cErc20MarketAddress}`,
      ),
    )
    return undefined
  }

  return {
    address: cErc20MarketAddress,
    balance,
    borrowedUnderlyingBalance,
    decimals,
    exchangeRate,
    collateralFactor: marketInfo.collateralFactor.toNumber(),
    protocolUnderlyingBalance,
    supplyAPY,
    borrowAPY,
    underlyingSymbol,
    underlyingAddress: marketUnderlyingContract.address,
    underlyingBalance,
    underlyingAllowance,
    underlyingDecimals: underlyingDecimals || DEFAULT_DECIMALS,
    underlyingDollarsPrice: underlyingDollarsPrice.toNumber(),
    isEntered,
    isEnabled: underlyingAllowance !== 0,
    isNativeToken: false,
    enterMarket: () => {
      return comptrollerContract.enterMarket(cErc20MarketAddress)
    },
    enableMarket: () => {
      return marketUnderlyingContract.enableToken(cErc20MarketAddress)
    },
    supplyMarket: (underlyingAmount: ethers.BigNumber) => {
      return cErc20MarketContract.mint(underlyingAmount)
    },
    redeemMarket: (underlyingAmount: ethers.BigNumber) => {
      return cErc20MarketContract.redeem(underlyingAmount)
    },
    borrowMarket: (underlyingAmount: ethers.BigNumber) => {
      return cErc20MarketContract.borrow(underlyingAmount)
    },
    repayBorrowMarket: (underlyingAmount: ethers.BigNumber) => {
      return cErc20MarketContract.repayBorrow(underlyingAmount)
    },
    refreshMarket: async () => {
      return getCErc20MarketsViewData(
        cErc20MarketAddress,
        account,
        network,
        updateMarket,
      ).then((updatedMarket) => {
        if (updatedMarket !== undefined) {
          updateMarket(updatedMarket)
        }
      })
    },
  }
}

async function getCNativeTokenMarketViewData(
  cNativeTokenMarketAddress: string | undefined,
  account: string | undefined,
  network: { networkId: number; blocksPerDay: number },
  provider: providers.BaseProvider | undefined,
  updateMarket: (updatedMarket: CNativeTokenMarket) => void,
): Promise<CNativeTokenMarket | undefined> {
  // This means the cNativeToken market does not exist, so we just do not display it
  if (cNativeTokenMarketAddress === undefined) {
    return undefined
  }

  if (provider === undefined) {
    captureException(
      new Error(
        `Unable to retrieve provider to query underlying balance of market ${cNativeTokenMarketAddress}`,
      ),
    )
    return undefined
  }
  if (account === undefined) {
    captureException(
      new Error(
        `Unable to retrive account to query underlying balance of market ${cNativeTokenMarketAddress}`,
      ),
    )
    return undefined
  }

  const cNativeTokenContract = await CNativeToken.getInstance(
    cNativeTokenMarketAddress,
  )

  const comptrollerContract =
    await cNativeTokenContract.getComptrollerContract()

  if (comptrollerContract === undefined) {
    captureException(
      new Error(
        `Unable to retrieve comptroller contract for market ${cNativeTokenMarketAddress}`,
      ),
    )
    return undefined
  }

  const priceFeedOracleContract =
    await comptrollerContract.getPriceFeedOracleContract()

  if (priceFeedOracleContract === undefined) {
    captureException(
      new Error(
        `Unable to retrieve price feed oracle contract for market ${cNativeTokenMarketAddress}`,
      ),
    )
    return undefined
  }

  const underlyingSymbol = isPolygon(network.networkId)
    ? NATIVE_MATIC.symbol
    : NATIVE_ETH.symbol

  const underlyingDecimals = isPolygon(network.networkId)
    ? NATIVE_MATIC.decimals
    : NATIVE_ETH.decimals

  const marketValuesPromise = Promise.all([
    cNativeTokenContract.normalizedBalanceOf(account),
    cNativeTokenContract.getCurrentBorrowedBalance(underlyingDecimals),
    cNativeTokenContract.getDecimals(),
    cNativeTokenContract.getCurrentExchangeRate(underlyingDecimals),
    cNativeTokenContract.getProtocolUnderlyingBalance(underlyingDecimals),
    cNativeTokenContract.getSupplyAPY(network.blocksPerDay),
    cNativeTokenContract.getBorrowAPY(network.blocksPerDay),
    comptrollerContract.getMarketInfo(cNativeTokenMarketAddress),
    comptrollerContract.matchHasEnteredMarket(cNativeTokenMarketAddress),
  ])
  const underlyingValuesPromise = Promise.all([
    provider.getBalance(account),
    priceFeedOracleContract.getMarketDollarsPrice(
      cNativeTokenMarketAddress,
      underlyingDecimals,
    ),
  ])

  const [marketValues, underlyingValues] = await Promise.all([
    marketValuesPromise,
    underlyingValuesPromise,
  ])

  const [
    balance,
    borrowedUnderlyingBalance,
    decimals,
    exchangeRate,
    protocolUnderlyingBalance,
    supplyAPY,
    borrowAPY,
    marketInfo,
    isEntered,
  ] = marketValues

  const [nonNormalizedUnderlyingBalance, underlyingDollarsPrice] =
    underlyingValues

  if (balance === undefined) {
    captureException(
      new Error(
        `Unable to retrieve balance for market ${cNativeTokenMarketAddress}`,
      ),
    )
    return undefined
  }
  if (borrowedUnderlyingBalance === undefined) {
    captureException(
      new Error(
        `Unable to retrieve borrowed underlying balance for market ${cNativeTokenMarketAddress}`,
      ),
    )
    return undefined
  }
  if (decimals === undefined) {
    captureException(
      new Error(
        `Unable to retrieve decimals for market ${cNativeTokenMarketAddress}`,
      ),
    )
    return undefined
  }
  if (exchangeRate === undefined) {
    captureException(
      new Error(
        `Unable to retrieve exchange rate for market ${cNativeTokenMarketAddress}`,
      ),
    )
    return undefined
  }
  if (protocolUnderlyingBalance === undefined) {
    captureException(
      new Error(
        `Unable to retrieve protocol underlying balance for market ${cNativeTokenMarketAddress}`,
      ),
    )
    return undefined
  }
  if (supplyAPY === undefined) {
    captureException(
      new Error(
        `Unable to retrieve supply APY for market ${cNativeTokenMarketAddress}`,
      ),
    )
    return undefined
  }
  if (borrowAPY === undefined) {
    captureException(
      new Error(
        `Unable to retrieve borrow APY for market ${cNativeTokenMarketAddress}`,
      ),
    )
    return undefined
  }
  if (underlyingDollarsPrice === undefined) {
    captureException(
      new Error(
        `Unable to underlying dollars price for market ${cNativeTokenMarketAddress}`,
      ),
    )
    return undefined
  }
  if (marketInfo === undefined) {
    captureException(
      new Error(
        `Unable to retrieve market info on comptroller for market ${cNativeTokenMarketAddress}`,
      ),
    )
    return undefined
  }
  if (isEntered === undefined) {
    captureException(
      new Error(
        `Unable to retrieve membership on comptroller for market ${cNativeTokenMarketAddress}`,
      ),
    )
    return undefined
  }

  return {
    address: cNativeTokenMarketAddress,
    balance,
    borrowedUnderlyingBalance,
    decimals,
    exchangeRate,
    collateralFactor: marketInfo.collateralFactor.toNumber(),
    protocolUnderlyingBalance,
    supplyAPY,
    borrowAPY,
    underlyingSymbol,
    underlyingAddress: null,
    underlyingBalance: normalize(
      nonNormalizedUnderlyingBalance.toString(),
      underlyingDecimals,
    ),
    underlyingAllowance: null,
    underlyingDecimals,
    underlyingDollarsPrice: underlyingDollarsPrice.toNumber(),
    isEntered,
    isEnabled: true,
    isNativeToken: true,
    enterMarket: () => {
      return comptrollerContract.enterMarket(cNativeTokenMarketAddress)
    },
    enableMarket: null,
    supplyMarket: (underlyingAmount: ethers.BigNumber) => {
      return cNativeTokenContract.mint(underlyingAmount)
    },
    redeemMarket: (underlyingAmount: ethers.BigNumber) => {
      return cNativeTokenContract.redeem(underlyingAmount)
    },
    borrowMarket: (underlyingAmount: ethers.BigNumber) => {
      return cNativeTokenContract.borrow(underlyingAmount)
    },
    repayBorrowMarket: (underlyingAmount: ethers.BigNumber) => {
      return cNativeTokenContract.repayBorrow(underlyingAmount)
    },
    refreshMarket: async () => {
      return getCNativeTokenMarketViewData(
        cNativeTokenMarketAddress,
        account,
        network,
        provider,
        updateMarket,
      ).then((updatedMarket) => {
        if (updatedMarket !== undefined) {
          updateMarket(updatedMarket)
        }
      })
    },
  }
}

export function useComptrollerMarkets(
  contract: Comptroller | undefined,
): Market[] | undefined {
  const network = useNetwork()
  const provider = useObservable(provider$)
  const account = useAccount()

  const [allMarkets, setAllMarkets] = useState<Market[] | undefined>(undefined)

  useEffect(() => {
    if (
      contract === undefined ||
      provider === undefined ||
      account === undefined
    ) {
      return () => {}
    }

    const updateMarket = (updatedMarket: Market) => {
      setAllMarkets((currentAllMarkets) => {
        if (currentAllMarkets === undefined) {
          return undefined
        }
        return currentAllMarkets.map((market) => {
          if (isSameEthereumAddress(market.address, updatedMarket.address)) {
            return updatedMarket
          }
          return market
        })
      })
    }

    const getAllMarkets = async () => {
      const retrievedAllMarkets = await contract.getAllMarkets()

      if (retrievedAllMarkets === undefined) {
        captureException(
          new Error(
            `Unable to retrieve Comptroller markets for contract ${contract.address}`,
          ),
        )
        return
      }

      function matchIsNotUndefined<T>(value: T | undefined): value is T {
        return value !== undefined
      }

      // cErc20 handling
      const cErc20Markets = retrievedAllMarkets.filter((market) => {
        return isSameEthereumAddress(market, CNATIVE_TOKEN.address) === false
      })

      const allCErc20MarketsViewData = await Promise.all(
        cErc20Markets.map<Promise<CErc20Market | undefined>>(
          async (cErc20MarketAddress) => {
            if (account === undefined) {
              return undefined
            }

            return getCErc20MarketsViewData(
              cErc20MarketAddress,
              account,
              network,
              updateMarket,
            )
          },
        ),
      )

      // cNativeToken handling
      const cNativeTokenMarket = retrievedAllMarkets.find((market) => {
        return isSameEthereumAddress(market, CNATIVE_TOKEN.address)
      })

      const cNativeTokenMarketViewData = await getCNativeTokenMarketViewData(
        cNativeTokenMarket,
        account,
        network,
        provider,
        updateMarket,
      )

      const allMarketsViewData = [
        ...allCErc20MarketsViewData,
        cNativeTokenMarketViewData,
      ]

      setAllMarkets(allMarketsViewData.filter(matchIsNotUndefined))
    }

    getAllMarkets()

    window.addEventListener('focus', getAllMarkets)
    window.addEventListener('visibilitychange', getAllMarkets)

    return () => {
      window.removeEventListener('focus', getAllMarkets)
      window.removeEventListener('visibilitychange', getAllMarkets)
    }
  }, [contract, network, provider, account])

  return allMarkets
}
