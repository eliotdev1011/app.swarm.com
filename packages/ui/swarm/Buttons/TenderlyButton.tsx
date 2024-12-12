import { batchedCPKSimulations } from '@swarm/core/services/tenderly'
import { TenderlyTransaction } from '@swarm/types'
import { ExtractProps } from '@swarm/types/props'
import { useTranslation } from 'react-i18next'
import { Button } from 'rimble-ui'

import { useSnackbar } from '../Snackbar'
import { AlertVariant } from '../Snackbar/types'
import SvgIcon from '../SvgIcon'

import LoaderButton from './LoaderButton'

export interface TenderlyButtonProps {
  txs: TenderlyTransaction[]
}

const TenderlyButton = ({
  txs,
  ...props
}: TenderlyButtonProps & ExtractProps<typeof Button>) => {
  const { addError, addAlert } = useSnackbar()
  const { t } = useTranslation('alerts')

  const handleSimulateTransactions = async () => {
    try {
      const simulations = await batchedCPKSimulations(txs)

      const failedSimulation = simulations.find(
        (simulation) => simulation.error,
      )

      if (failedSimulation) {
        addError(failedSimulation.error)
      } else {
        addAlert(t('tenderlySimulation.success'), {
          variant: AlertVariant.success,
        })
      }
    } catch (e) {
      addError(e)
    }
  }

  return (
    <LoaderButton
      height={22}
      width={80}
      loaderColor="primary"
      {...props}
      onClick={handleSimulateTransactions}
      component={Button.Outline}
    >
      <SvgIcon name="Tenderly" width={60} height={12} />
    </LoaderButton>
  )
}

export default TenderlyButton
