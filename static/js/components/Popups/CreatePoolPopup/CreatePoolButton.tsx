import { useCpk } from '@swarm/core/contracts/cpk'
import useTransactionAlerts from '@swarm/core/hooks/i18n/useTransactionAlerts'
import { Tier } from '@swarm/core/shared/enums'
import wait from '@swarm/core/shared/utils/helpers/wait'
import { isLocked } from '@swarm/core/shared/utils/tokens/allowance'
import SmartButton from '@swarm/ui/swarm/Buttons/SmartButton'
import { useSnackbar } from '@swarm/ui/swarm/Snackbar'
import { useCallback, useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader } from 'rimble-ui'

import { CreatePoolContext } from './CreatePoolContext'

const CreatePoolButton = () => {
  const { t } = useTranslation(['pools', 'common'])
  const cpk = useCpk()
  const { values, errors, dictionary, submit, loading } =
    useContext(CreatePoolContext)
  const { addError } = useSnackbar()
  const { track } = useTransactionAlerts()

  const assets = useMemo(
    () =>
      values.assets.map(({ id, weight, amount }) => ({
        ...dictionary.get(id),
        weight,
        amount,
      })),
    [dictionary, values.assets],
  )

  const hasError = Object.keys(errors).length !== 0

  const lockedToken = useMemo(
    () =>
      loading
        ? undefined
        : assets.find((token) => token.amount && isLocked(token, token.amount)),
    [loading, assets],
  )

  const disabled = hasError || assets.length === 0

  const enable = useCallback(async () => {
    try {
      const tx = await lockedToken?.contract?.enableToken(cpk?.address || '')

      await track(tx, {
        confirm: {
          secondaryMessage: t('common:token.enabled', {
            token: lockedToken?.name,
          }),
        },
      })

      await wait(2000)
    } catch (error) {
      addError(error as Error)
    }
  }, [
    addError,
    cpk?.address,
    lockedToken?.contract,
    lockedToken?.name,
    t,
    track,
  ])

  const handleClick = useCallback(async () => {
    if (lockedToken) {
      return enable()
    }
    return submit()
  }, [lockedToken, submit, enable])

  const getButtonLabel = (): string => {
    if (lockedToken) {
      return t('common:token.enable', { token: lockedToken.symbol })
    }

    return t('pools:createPool.advanced.create')
  }

  return (
    <SmartButton
      requireInitiated
      requireAccount
      requireTier={Tier.tier2}
      size="medium"
      px={3}
      mt={4}
      disabled={disabled}
      loading={loading}
      onClick={handleClick}
      loadingText={
        <>
          <Loader mr={2} color="white" />
          {lockedToken
            ? t('common:token.enabling', { token: lockedToken.symbol })
            : t('pools:createPool.advanced.create')}
        </>
      }
    >
      {getButtonLabel()}
    </SmartButton>
  )
}

export default CreatePoolButton
