import { ApolloError } from '@apollo/client'
import useAsyncState from '@swarm/core/hooks/async/useAsyncState'
import useAssetTokens from '@swarm/core/hooks/data/useAssetTokens'
import useInvestAssets from '@swarm/core/hooks/data/useInvestAssets'
import useUserAccount from '@swarm/core/hooks/data/useUserAccount'
import useBreakpoints from '@swarm/core/hooks/ui/useBreakPoints'
import { getTokensFilter } from '@swarm/core/shared/subgraph'
import { recursiveRound } from '@swarm/core/shared/utils/math'
import {
  isSameEthereumAddress,
  unifyAddress,
  useAccount,
} from '@swarm/core/web3'
import { ChildrenProps } from '@swarm/types'
import {
  WalletBond,
  WalletBrandToken,
  WalletIndexToken,
  WalletStakingNode,
  WalletStockToken,
  WalletToken,
} from '@swarm/types/tokens'
import {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

import { useWalletHideSmallBalancesLocalStorage } from 'src/store/localStorage'

interface WalletsContextType {
  userUsdBalance: {
    nativeTokens: number
    poolTokens: number
    totalUsdBalance: number
  }
  setPoolTokensBalance: Dispatch<SetStateAction<number>>
  selectedAccount?: string
  setSelectedAccount?: Dispatch<SetStateAction<string | undefined>>
  hideSmallBalances: boolean
  toggleHideSmallBalances: (value?: boolean) => void
  assetTokens: WalletToken[]
  assetTokensLoading: boolean
  assetTokensError: ApolloError[]
  stakingNodes: WalletStakingNode[]
  stockTokens: WalletStockToken[]
  indexTokens: WalletIndexToken[]
  brandTokens: WalletBrandToken[]
  bonds: WalletBond[]
  investAssetsError?: ApolloError
  investAssetsLoading: boolean
}

const WalletsContext = createContext<WalletsContextType>({
  userUsdBalance: {
    nativeTokens: 0,
    poolTokens: 0,
    totalUsdBalance: 0,
  },
  setPoolTokensBalance: () => {},
  selectedAccount: undefined,
  setSelectedAccount: () => {},
  hideSmallBalances: false,
  toggleHideSmallBalances: () => {},
  assetTokens: [],
  assetTokensLoading: false,
  assetTokensError: [],
  stakingNodes: [],
  stockTokens: [],
  brandTokens: [],
  indexTokens: [],
  bonds: [],
  investAssetsLoading: false,
  investAssetsError: undefined,
})

export const useWalletsContext = () => useContext(WalletsContext)

export const WalletsContextProvider: FC<ChildrenProps> = (props) => {
  const account = useAccount()
  const [selectedAccount, setSelectedAccount] = useState<string | undefined>(
    account ? unifyAddress(account) : account,
  )
  const userAccount = useUserAccount(selectedAccount)
  const [poolTokensUsdBalance, setPoolTokensUsdBalance] = useAsyncState(0)

  const {
    tokens: assetTokens,
    loading: assetTokensLoading,
    errors: assetTokensError,
  } = useAssetTokens(
    userAccount,
    getTokensFilter('Token', {
      isLPT: false,
      paused: false,
    }),
  )

  const nativeTokensUsdBalance = useMemo(() => {
    const rawTotal = assetTokens.reduce(
      (total, { userBalances }) => total + (userBalances?.usd ?? 0),
      0,
    )
    return recursiveRound<number>(rawTotal)
  }, [assetTokens])

  const totalUsdBalance = useMemo(
    () => nativeTokensUsdBalance + poolTokensUsdBalance,
    [nativeTokensUsdBalance, poolTokensUsdBalance],
  )

  const { isSm, isXs } = useBreakpoints()
  const { value: hideSmallBalances, setValue: setHideSmallBalances } =
    useWalletHideSmallBalancesLocalStorage()

  const toggleHideSmallBalances = useCallback(
    (value?: boolean) => {
      if (isSm || isXs) {
        return
      }

      if (typeof value === 'boolean') {
        setHideSmallBalances(value)
      } else {
        setHideSmallBalances((prevValue) => !prevValue)
      }
    },
    [isSm, isXs, setHideSmallBalances],
  )

  const {
    investAssets,
    stakingNodes,
    stockTokens,
    indexTokens,
    bonds,
    investAssetsError,
    investAssetsLoading,
    brandingTokens,
  } = useInvestAssets()

  const assetTokensWithoutInvestTokens = useMemo(
    () =>
      assetTokens.filter(
        (walletToken) =>
          !investAssets?.some((investAsset) =>
            isSameEthereumAddress(walletToken.id, investAsset.id),
          ),
      ),
    [assetTokens, investAssets],
  )

  const walletStakingToken = useMemo(
    () =>
      stakingNodes.map((stakingNode) => {
        const walletToken = assetTokens.find(({ id }) =>
          isSameEthereumAddress(id, stakingNode.id),
        )

        return {
          ...stakingNode,
          ...walletToken,
        }
      }),
    [stakingNodes, assetTokens],
  )

  const walletStockToken = useMemo(
    () =>
      stockTokens.map((stockToken) => {
        const walletToken = assetTokens.find(({ id }) =>
          isSameEthereumAddress(id, stockToken.id),
        )
        return {
          ...stockToken,
          ...walletToken,
        }
      }),
    [stockTokens, assetTokens],
  )

  const walletBonds = useMemo(
    () =>
      bonds.map((stockToken) => {
        const walletToken = assetTokens.find(({ id }) =>
          isSameEthereumAddress(id, stockToken.id),
        )
        return {
          ...stockToken,
          ...walletToken,
        }
      }),
    [bonds, assetTokens],
  )

  const walletIndexTokens = useMemo(
    () =>
      indexTokens.map((stockToken) => {
        const walletToken = assetTokens.find(({ id }) =>
          isSameEthereumAddress(id, stockToken.id),
        )
        return {
          ...stockToken,
          ...walletToken,
        }
      }),
    [indexTokens, assetTokens],
  )

  const walletBrandTokens = useMemo(
    () =>
      brandingTokens.map((stockToken) => {
        const walletToken = assetTokens.find(({ id }) =>
          isSameEthereumAddress(id, stockToken.id),
        )
        return {
          ...stockToken,
          ...walletToken,
        }
      }),
    [brandingTokens, assetTokens],
  )

  const value = useMemo(() => {
    return {
      userUsdBalance: {
        nativeTokens: nativeTokensUsdBalance,
        poolTokens: poolTokensUsdBalance,
        totalUsdBalance,
      },
      setPoolTokensBalance: setPoolTokensUsdBalance,
      selectedAccount,
      setSelectedAccount,
      hideSmallBalances: isSm || isXs || hideSmallBalances,
      toggleHideSmallBalances,
      assetTokens: assetTokensWithoutInvestTokens,
      assetTokensLoading,
      assetTokensError,
      stakingNodes: walletStakingToken as WalletStakingNode[],
      stockTokens: walletStockToken as WalletStockToken[],
      indexTokens: walletIndexTokens as WalletIndexToken[],
      bonds: walletBonds as WalletBond[],
      brandTokens: walletBrandTokens as WalletBrandToken[],
      investAssetsError,
      investAssetsLoading,
    }
  }, [
    nativeTokensUsdBalance,
    poolTokensUsdBalance,
    totalUsdBalance,
    setPoolTokensUsdBalance,
    selectedAccount,
    isSm,
    isXs,
    hideSmallBalances,
    toggleHideSmallBalances,
    assetTokensWithoutInvestTokens,
    assetTokensLoading,
    assetTokensError,
    walletStakingToken,
    walletStockToken,
    walletIndexTokens,
    walletBonds,
    walletBrandTokens,
    investAssetsError,
    investAssetsLoading,
  ])

  return <WalletsContext.Provider value={value} {...props} />
}
