import { SwapHoriz } from '@rimble/icons'
import { FlaggedFeatureName } from '@swarm/core/hooks/data/useFeatureFlags'
import { AllowanceStatus } from '@swarm/core/shared/enums'
import { RouterLink } from '@swarm/ui/presentational/RouterLink'
import FlaggedFeature from '@swarm/ui/swarm/FlaggedFeature'
import SvgIcon from '@swarm/ui/swarm/SvgIcon'
import { providers } from 'ethers'
import isNil from 'lodash/isNil'
import { memo, MouseEvent, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Flex, Loader, Text } from 'rimble-ui'

import AssetMenu from '../AssetMenu'

interface StockTokenActionsProps {
  symbol: string
  name: string
  allowanceStatus: AllowanceStatus
  enable: () => Promise<providers.TransactionResponse>
  disable: () => Promise<providers.TransactionResponse>
  id: string
  onRedeemClick?: () => void
  isPerformingAnAction: boolean
  setIsPerformingAnAction: (isPerformingAnAction: boolean) => void
  isRedeemDisabled?: boolean
}

const StockTokenActions = ({
  symbol,
  name,
  enable,
  disable,
  allowanceStatus,
  id,
  onRedeemClick,
  isPerformingAnAction,
  setIsPerformingAnAction,
  isRedeemDisabled = false,
}: StockTokenActionsProps) => {
  const { t } = useTranslation('common')
  const [isLoading, setIsLoading] = useState(isNil(allowanceStatus))

  useEffect(() => {
    if (!isNil(allowanceStatus)) {
      setIsLoading(false)
    }
  }, [allowanceStatus])

  if (isLoading || isPerformingAnAction) {
    return <Loader m="auto" />
  }

  return (
    <>
      <FlaggedFeature name={FlaggedFeatureName.swapService}>
        <RouterLink pathname="/swap" queryParams={{ tokenIn: id }}>
          <Button height="28px" px={2}>
            <SwapHoriz size="18px" mr={1} /> {t('token.swap')}
          </Button>
        </RouterLink>
      </FlaggedFeature>
      <FlaggedFeature name={FlaggedFeatureName.allPools}>
        <RouterLink pathname="/pools/all" queryParams={{ assets: id }}>
          <Button height="28px" px={2} ml={1}>
            <Text.span mr={1} lineHeight="20px">
              <SvgIcon name="Pool" height="18px" width="18px" />
            </Text.span>
            <Text.span fontWeight={3} lineHeight="20px">
              {t('token.pool')}
            </Text.span>
          </Button>
        </RouterLink>
      </FlaggedFeature>
      <Flex justifyContent="center" alignItems="center">
        <Button
          height="28px"
          px={2}
          ml={1}
          alignItems="center"
          onClick={(e: MouseEvent) => {
            e.stopPropagation()
            onRedeemClick?.()
          }}
          disabled={isRedeemDisabled}
        >
          <SvgIcon name="RedeemIcon" height="18px" width="18px" fill="white" />
          <Text.span fontWeight={3} lineHeight="20px" fontSize={1} ml={1}>
            {t('common:token.redeem')}
          </Text.span>
        </Button>
      </Flex>
      <AssetMenu
        symbol={symbol}
        name={name}
        enable={enable}
        disable={disable}
        allowanceStatus={allowanceStatus}
        setIsPerformingAnAction={setIsPerformingAnAction}
      />
    </>
  )
}

export default memo(StockTokenActions)
