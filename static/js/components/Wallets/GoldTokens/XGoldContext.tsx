/* eslint-disable camelcase */
import { XGoldInfo } from '@swarm/core/contracts/XGoldBundleStorage'
import useXGold from '@swarm/core/hooks/data/useXGold'
import useXGoldInfo from '@swarm/core/hooks/data/useXGoldInfo'
import { useToggle } from '@swarm/core/hooks/state/useToggle'
import useUserHoldings from '@swarm/core/hooks/subgraph/sx1155/useUserHoldings'
import { getCurrentConfig } from '@swarm/core/observables/configForNetwork'
import useTokenMetadata from '@swarm/core/services/alchemy/useTokenMetadata'
import { TokenType } from '@swarm/core/shared/enums'
import { unifyAddressToId, useAccount } from '@swarm/core/web3'
import { ChildrenProps } from '@swarm/types'
import { NormalizedUserHolding } from '@swarm/types/normalized-entities/user-holding'
import { NormalizedXOffer } from '@swarm/types/normalized-entities/x-offer'
import { AlchemyToken, HasKya } from '@swarm/types/tokens'
import { UserHoldingFilter } from '@swarm/types/x-subgraph/graphql'
import { createContext, useContext, useState } from 'react'

import XGoldAddModal from './XGoldAddModal'
import XGoldAddedSuccessfullyModal, {
  XGoldAddedSuccessfullyModalProps,
} from './XGoldAddedSuccessfullyModal'
import XGoldNftsWithdrawnSuccessfullyModal, {
  XGoldNftsWithdrawnSuccessfullyModalProps,
} from './XGoldNftsWithdrawnSeccesfullyModal'
import XGoldWithdrawModal from './XGoldWithdrawModal'
import useGoldOffersInDotc from './hooks/useGoldOffersInDotc'

interface XGoldContextType extends XGoldInfo {
  loading: boolean
  error: boolean
  goldNfts: NormalizedUserHolding[]
  goldNftsInBundle: NormalizedUserHolding[]
  xGold: (AlchemyToken & HasKya) | null
  xGoldKg: AlchemyToken | null
  xGoldOz: AlchemyToken | null
  xGoldOffersInDotc: NormalizedXOffer[]
  goldKgOffersInDotc: NormalizedXOffer[]
  goldOzOffersInDotc: NormalizedXOffer[]
  openAddToBandleModal: () => void
  openWithdrawModal: () => void
  openAddedSuccessfullyModal: (
    modalProps: Pick<
      XGoldAddedSuccessfullyModalProps,
      'txHash' | 'nftsCount' | 'xGoldAmount'
    >,
  ) => void
  openWithdrawnSuccessfullyModal: (
    modalProps: Pick<
      XGoldNftsWithdrawnSuccessfullyModalProps,
      'txHash' | 'goldKgNfts' | 'goldOzNfts'
    >,
  ) => void
}

const XGoldContext = createContext<XGoldContextType>({
  loading: true,
  error: false,
  goldNfts: [],
  goldNftsInBundle: [],
  xGold: null,
  xGoldKg: null,
  xGoldOz: null,
  xGoldOffersInDotc: [],
  goldKgOffersInDotc: [],
  goldOzOffersInDotc: [],
  openAddToBandleModal: () => {},
  openWithdrawModal: () => {},
  openAddedSuccessfullyModal: () => {},
  openWithdrawnSuccessfullyModal: () => {},
})

const { xGoldBundleAddress } = getCurrentConfig()

export const XGoldContextProvider = ({ children }: ChildrenProps) => {
  const account = useAccount()
  const {
    goldKgAddress,
    goldOzAddress,
    xGoldTokensForGoldKg,
    xGoldTokensForGoldOz,
    loading: bundleInfoLoading,
    error: bundleInfoError,
  } = useXGoldInfo()

  const {
    goldKgOffers,
    goldOzOffers,
    xGoldOffers,
    loading: goldOffersInDotcLoading,
  } = useGoldOffersInDotc({
    goldKgAddress,
    goldOzAddress,
    xGoldAddress: xGoldBundleAddress,
  })

  const { token: xGoldKg } = useTokenMetadata(goldKgAddress, {
    type: TokenType.erc1155,
  })
  const { token: xGoldOz } = useTokenMetadata(goldOzAddress, {
    type: TokenType.erc1155,
  })

  const skip = !goldKgAddress || !goldOzAddress
  const goldNftsSkip = !account || skip

  const getFilter = (userAccount?: string): UserHoldingFilter => {
    return skip || !userAccount
      ? {}
      : {
          or: [
            {
              user_contains: unifyAddressToId(userAccount),
              tokenId_contains: unifyAddressToId(goldKgAddress),
            },
            {
              user_contains: unifyAddressToId(userAccount),
              tokenId_contains: unifyAddressToId(goldOzAddress),
            },
          ],
        }
  }

  const {
    userHoldings: goldNfts,
    loadingUserHoldings: goldNftsLoading,
    error: goldNftsError,
    refetching: goldNftsRefetching,
  } = useUserHoldings({
    variables: {
      filter: getFilter(account),
    },
    skip: goldNftsSkip,
  })
  const {
    userHoldings: goldNftsInBundle,
    loadingUserHoldings: goldNftsInBundleLoading,
    error: goldNftsInBundleError,
    refetching: goldNftsInBundleRefetching,
  } = useUserHoldings({
    variables: {
      filter: getFilter(xGoldBundleAddress),
    },
    skip,
  })

  const { token: xGold, loading: xGoldLoading } = useXGold()

  const [addedModalProps, setAddedModalProps] =
    useState<
      Pick<
        XGoldAddedSuccessfullyModalProps,
        'txHash' | 'nftsCount' | 'xGoldAmount'
      >
    >()
  const [withdrawnModalProps, setWithdrawnModalProps] =
    useState<
      Pick<
        XGoldNftsWithdrawnSuccessfullyModalProps,
        'txHash' | 'goldKgNfts' | 'goldOzNfts'
      >
    >()

  const { isOn, on, off } = useToggle()
  const {
    isOn: isOpenAddedSuccessModal,
    on: openAddedSuccessModal,
    off: closeAddedSuccessModal,
  } = useToggle()
  const {
    isOn: isOpenWithdrawnSuccessModal,
    on: openWithdrawnSuccessModal,
    off: closeWithdrawSuccessModal,
  } = useToggle()
  const {
    isOn: isOpenWithdrawModal,
    on: openWithdrawModal,
    off: closeWithdrawModal,
  } = useToggle()

  const openAddToBandleModal = () => {
    on()
  }

  const openAddedSuccessfullyModal = (
    modalProps: Pick<
      XGoldAddedSuccessfullyModalProps,
      'txHash' | 'nftsCount' | 'xGoldAmount'
    >,
  ) => {
    setAddedModalProps(modalProps)
    openAddedSuccessModal()
  }

  const openWithdrawnSuccessfullyModal = (
    modalProps: Pick<
      XGoldNftsWithdrawnSuccessfullyModalProps,
      'txHash' | 'goldKgNfts' | 'goldOzNfts'
    >,
  ) => {
    setWithdrawnModalProps(modalProps)
    openWithdrawnSuccessModal()
  }

  return (
    <XGoldContext.Provider
      value={{
        goldKgAddress,
        goldOzAddress,
        xGoldTokensForGoldKg,
        xGoldTokensForGoldOz,
        xGold,
        xGoldKg,
        xGoldOz,
        goldNfts,
        goldNftsInBundle,
        goldKgOffersInDotc: goldKgOffers,
        goldOzOffersInDotc: goldOzOffers,
        xGoldOffersInDotc: xGoldOffers,
        loading:
          (goldNftsLoading && goldNftsRefetching) ||
          (goldNftsInBundleLoading && goldNftsInBundleRefetching) ||
          bundleInfoLoading ||
          xGoldLoading ||
          goldOffersInDotcLoading,
        error: !!goldNftsInBundleError || !!goldNftsError || !!bundleInfoError,
        openAddToBandleModal,
        openAddedSuccessfullyModal,
        openWithdrawModal,
        openWithdrawnSuccessfullyModal,
      }}
    >
      {children}
      <XGoldAddModal isOpen={isOn} onClose={off} />
      <XGoldWithdrawModal
        isOpen={isOpenWithdrawModal}
        onClose={closeWithdrawModal}
      />
      {addedModalProps && (
        <XGoldAddedSuccessfullyModal
          isOpen={isOpenAddedSuccessModal}
          onClose={closeAddedSuccessModal}
          {...addedModalProps}
        />
      )}
      {withdrawnModalProps && (
        <XGoldNftsWithdrawnSuccessfullyModal
          isOpen={isOpenWithdrawnSuccessModal}
          onClose={closeWithdrawSuccessModal}
          {...withdrawnModalProps}
        />
      )}
    </XGoldContext.Provider>
  )
}

export const useXGoldContext = () => useContext(XGoldContext)
