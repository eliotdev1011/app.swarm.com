/* eslint-disable camelcase */
import useXDotcOffers from '@swarm/core/hooks/subgraph/x-dotc/useXDotcOffers'
import { unifyAddressToId, useAccount } from '@swarm/core/web3'
import { XOfferFilter } from '@swarm/types/x-subgraph/graphql'
import { getUnixTime } from 'date-fns'
import groupBy from 'lodash/groupBy'
import { useMemo, useRef } from 'react'
interface UseGoldOffersInDotcArgs {
  goldKgAddress?: string
  goldOzAddress?: string
  xGoldAddress?: string
}

const useGoldOffersInDotc = ({
  goldKgAddress,
  goldOzAddress,
  xGoldAddress,
}: UseGoldOffersInDotcArgs) => {
  const { current: currentTimestamp } = useRef(getUnixTime(Date.now()))

  const account = useAccount()

  const xDotcOffersSkip =
    !goldKgAddress || !goldOzAddress || !xGoldAddress || !account

  const xDotcOffersFilter = useMemo<XOfferFilter>(() => {
    if (xDotcOffersSkip) {
      return {}
    }

    const commonFilter = {
      isCompleted: false,
      cancelled: false,
      expiresAt_gt: currentTimestamp.toString(),
      maker: account,
    }

    return {
      or: [
        {
          ...commonFilter,
          depositAsset_: {
            address: unifyAddressToId(goldKgAddress),
          },
        },
        {
          ...commonFilter,
          depositAsset_: {
            address: unifyAddressToId(goldOzAddress),
          },
        },
        {
          ...commonFilter,
          depositAsset_: {
            address: unifyAddressToId(xGoldAddress),
          },
        },
      ],
    }
  }, [
    account,
    currentTimestamp,
    goldKgAddress,
    goldOzAddress,
    xDotcOffersSkip,
    xGoldAddress,
  ])

  const {
    offers: goldOffers,
    loadingOffers: goldOffersLoading,
    refetching: goldOffersRefetching,
  } = useXDotcOffers({
    variables: {
      filter: xDotcOffersFilter,
    },
    skip: xDotcOffersSkip,
  })

  const { goldKgOffers, goldOzOffers, xGoldOffers } = useMemo(() => {
    const offers = groupBy(goldOffers, 'depositAsset.address')

    return {
      goldKgOffers:
        (goldKgAddress && offers[unifyAddressToId(goldKgAddress)]) || [],
      goldOzOffers:
        (goldOzAddress && offers[unifyAddressToId(goldOzAddress)]) || [],
      xGoldOffers:
        (xGoldAddress && offers[unifyAddressToId(xGoldAddress)]) || [],
    }
  }, [goldKgAddress, goldOffers, goldOzAddress, xGoldAddress])

  return {
    goldKgOffers,
    goldOzOffers,
    xGoldOffers,
    loading: goldOffersLoading && goldOffersRefetching,
  }
}

export default useGoldOffersInDotc
