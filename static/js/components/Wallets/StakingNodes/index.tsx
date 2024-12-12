import { ExpandMore } from '@rimble/icons'
import config from '@swarm/core/config'
import useUserAccount from '@swarm/core/hooks/data/useUserAccount'
import usePopupState from '@swarm/core/hooks/state/usePopupState'
import { balancesLoading } from '@swarm/core/shared/utils/tokens/balance'
import { useAccount, useNetwork, useReadyState } from '@swarm/core/web3'
import { WalletStakingNode } from '@swarm/types/tokens'
import { HighlightProvider } from '@swarm/ui/presentational/HighlightProvider'
import InfoLink from '@swarm/ui/presentational/InfoLink'
import Section from '@swarm/ui/presentational/Section'
import StyledTable from '@swarm/ui/presentational/StyledTable'
import TableInfoRow from '@swarm/ui/presentational/Table/TableInfoRow'
import Tooltip from '@swarm/ui/presentational/Tooltip'
import { SyntheticEvent, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Flex } from 'rimble-ui'
import { MarginProps } from 'styled-system'

import StakingNodeRedeemModal, {
  StakingNodeRedeemModalProps,
} from 'src/components/Invest/LiquidStaking/StakingNodeRedeemModal'

import { useWalletsContext } from '../WalletsContext'

import StakingNodeRow from './StakingNodeRow'
import StakingNodesHead from './StakingNodesHead'

const { getCrypto: getCryptoLink } = config.resources.docs.gettingStarted

const StakingNodes = (props: MarginProps) => {
  const { t } = useTranslation('wallets')
  const account = useAccount()
  const ready = useReadyState()
  const {
    selectedAccount,
    stakingNodes,
    investAssetsLoading,
    investAssetsError,
  } = useWalletsContext()
  const userAccount = useUserAccount(selectedAccount)
  const { networkName } = useNetwork()
  const [amountToDisplay, setAmountToDisplay] = useState<number>(3)

  const redeemModal = usePopupState<StakingNodeRedeemModalProps>(
    false,
    StakingNodeRedeemModal,
  )

  const areBalancesLoading = balancesLoading(stakingNodes, account)

  const onLoadMore = (event: SyntheticEvent) => {
    event.stopPropagation()
    setAmountToDisplay((displayed) => displayed + 3)
  }

  const disconnected = !account
  const loading = investAssetsLoading || !ready || areBalancesLoading
  const hasError = !!investAssetsError
  const noResults = !hasError && !stakingNodes.length

  const handleOnRedeemClick = useCallback(
    (asset: WalletStakingNode) => redeemModal.open({ asset }),
    [redeemModal],
  )

  if (noResults) {
    return null
  }

  return (
    <Section
      title={t('stakingNodes.header', { network: networkName })}
      {...props}
    >
      <Box mt={[3, '24px']}>
        <StyledTable>
          <StakingNodesHead />
          <tbody>
            <TableInfoRow
              span={5}
              show={!loading && noResults}
              loading={loading && noResults}
              error={
                (disconnected && t('queryStatuses.noAccount')) ||
                (hasError && t('queryStatuses.error'))
              }
            >
              {t('queryStatuses.noResults')}
              <InfoLink
                href={getCryptoLink}
                title={t('queryStatuses.getCrypto')}
              >
                {t('queryStatuses.getCrypto')}
              </InfoLink>
            </TableInfoRow>
            <HighlightProvider>
              {!disconnected &&
                stakingNodes
                  .slice(0, amountToDisplay)
                  .map((token, index) => (
                    <StakingNodeRow
                      key={token.id}
                      rowIndex={index}
                      tokenToRender={token}
                      selectedAccount={userAccount}
                      onRedeemClick={handleOnRedeemClick}
                    />
                  ))}
            </HighlightProvider>
          </tbody>
        </StyledTable>

        {stakingNodes.length > amountToDisplay && (
          <Flex alignItems="center" justifyContent="center" mt={3}>
            <Tooltip placement="top" message="Load more">
              <ExpandMore
                onClick={onLoadMore}
                cursor="pointer"
                color="near-black"
              />
            </Tooltip>
          </Flex>
        )}
      </Box>
      {redeemModal.modal}
    </Section>
  )
}

export default StakingNodes
