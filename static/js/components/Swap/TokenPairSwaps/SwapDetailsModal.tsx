import useAsyncMemo from '@swarm/core/hooks/async/useAsyncMemo'
import useObservable from '@swarm/core/hooks/rxjs/useObservable'
import { recursiveRound } from '@swarm/core/shared/utils/math'
import { walletProvider$ } from '@swarm/core/web3'
import { Swap } from '@swarm/types'
import DetailBlock from '@swarm/ui/presentational/DetailBlock'
import Dialog from '@swarm/ui/presentational/Dialog'
import Grid from '@swarm/ui/presentational/Grid'
import StyledOutlineButton from '@swarm/ui/presentational/StyledOutlineButton'
import ExplorerLink from '@swarm/ui/swarm/Link/ExplorerLink'
import { useSnackbar } from '@swarm/ui/swarm/Snackbar'
import { AlertVariant } from '@swarm/ui/swarm/Snackbar/types'
import { format, fromUnixTime } from 'date-fns'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Button, Loader } from 'rimble-ui'

interface SwapDetailsModalProps {
  onClose: () => void
  swap: Swap
}

const SwapDetailsModal = ({ onClose, swap }: SwapDetailsModalProps) => {
  const { addAlert } = useSnackbar()
  const { t } = useTranslation('swap')
  const provider = useObservable(walletProvider$)
  const date = fromUnixTime(swap.timestamp)
  const hash = swap.id.slice(0, swap.id.indexOf('-'))

  const handleCopyAddress = useCallback(() => {
    navigator.clipboard.writeText(hash)

    addAlert(t('recentSwaps.modal.copiedToClipboard'), {
      variant: AlertVariant.success,
    })
  }, [addAlert, hash, t])

  const [tx] = useAsyncMemo(
    async () =>
      provider?.getTransaction(swap.id.slice(0, swap.id.indexOf('-'))),
    null,
    [provider, swap.id],
  )

  return (
    <Dialog
      isOpen
      width={['100%', '540px']}
      onClose={onClose}
      title={t('recentSwaps.modal.header')}
    >
      <Box>
        <Box>
          <DetailBlock
            bold
            namespace="swap"
            label="recentSwaps.modal.status"
            content="Completed"
            color="success"
          />
        </Box>
        <Grid gridTemplateColumns="1fr 1fr">
          <DetailBlock
            namespace="swap"
            label="recentSwaps.modal.swappedFrom"
            content={`${swap.tokenAmountIn} ${swap.tokenInSym}`}
          />
          <DetailBlock
            namespace="swap"
            label="recentSwaps.modal.swappedTo"
            content={`${swap.tokenAmountOut} ${swap.tokenOutSym}`}
          />
          <DetailBlock
            namespace="swap"
            label="recentSwaps.modal.transactionTime"
            content={format(date, 'hh:mm aa MM/dd/yyyy')}
          />
          <DetailBlock
            namespace="swap"
            label="recentSwaps.modal.priceAtTransaction"
            content={`1 ${swap.tokenInSym} = ${recursiveRound(
              Number(swap.tokenAmountOut) / Number(swap.tokenAmountIn),
              { base: 6 },
            )} ${swap.tokenOutSym}`}
          />
        </Grid>
        <DetailBlock
          bold
          namespace="swap"
          label="recentSwaps.modal.networkConfirmations"
          content={tx?.confirmations.toString() || <Loader />}
        />
        <Box>
          <DetailBlock
            bold
            namespace="swap"
            label="recentSwaps.modal.transactionHash"
            content={hash}
          />

          <Box>
            <Button.Text
              fontWeight={4}
              fontSize={1}
              mx={0}
              p={0}
              minWidth={0}
              mt={2}
              height="fit-content"
              onClick={handleCopyAddress}
            >
              {t('recentSwaps.modal.copy')}
            </Button.Text>
            <ExplorerLink
              type="tx"
              hash={hash}
              label={t('recentSwaps.modal.viewOnEtherscan')}
              fontWeight={4}
              fontSize={1}
              color="primary"
              hoverColor="primary"
              ml={2}
              inline
            />
          </Box>
          <Box>
            <StyledOutlineButton
              width="100%"
              mt="24px"
              fontWeight={4}
              onClick={onClose}
            >
              {t('recentSwaps.modal.close')}
            </StyledOutlineButton>
          </Box>
        </Box>
      </Box>
    </Dialog>
  )
}

export default SwapDetailsModal
