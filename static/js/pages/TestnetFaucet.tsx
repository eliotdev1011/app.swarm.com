import {
  Box,
  Button,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core'
import { useCpk } from '@swarm/core/contracts/cpk'
import useNativeTokens from '@swarm/core/hooks/data/useNativeTokens'
import useTransactionAlerts from '@swarm/core/hooks/i18n/useTransactionAlerts'
import { POLL_INTERVAL } from '@swarm/core/shared/consts'
import { denormalize } from '@swarm/core/shared/utils/helpers'
import {
  injectContract,
  injectCpkAllowance,
  injectExchangeRate,
  injectTokenBalance,
  useInjections,
} from '@swarm/core/shared/utils/tokens/injectors'
import { useAccount, useReadyState } from '@swarm/core/web3'
import { ExtendedPoolToken } from '@swarm/types/tokens'
import Content from '@swarm/ui/presentational/Content'
import CPKInfo from '@swarm/ui/swarm/TestnetFaucet/CPKInfo'
import FaucetTokenRow from '@swarm/ui/swarm/TestnetFaucet/FaucetTokenRow'
import { useCallback, useMemo, useState } from 'react'

import Layout from 'src/components/Layout'

const TestnetFaucet = () => {
  const account = useAccount()
  const cpk = useCpk()
  const ready = useReadyState()
  const { track } = useTransactionAlerts()
  const [batchTxLoading, setBatchTxLoading] = useState(false)

  const { nativeTokens, loading } = useNativeTokens<ExtendedPoolToken>({
    skip: !ready,
    variables: { filter: { isLPT: false, paused: false } },
    pollInterval: POLL_INTERVAL,
  })

  const fullTokens = useInjections<ExtendedPoolToken>(
    nativeTokens,
    useMemo(
      () => [
        injectTokenBalance(account),
        injectTokenBalance(cpk?.address, 'cpkBalance'),
        injectCpkAllowance(account),
        injectContract(),
        injectExchangeRate(),
      ],
      [account, cpk?.address],
    ),
  )

  const transferTokensToCPK = useCallback(async () => {
    if (!account) return
    try {
      setBatchTxLoading(true)

      fullTokens.forEach((token) => {
        const amountToTransfer = token.balance?.div(10) || 0
        if (token.balance?.gt(0) && token.cpkAllowance?.gte(amountToTransfer)) {
          cpk?.transferTokenFrom(
            account,
            token.id,
            denormalize(token.balance.div(100), token.decimals),
          )
        }
      })

      const tx = await cpk?.execStoredTxs()
      await track(tx)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
    } finally {
      setBatchTxLoading(false)
    }
  }, [account, cpk, fullTokens, track])

  const claimAllAssets = useCallback(async () => {
    if (!account) return
    try {
      setBatchTxLoading(true)

      fullTokens.forEach((token) => {
        const balance = denormalize(token.cpkBalance ?? 0, token.decimals)
        if (balance?.gt(0)) {
          cpk?.transferToken(account, token.id, balance)
        }
      })

      const tx = await cpk?.execStoredTxs()
      await track(tx)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
    } finally {
      setBatchTxLoading(false)
    }
  }, [account, cpk, fullTokens, track])

  return (
    <Layout header="Testnet Faucet" scrollable>
      <Content bg="background">
        <CPKInfo />
        <hr />
        <Box width="100%" textAlign="center">
          <Box display="flex" justifyContent="space-around">
            <Button
              variant="contained"
              size="small"
              onClick={transferTokensToCPK}
            >
              Transfer 10% of your assets to CPK
            </Button>
            <Button variant="contained" size="small" onClick={claimAllAssets}>
              Claim all assets from the CPK
            </Button>
          </Box>
          {(loading || batchTxLoading) && <LinearProgress />}
        </Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Token</TableCell>
              <TableCell align="center">Balance</TableCell>
              <TableCell align="center">CPK Balance</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fullTokens.map((token) => (
              <FaucetTokenRow
                key={token.id}
                token={token}
                cpkAddress={cpk?.address}
              />
            ))}
          </TableBody>
        </Table>
      </Content>
    </Layout>
  )
}

export default TestnetFaucet
