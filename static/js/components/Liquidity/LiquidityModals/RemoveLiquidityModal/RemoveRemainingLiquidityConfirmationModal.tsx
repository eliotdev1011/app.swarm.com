import Dialog from '@swarm/ui/presentational/Dialog'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Flex, Text } from 'rimble-ui'

interface RemoveRemainingLiquidityConfirmationModalProps {
  confirmButton: React.ReactNode
  isOpen: boolean
  onClose: () => void
}

const RemoveRemainingLiquidityConfirmationModal: React.FC<
  RemoveRemainingLiquidityConfirmationModalProps
> = (props: RemoveRemainingLiquidityConfirmationModalProps) => {
  const { confirmButton, isOpen, onClose } = props
  const { t } = useTranslation(['liquidityModals', 'navigation'])

  return (
    <Dialog
      isOpen={isOpen}
      width={['100%', '500px']}
      onClose={onClose}
      title={t('liquidityModals:removeRemainingConfirmation.header')}
      p="24px"
    >
      <Text.p marginTop={0} marginBottom={4}>
        {t('liquidityModals:removeRemainingConfirmation.body')}
      </Text.p>
      <Flex justifyContent="start" alignItems="center">
        {confirmButton}
        <Button.Outline
          color="primary"
          borderColor="primary"
          border="1.5px solid"
          onClick={onClose}
        >
          {t('liquidityModals:removeRemainingConfirmation.cancel')}
        </Button.Outline>
      </Flex>
    </Dialog>
  )
}

export default RemoveRemainingLiquidityConfirmationModal
