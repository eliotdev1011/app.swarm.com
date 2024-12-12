import { TransactionResponse } from '@ethersproject/abstract-provider'
import useAsyncState from '@swarm/core/hooks/async/useAsyncState'
import { AllowanceStatus } from '@swarm/core/shared/enums'
import { AssetTokenActionsProps } from '@swarm/types/props'
import ThreeDotsMenu from '@swarm/ui/presentational/ThreeDotsMenu'
import ThreeDotsMenuOption from '@swarm/ui/presentational/ThreeDotsMenuOption'
import { useSnackbar } from '@swarm/ui/swarm/Snackbar'
import { AlertVariant } from '@swarm/ui/swarm/Snackbar/types'
import match from 'conditional-expression'
import { SyntheticEvent } from 'react'
import { Text } from 'rimble-ui'

import ConfirmDisableTokenModal from './AssetTokens/ConfirmDisableToken'

type AssetMenuProps = Pick<
  AssetTokenActionsProps,
  'symbol' | 'name' | 'allowanceStatus' | 'enable' | 'disable'
> & {
  setIsPerformingAnAction: (value: boolean) => void
}

const AssetMenu = ({
  symbol,
  name,
  allowanceStatus,
  enable,
  disable,
  setIsPerformingAnAction,
}: AssetMenuProps) => {
  const { addAlert, addError } = useSnackbar()
  const [isOpen, setIsOpen] = useAsyncState(false)

  const openModal = (event: SyntheticEvent<Element, Event>) => {
    event.stopPropagation()
    event.preventDefault()
    setIsOpen(true)
  }

  const closeModal = (event?: SyntheticEvent<Element, Event>) => {
    event?.stopPropagation()
    event?.preventDefault()
    setIsOpen(false)
  }

  const handleAction = async (action: () => Promise<TransactionResponse>) => {
    setIsPerformingAnAction(true)
    try {
      const tx = await action()
      await tx.wait()

      const message = `${symbol} (${name}) is ${
        allowanceStatus === AllowanceStatus.NOT_ALLOWED ? 'enabled' : 'locked'
      }`
      addAlert(message, { variant: AlertVariant.success })
    } catch (e) {
      closeModal()
      addError(e)
    } finally {
      closeModal()
      setIsPerformingAnAction(false)
    }
  }

  const confirmModalProps = {
    isOpen,
    name,
    closeModal,
    disableAction: () => handleAction(disable),
  }

  return match(allowanceStatus)
    .equals(AllowanceStatus.NOT_ALLOWED)
    .then(
      <ThreeDotsMenu>
        <ThreeDotsMenuOption
          label="Enable"
          color="primary"
          icon="LockOpen"
          onClick={(e) => {
            e.stopPropagation()
            handleAction(enable)
          }}
        />
      </ThreeDotsMenu>,
    )
    .on((value: AllowanceStatus) =>
      [AllowanceStatus.INFINITE, AllowanceStatus.LIMITED].includes(value),
    )
    .then(
      <>
        <ThreeDotsMenu>
          <ThreeDotsMenuOption
            label="Disable"
            color="danger"
            icon="RemoveCircleOutline"
            onClick={openModal}
          />
        </ThreeDotsMenu>
        <ConfirmDisableTokenModal {...confirmModalProps} />
      </>,
    )
    .else(<Text mr="47px" />)
}

export default AssetMenu
