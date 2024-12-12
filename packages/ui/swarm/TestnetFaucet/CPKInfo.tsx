import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core'
import { useCpk } from '@swarm/core/contracts/cpk'
import useAsyncMemo from '@swarm/core/hooks/async/useAsyncMemo'
import { useIsProxyDeployed } from '@swarm/core/observables/proxyDeployed'

import ExplorerLink from '../Link/ExplorerLink'

const CPKInfo = () => {
  const cpk = useCpk()
  const [originalAddress] = useAsyncMemo(
    async () => cpk?.getOwnerAccount(),
    'Unknown',
    [cpk],
  )

  const [connectedNetwork] = useAsyncMemo(async () => cpk?.getNetworkId(), -1, [
    cpk,
  ])

  const [masterCopyVersion] = useAsyncMemo(
    async () => cpk?.getContractVersion(),
    'Unknown',
    [cpk],
  )

  const isProxyDeployed = useIsProxyDeployed()

  return (
    <Table width="100%">
      <TableHead>
        <TableRow>
          <TableCell colSpan={2} align="center">
            <b>Your CPK Info</b>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody style={{ opacity: !cpk ? '.4' : '1' }}>
        <TableRow>
          <TableCell>Original Address</TableCell>
          <TableCell>
            {originalAddress}
            <ExplorerLink
              type="address"
              hash={originalAddress}
              ml={2}
              iconOnly
              inline
              iconSize="14px"
              color="inherit"
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Proxy Contract Address</TableCell>
          <TableCell>
            {cpk?.address}
            <ExplorerLink
              type="address"
              hash={cpk?.address}
              ml={2}
              iconOnly
              inline
              iconSize="14px"
              color="inherit"
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Proxy deployed(?)</TableCell>
          <TableCell>{isProxyDeployed ? 'yes' : 'no yet'}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Salt nonce</TableCell>
          <TableCell>{cpk?.saltNonce}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Connected network id</TableCell>
          <TableCell>{connectedNetwork || '--'}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Master Copy Contract version</TableCell>
          <TableCell>{masterCopyVersion || '--'}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

export default CPKInfo
