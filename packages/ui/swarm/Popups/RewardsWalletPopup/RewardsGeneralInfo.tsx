import { ArrowForward } from '@rimble/icons'
import { SmtDistributor } from '@swarm/core/contracts/SmtDistributor'
import useTransactionAlerts from '@swarm/core/hooks/i18n/useTransactionAlerts'
import { prettifyBalance } from '@swarm/core/shared/utils'
import wait from '@swarm/core/shared/utils/helpers/wait'
import { recursiveRound } from '@swarm/core/shared/utils/math'
import { SmtContext } from '@swarm/core/state/SmtContext'
import { useAccount } from '@swarm/core/web3'
import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Button, Flex, Loader } from 'rimble-ui'
import styled from 'styled-components/macro'

import { useTheme } from '@swarm/ui/theme/useTheme'
import { useFireworks } from '@ui/presentational/Fireworks'
import RewardsIcon from '@ui/swarm/Icons/RewardsIcon'
import { Color } from '@ui/theme'

interface RewardsGeneralInfoProps {
  handleChangeTab: (index: number) => void
}

const InfoHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 8px 0;
`

const InfoContent = styled.div`
  margin: 20px 0 32px 0;
`

const InfoContentItem = styled.div`
  display: flex;
  padding: 17px 0;
  justify-content: space-between;
  border-bottom: 1px solid ${(props) => props.theme.colors.greyBackground};
`

const InfoContentItemLabel = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  color: #9fa3bc;
`

const InfoContentValueLabel = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  line-height: 26px;
  color: ${(props) => props.color || Color.black};
`

const TitleInfoLabel = styled.p`
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  line-height: 28px;
  color: ${(props) => props.color || props.theme.colors.primary};
  margin: 8px 0 0 0;
`

const PriceInfoLabel = styled.p`
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  line-height: 26px;
  color: ${(props) => props.color || props.theme.colors.grey};
  margin: 0;
`

const BalanceInfoLabel = styled.p`
  font-style: normal;
  font-weight: bold;
  font-size: 32px;
  line-height: 40px;
  color: ${Color.black};
  margin: 5px 0 0 0;
`

const TokenInfoLink = styled.div`
  display: flex;
  align-items: center;
  margin-top: 5px;
  cursor: pointer;
`

const TokenInfoLinkLabel = styled.p`
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  color: #9fa3bc;
  margin: 0 2px 0 0;
  display: block;
`

const RewardsGeneralInfo = ({ handleChangeTab }: RewardsGeneralInfoProps) => {
  const [claimableBalanceLoading, setClaimableBalanceLoading] = useState(false)
  const { t } = useTranslation('pools')
  const { track } = useTransactionAlerts()
  const theme = useTheme()
  const {
    price,
    smtBalance: {
      balanceLoading,
      total: smtSummaryBalance,
      wallet: smtWalletBalance,
      unclaimed: {
        erc20: claimableSmt,
        erc20CPK: claimableCpkSmt,
        reload: reloadSmtClaimableBalance,
      },
      claimInProgress,
      setClaimInProgress,
    },
  } = useContext(SmtContext)
  const account = useAccount()
  const { showFireworks } = useFireworks()

  const handleClaimSMT = async () => {
    if (!account) {
      return
    }

    setClaimInProgress(true)
    try {
      const tx = await SmtDistributor.claimRewards(account)

      setClaimableBalanceLoading(true)
      await track(tx)

      await wait(2000)

      await reloadSmtClaimableBalance()

      showFireworks(5000)
    } catch {
      // TODO: handle errors
    } finally {
      setClaimInProgress(false)
      setClaimableBalanceLoading(false)
    }
  }

  const claimBtnText =
    claimableCpkSmt !== 0
      ? t('rewardsBalance.claimCpkBtnText', {
          balance:
            claimableCpkSmt !== 0
              ? prettifyBalance(claimableCpkSmt || 0, 0)
              : '',
        })
      : t('rewardsBalance.claimBtnText', {
          balance: claimableSmt !== 0 ? prettifyBalance(claimableSmt, 0) : '',
        })

  return (
    <Box mb={4}>
      <InfoHeader>
        <RewardsIcon />
        <TitleInfoLabel>{t('rewardsBalance.smtBalance')}</TitleInfoLabel>
        <TokenInfoLink onClick={() => handleChangeTab(2)}>
          <TokenInfoLinkLabel>
            {t('rewardsBalance.tokenInfo')}
          </TokenInfoLinkLabel>
          <ArrowForward size="20px" color={theme.colors.icon.primary} />
        </TokenInfoLink>
        {balanceLoading || claimableBalanceLoading ? (
          <Flex justifyContent="center" alignItems="center" height="71px">
            <Loader size="medium" />
          </Flex>
        ) : (
          <>
            <BalanceInfoLabel>
              {prettifyBalance(smtSummaryBalance.erc20, 0)}
            </BalanceInfoLabel>
            <PriceInfoLabel color="grey">
              $ {prettifyBalance(smtSummaryBalance.usd)}
            </PriceInfoLabel>
          </>
        )}
      </InfoHeader>
      <InfoContent>
        <InfoContentItem>
          <InfoContentItemLabel>
            {t('rewardsBalance.walletBalance')}
          </InfoContentItemLabel>
          <InfoContentValueLabel>
            {balanceLoading || claimableBalanceLoading ? (
              <Flex justifyContent="center" alignItems="center" height="26px">
                <Loader />
              </Flex>
            ) : (
              prettifyBalance(smtWalletBalance.erc20, 0)
            )}
          </InfoContentValueLabel>
        </InfoContentItem>
        <InfoContentItem>
          <InfoContentItemLabel>
            {t('rewardsBalance.unclaimedBalance')}
          </InfoContentItemLabel>
          <InfoContentValueLabel>
            {balanceLoading || claimableBalanceLoading ? (
              <Flex justifyContent="center" alignItems="center" height="26px">
                <Loader />
              </Flex>
            ) : (
              prettifyBalance(claimableSmt, 0)
            )}
          </InfoContentValueLabel>
        </InfoContentItem>
        {claimableCpkSmt !== 0 ? (
          <InfoContentItem>
            <InfoContentItemLabel>
              {t('rewardsBalance.unclaimedCpkBalance')}
            </InfoContentItemLabel>
            <InfoContentValueLabel>
              {balanceLoading || claimableBalanceLoading ? (
                <Flex justifyContent="center" alignItems="center" height="26px">
                  <Loader />
                </Flex>
              ) : (
                prettifyBalance(claimableCpkSmt, 0)
              )}
            </InfoContentValueLabel>
          </InfoContentItem>
        ) : null}
        <InfoContentItem>
          <InfoContentItemLabel>
            {t('rewardsBalance.price')}
          </InfoContentItemLabel>
          <InfoContentValueLabel>
            $ {recursiveRound(price).toString()}
          </InfoContentValueLabel>
        </InfoContentItem>
      </InfoContent>
      <Box>
        <Button
          size="medium"
          style={{ width: '100%', height: '50px', fontWeight: 600 }}
          disabled={
            claimInProgress ||
            balanceLoading ||
            (claimableSmt === 0 && claimableCpkSmt === 0)
          }
          onClick={handleClaimSMT}
        >
          {claimInProgress ? <Loader color="white" /> : claimBtnText}
        </Button>
      </Box>
    </Box>
  )
}

export default RewardsGeneralInfo
