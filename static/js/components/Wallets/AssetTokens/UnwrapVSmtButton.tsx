import { VSMT } from '@swarm/core/contracts/VSMT'
import useAsyncMemo from '@swarm/core/hooks/async/useAsyncMemo'
import useAsyncState from '@swarm/core/hooks/async/useAsyncState'
import { useFireworks } from '@swarm/ui/presentational/Fireworks'
import { useSnackbar } from '@swarm/ui/swarm/Snackbar'
import SvgIcon from '@swarm/ui/swarm/SvgIcon'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Loader, Text } from 'rimble-ui'

const UnwrapVSmtButton = ({
  contract,
  userAddress,
}: {
  contract?: VSMT
  userAddress?: string
}) => {
  const { t } = useTranslation('wallets')
  const { addError } = useSnackbar()
  const [loading, setLoading] = useAsyncState(false)
  const { showFireworks } = useFireworks()

  const [claimableAmount] = useAsyncMemo(
    async () =>
      userAddress && contract ? contract.getClaimableAmount(userAddress) : 0,
    0,
    [contract, userAddress],
  )

  const onWrapVSMT = useCallback(async () => {
    if (contract && userAddress && claimableAmount) {
      try {
        setLoading(true)
        await contract.claimMaximumAmount(userAddress)

        showFireworks(5000)
      } catch (e) {
        addError(e)
      } finally {
        setLoading(false)
      }
    }
  }, [
    contract,
    userAddress,
    claimableAmount,
    setLoading,
    addError,
    showFireworks,
  ])

  if (loading) return <Loader m="auto" />

  return (
    <Button
      height="28px"
      px={2}
      ml={3}
      onClick={onWrapVSMT}
      disabled={claimableAmount === 0 || loading}
    >
      <Text.span mr="5px" lineHeight="20px">
        <SvgIcon name="Unwrap" height="12px" width="12px" />
      </Text.span>
      <Text.span fontWeight={3} lineHeight="20px">
        {t('assetTokens.actions.unwrap')} ({claimableAmount})
      </Text.span>
    </Button>
  )
}

export default UnwrapVSmtButton
