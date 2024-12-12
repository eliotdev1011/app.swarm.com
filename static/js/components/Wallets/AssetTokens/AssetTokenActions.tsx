import { SwapHoriz } from '@rimble/icons'
import { FlaggedFeatureName } from '@swarm/core/hooks/data/useFeatureFlags'
import { networksBridges } from '@swarm/core/shared/consts'
import {
  bridgeableChainIds,
  bridgeableTokens,
} from '@swarm/core/shared/consts/bridgeable'
import { isNativeToken } from '@swarm/core/shared/utils/tokens/filters'
import { useStoredNetworkId } from '@swarm/core/web3'
import { AssetTokenActionsProps } from '@swarm/types/props'
import { RouterLink } from '@swarm/ui/presentational/RouterLink'
import FlaggedFeature from '@swarm/ui/swarm/FlaggedFeature'
import SvgIcon from '@swarm/ui/swarm/SvgIcon'
import isNil from 'lodash/isNil'
import React, { memo, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Loader, Text } from 'rimble-ui'

import AssetMenu from '../AssetMenu'

type Props = AssetTokenActionsProps & {
  isPerformingAnAction: boolean
  setIsPerformingAnAction: (isPerformingAnAction: boolean) => void
}

const AssetTokenActions: React.FC<Props> = ({
  id,
  symbol,
  name,
  allowanceStatus,
  enable,
  disable,
  isPerformingAnAction,
  setIsPerformingAnAction,
}: Props) => {
  const { t } = useTranslation('wallets')
  const [isLoading, setIsLoading] = useState(isNil(allowanceStatus))
  const networkId = useStoredNetworkId()

  const openBridge = () => {
    window.open(networksBridges.polygon.url, '_blank')
  }

  useEffect(() => {
    if (!isNil(allowanceStatus)) {
      setIsLoading(false)
    }
  }, [allowanceStatus])

  if (isLoading || isPerformingAnAction) {
    return <Loader m="auto" />
  }

  if (isNativeToken({ id })) {
    return (
      <RouterLink pathname="/swap" queryParams={{ tokenIn: id }}>
        <Button height="28px" px={2}>
          <SwapHoriz size="18px" mr={1} /> {t('assetTokens.actions.wrap')}
        </Button>
      </RouterLink>
    )
  }

  return (
    <>
      <FlaggedFeature name={FlaggedFeatureName.swapService}>
        <RouterLink pathname="/swap" queryParams={{ tokenIn: id }}>
          <Button height="28px" px={2}>
            <SwapHoriz size="18px" mr={1} /> {t('assetTokens.actions.swap')}
          </Button>
        </RouterLink>{' '}
      </FlaggedFeature>
      <FlaggedFeature name={FlaggedFeatureName.allPools}>
        <RouterLink pathname="/pools/all" queryParams={{ assets: id }}>
          <Button height="28px" px={2} ml={3}>
            <Text.span mr={1} lineHeight="20px">
              <SvgIcon name="Pool" height="18px" width="18px" />
            </Text.span>
            <Text.span fontWeight={3} lineHeight="20px">
              {t('assetTokens.actions.pool')}
            </Text.span>
          </Button>
        </RouterLink>
      </FlaggedFeature>
      {bridgeableChainIds.includes(networkId) &&
        bridgeableTokens.includes(symbol.toLocaleLowerCase()) && (
          <Button height="28px" px={2} ml={3} onClick={openBridge}>
            <Text.span fontWeight={3} lineHeight="20px">
              {t('assetTokens.actions.bridge')}
            </Text.span>
            <Text.span ml={1} pt="2px" lineHeight="16px">
              <SvgIcon name="PolygonIcon" height="16px" width="16px" />
            </Text.span>
          </Button>
        )}
      <AssetMenu
        symbol={symbol}
        name={name}
        allowanceStatus={allowanceStatus}
        enable={enable}
        disable={disable}
        setIsPerformingAnAction={setIsPerformingAnAction}
      />
    </>
  )
}

export default memo(AssetTokenActions)
