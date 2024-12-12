import useFeatureFlags, {
  FlaggedFeatureName,
} from '@swarm/core/hooks/data/useFeatureFlags'
import { prettifyBalance } from '@swarm/core/shared/utils'
import { SmtContext } from '@swarm/core/state/SmtContext'
import { useContext } from 'react'
import { Loader } from 'rimble-ui'
import styled from 'styled-components/macro'

import RewardsIcon from './Icons/RewardsIcon'

const RewardsWalletBalance = styled.div<SmtRewardsProps>`
  display: flex;
  background-color: ${({ theme }) => theme.colors['off-white']};
  border-radius: 76px;
  flex-direction: row;
  align-items: center;
  padding: 3px 4px 3px 3px;
  cursor: pointer;
  margin-right: 12px;
`

const RewardsLabel = styled.div`
  flex: 1;
  align-items: center;
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  padding: 0 8px;
`

interface SmtRewardsProps {
  onClick: () => void
}

const SmtRewardsBadge = ({ onClick }: SmtRewardsProps) => {
  const { checkFeature } = useFeatureFlags()
  const {
    smtBalance: {
      balanceLoading,
      total: { erc20: smtSummaryBalance },
    },
  } = useContext(SmtContext)

  if (!checkFeature(FlaggedFeatureName.smtRewardsBadge)) return <></>

  return (
    <RewardsWalletBalance onClick={onClick}>
      <RewardsIcon
        wrapBackground="#2b79ef"
        wrapHeight="26px"
        wrapWidth="26px"
        width="15px"
        height="11px"
      />
      <RewardsLabel>
        {balanceLoading ? (
          <Loader />
        ) : (
          prettifyBalance(smtSummaryBalance || 0, 0)
        )}
      </RewardsLabel>
    </RewardsWalletBalance>
  )
}

export default SmtRewardsBadge
