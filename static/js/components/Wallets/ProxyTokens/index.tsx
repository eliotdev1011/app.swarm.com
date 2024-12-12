import config from '@swarm/core/config'
import { getCpk } from '@swarm/core/contracts/cpk'
import useUserAccount from '@swarm/core/hooks/data/useUserAccount'
import useTransactionAlerts from '@swarm/core/hooks/i18n/useTransactionAlerts'
import { useIsProxyDeployed } from '@swarm/core/observables/proxyDeployed'
import { prettifyBalance } from '@swarm/core/shared/utils/formatting'
import {
  isSameEthereumAddress,
  useAccount,
  useReadyState,
} from '@swarm/core/web3'
import InfoLink from '@swarm/ui/presentational/InfoLink'
import Section from '@swarm/ui/presentational/Section'
import StyledTable from '@swarm/ui/presentational/StyledTable'
import TableInfoRow from '@swarm/ui/presentational/Table/TableInfoRow'
import TableRow from '@swarm/ui/presentational/Table/TableRow'
import Tooltip from '@swarm/ui/presentational/Tooltip'
import SmartButton from '@swarm/ui/swarm/Buttons/SmartButton'
import ExplorerLink from '@swarm/ui/swarm/Link/ExplorerLink'
import { useSnackbar } from '@swarm/ui/swarm/Snackbar'
import { AlertVariant } from '@swarm/ui/swarm/Snackbar/types'
import TokenIcon from '@swarm/ui/swarm/TokenIcon'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Flex, Text } from 'rimble-ui'
import { MarginProps } from 'styled-system'

import { useWalletsContext } from 'src/components/Wallets/WalletsContext'

import ProxyTokensHead from './ProxyTokensHead'
import useProxyAddressTokens from './useProxyAddressTokens'

const {
  gettingStarted: { proxyTokensExplanation },
} = config.resources.docs

const ProxyTokens = (props: MarginProps) => {
  const { selectedAccount } = useWalletsContext()
  const { t } = useTranslation('wallets')
  const { addAlert, addError } = useSnackbar()
  const { track } = useTransactionAlerts()
  const account = useAccount()
  const ready = useReadyState()
  const userAccount = useUserAccount(selectedAccount)
  const isProxyDeployed = useIsProxyDeployed()
  const { tokens, loading } = useProxyAddressTokens(userAccount?.cpkAddress)

  const proxyUsdBalance = tokens.reduce(
    (acc, token) => acc + token.cpkXTokenUsdBalance + token.cpkTokenUsdBalance,
    0,
  )

  const handleClaimAllClick = useCallback(async () => {
    if (!isSameEthereumAddress(account, selectedAccount)) {
      addAlert(t('proxyTokens.connectAccount'), {
        variant: AlertVariant.default,
      })

      return
    }

    const cpk = await getCpk()

    if (account && cpk) {
      try {
        const tx = await cpk.claimAll(account, tokens)

        await track(tx, {
          confirm: {
            message: t('proxyTokens.claimAllSuccess'),
          },
        })
      } catch (e) {
        addError(e as Error)
      }
    }
  }, [account, selectedAccount, addAlert, t, tokens, track, addError])

  const dataLoading = !ready || loading
  const noResults = !dataLoading && !tokens.length

  if (!isProxyDeployed || !isSameEthereumAddress(account, selectedAccount)) {
    return null
  }

  return (
    <Section
      title={
        <Text.span
          fontSize="inherit"
          lineHeight="inherit"
          fontWeight="inherit"
          color="inherit"
        >
          {t('proxyTokens.header')}
          <ExplorerLink
            type="address"
            hash={userAccount?.cpkAddress}
            inline
            iconOnly
            color="inherit"
            ml={1}
          />
        </Text.span>
      }
      {...props}
    >
      <Box mt={[3, '24px']}>
        <StyledTable>
          <ProxyTokensHead />
          <tbody>
            <TableInfoRow show={noResults} loading={dataLoading}>
              {t('proxyTokens.noResults')}{' '}
              <InfoLink href={proxyTokensExplanation} title="Learn more">
                Learn more
              </InfoLink>
            </TableInfoRow>

            {!!tokens.length && (
              <TableRow>
                <td>
                  <Flex
                    alignItems="flex-start"
                    flexDirection={['column', 'row']}
                    ml={2}
                  >
                    <Flex
                      alignItems="flex-start"
                      justifyContent="center"
                      display={['flex', 'none']}
                    >
                      <Text fontSize={1} fontWeight={4} color="grey">
                        {t('proxyTokens.assets')}
                      </Text>
                    </Flex>
                    <Flex mt={[1, 0]} flexWrap="wrap">
                      {tokens.slice(0, 2).map(({ symbol, name, id }, index) => (
                        <Flex alignItems="center" key={id} mr={2}>
                          <TokenIcon
                            symbol={symbol}
                            name={name}
                            width="32px"
                            height="32px"
                          />
                          <Text.span fontSize={2} fontWeight={5} ml="10px">
                            {symbol}
                            {tokens.length > index + 1 && ', '}
                          </Text.span>
                        </Flex>
                      ))}
                      {tokens.length > 2 && (
                        <Flex alignItems="center">
                          <Tooltip
                            placement="top"
                            message={tokens
                              .slice(2)
                              .map(({ symbol }) => symbol)
                              .join(', ')}
                          >
                            <Text fontSize={2} fontWeight={5}>
                              {t('proxyTokens.andOthersWithCount', {
                                count: tokens.length - 2,
                              })}
                            </Text>
                          </Tooltip>
                        </Flex>
                      )}
                    </Flex>
                  </Flex>
                </td>
                <td>
                  <Flex
                    alignItems={['flex-start', 'flex-end']}
                    flexDirection="column"
                  >
                    <Flex
                      alignItems="flex-start"
                      justifyContent="center"
                      display={['flex', 'none']}
                    >
                      <Text fontSize={1} fontWeight={4} color="grey">
                        {t('proxyTokens.balance')}
                      </Text>
                    </Flex>
                    <Flex
                      justifyContent={['flex-start', 'flex-end']}
                      mt={[1, 0]}
                    >
                      {prettifyBalance(proxyUsdBalance)} USD
                    </Flex>
                  </Flex>
                </td>
                <td>
                  <Flex
                    justifyContent={['flex-start', 'flex-end']}
                    alignItems="center"
                  >
                    {!!tokens.length && (
                      <>
                        <SmartButton
                          height="28px"
                          px={2}
                          onClick={handleClaimAllClick}
                        >
                          {t('proxyTokens.claimAll')}
                        </SmartButton>
                        <InfoLink
                          ml={2}
                          href={proxyTokensExplanation}
                          title="Learn more"
                        >
                          Learn more
                        </InfoLink>
                      </>
                    )}
                  </Flex>
                </td>
              </TableRow>
            )}
          </tbody>
        </StyledTable>
      </Box>
    </Section>
  )
}

export default ProxyTokens
