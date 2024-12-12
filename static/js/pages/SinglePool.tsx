import { useAccount, useReadyState } from '@swarm/core/web3'
import { useSnackbar } from '@swarm/ui/swarm/Snackbar'
import { AlertVariant } from '@swarm/ui/swarm/Snackbar/types'
import { useTheme } from '@swarm/ui/theme/useTheme'
import { SyntheticEvent, useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import { useHistory } from 'react-router-dom'
import { Button, Loader } from 'rimble-ui'

import HeaderActions from 'src/components/HeaderActions'
import Layout from 'src/components/Layout'
import PoolDetails from 'src/components/PoolDetails'
import usePoolDetails from 'src/hooks/pool/usePoolDetails'
import { PoolType } from 'src/shared/enums'
import { getPoolType } from 'src/shared/utils/pool/getPoolType'

const SinglePool = () => {
  const { t } = useTranslation('pools')
  const { address } = useParams<{ address: string }>()
  const { addAlert } = useSnackbar()
  const { pool, poolToken, loading, error, refetch } = usePoolDetails(address)
  const history = useHistory()
  const theme = useTheme()

  const account = useAccount()
  const ready = useReadyState()

  useEffect(() => {
    if (pool === null || poolToken === null || error) {
      addAlert("Such pool doesn't exist", {
        variant: AlertVariant.error,
      })

      history.push('/pools/all')
    }
  }, [addAlert, error, history, pool, poolToken])

  const poolType = useMemo<PoolType>(() => {
    if (
      loading ||
      !ready ||
      pool === null ||
      pool === undefined ||
      account === undefined
    ) {
      return PoolType.fixed
    }

    return getPoolType(pool, account)
  }, [loading, ready, pool, account])

  const goBack = useCallback(
    (e: SyntheticEvent) => {
      e.stopPropagation()

      if (poolType === PoolType['my-pools']) {
        history.push(`/pools/my-pools`)
      } else {
        history.push(`/pools/all`)
      }
    },
    [history, poolType],
  )

  return (
    <Layout
      header={
        <Button.Text
          onClick={goBack}
          icon="ArrowBack"
          zIndex={theme.zIndices.layerOne}
          fontSize="16px"
        >
          Back to{' '}
          {poolType === PoolType['my-pools']
            ? t(`tabs.my-pools`)
            : t(`tabs.all`)}
        </Button.Text>
      }
      scrollable
      headerActions={<HeaderActions createPool />}
    >
      {!pool || !poolToken || loading ? (
        <Loader size={50} m="auto" />
      ) : (
        <PoolDetails
          pool={pool}
          poolToken={poolToken}
          reload={refetch}
          loading={loading}
        />
      )}
    </Layout>
  )
}

export default SinglePool
