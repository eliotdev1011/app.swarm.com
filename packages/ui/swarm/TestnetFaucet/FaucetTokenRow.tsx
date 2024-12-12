import {
  Button,
  ButtonProps,
  CircularProgress,
  TableCell,
  TableRow,
} from '@material-ui/core'
import useTransactionAlerts from '@swarm/core/hooks/i18n/useTransactionAlerts'
import { denormalize } from '@swarm/core/shared/utils/helpers/big-helpers'
import { useStoredNetworkId } from '@swarm/core/web3'
import { ExtendedPoolToken } from '@swarm/types/tokens'
import { useCallback, useMemo, useState } from 'react'

import { useSnackbar } from '../Snackbar'

const crossChainAmounts = { dai: 1000, wbtc: 0.1 }

const mintAmountsMap: Record<number, Record<string, number>> = {
  4: { ...crossChainAmounts, usdc: 1000 },
}

const LoadingButton = ({
  loading,
  ...buttonProps
}: ButtonProps & { loading: boolean }) => (
  <Button
    variant="outlined"
    size="small"
    {...buttonProps}
    disabled={loading || buttonProps.disabled}
  >
    {loading ? <CircularProgress size={22} /> : buttonProps.children}
  </Button>
)

const FaucetTokenRow = ({
  token,
  cpkAddress,
}: {
  token: ExtendedPoolToken
  cpkAddress?: string
}) => {
  const { track } = useTransactionAlerts()
  const { addError } = useSnackbar()
  const networkId = useStoredNetworkId()
  const [enableLoading, setEnableLoading] = useState(false)
  const [lockLoading, setLockLoading] = useState(false)
  const [mintLoading, setMintLoading] = useState(false)

  const mintableAmount = useMemo(() => {
    const currentTokenSymbol = token.symbol.toLowerCase()
    return mintAmountsMap?.[networkId]?.[currentTokenSymbol] || 0
  }, [networkId, token.symbol])

  const handleEnableToken = useCallback(async () => {
    if (!cpkAddress) return

    setEnableLoading(true)
    try {
      const tx = await token.contract?.enableToken(cpkAddress)
      await track(tx)
    } catch (err) {
      addError(err)
    } finally {
      setEnableLoading(false)
    }
  }, [addError, cpkAddress, token.contract, track])

  const handleLockToken = useCallback(async () => {
    if (!cpkAddress) return

    setLockLoading(true)
    try {
      const tx = await token.contract?.disableToken(cpkAddress)
      await track(tx)
    } catch (err) {
      addError(err)
    } finally {
      setLockLoading(false)
    }
  }, [addError, cpkAddress, token.contract, track])

  const handleMintToken = useCallback(async () => {
    if (!mintableAmount) return

    setMintLoading(true)
    try {
      const tx = await token.contract?.mint(
        denormalize(mintableAmount, token.decimals),
      )
      await track(tx)
    } catch (err) {
      addError(err)
    } finally {
      setMintLoading(false)
    }
  }, [addError, mintableAmount, token.contract, token.decimals, track])

  return (
    <TableRow key={token.id}>
      <TableCell>{token.name}</TableCell>
      <TableCell align="right">
        <b>{token.balance?.toString()}</b> {token.symbol}
      </TableCell>
      <TableCell align="right">
        <b>{token.cpkBalance?.toString()}</b> {token.symbol}
      </TableCell>
      <TableCell>
        <LoadingButton
          loading={enableLoading}
          disabled={!token.cpkAllowance?.eq(0) || !cpkAddress}
          onClick={handleEnableToken}
        >
          Enable
        </LoadingButton>
        <LoadingButton
          loading={lockLoading}
          disabled={!token.cpkAllowance?.gt(0) || !cpkAddress}
          onClick={handleLockToken}
        >
          Disable
        </LoadingButton>
        {!!mintableAmount && (
          <LoadingButton onClick={handleMintToken} loading={mintLoading}>
            Mint {mintableAmount} {token.symbol}
          </LoadingButton>
        )}
      </TableCell>
    </TableRow>
  )
}

export default FaucetTokenRow
