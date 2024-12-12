import { SmtPriceFeed } from '@swarm/core/contracts/SmtPriceFeed'
import useAsyncMemo from '@swarm/core/hooks/async/useAsyncMemo'
import useFeatureFlags, {
  FlaggedFeatureName,
} from '@swarm/core/hooks/data/useFeatureFlags'
import { big } from '@swarm/core/shared/utils/helpers/big-helpers'
import { ExtendedNativeToken } from '@swarm/types/tokens'
import AngledSwitch from '@swarm/ui/presentational/AngledSwitch'
import { BigSource } from 'big.js'
import { Dispatch, SetStateAction, useEffect, useMemo } from 'react'

import { useSwapContext } from 'src/components/Swap/SwapContext'

interface DiscountSwitchProps {
  checked: boolean
  setChecked: Dispatch<SetStateAction<boolean>>
  feeAmount: BigSource
  utilityToken?: ExtendedNativeToken
  isDisabled?: boolean
}

const DiscountSwitch = ({
  checked,
  setChecked,
  utilityToken,
  feeAmount,
  isDisabled = false,
}: DiscountSwitchProps) => {
  const { checkFeature } = useFeatureFlags()
  const {
    tokenIn,
    settings: { autoPaySmtDiscount },
  } = useSwapContext()

  const toggleDiscount = () => setChecked((prev) => !prev)

  const [isDiscountAvailable] = useAsyncMemo(
    async () => {
      if (!checkFeature(FlaggedFeatureName.swapSmtDiscount)) {
        return false
      }

      if (tokenIn?.xToken?.id) {
        const assetPrice = await SmtPriceFeed.getPrice(tokenIn.xToken.id)
        return assetPrice.gt(0)
      }

      return autoPaySmtDiscount
    },
    autoPaySmtDiscount,
    [tokenIn?.xToken?.id],
  )

  useEffect(() => {
    if (!isDiscountAvailable && checked) {
      setChecked(false)
    }
  }, [isDiscountAvailable, checked, setChecked])

  useEffect(() => {
    if (autoPaySmtDiscount && isDiscountAvailable) {
      setChecked(true)
    }
  }, [autoPaySmtDiscount, isDiscountAvailable, setChecked])

  useEffect(() => {
    if (!autoPaySmtDiscount) {
      setChecked(false)
    }
  }, [autoPaySmtDiscount, isDiscountAvailable, setChecked])

  useEffect(() => {
    if (
      checked &&
      utilityToken?.balance &&
      big(feeAmount).gt(utilityToken.balance)
    ) {
      setChecked(false)
    }
  }, [checked, setChecked, utilityToken?.balance, feeAmount])

  const isDiscountDisabled = useMemo(
    () =>
      isDisabled ||
      !(
        isDiscountAvailable &&
        utilityToken?.balance &&
        big(feeAmount).lt(utilityToken.balance)
      ),
    [isDisabled, isDiscountAvailable, utilityToken?.balance, feeAmount],
  )

  return (
    <AngledSwitch
      disabled={isDiscountDisabled}
      checked={checked}
      onChange={toggleDiscount}
    />
  )
}

export default DiscountSwitch
