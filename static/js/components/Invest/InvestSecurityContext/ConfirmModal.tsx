import { BasicModalProps } from '@swarm/core/hooks/state/usePopupState'
import Dialog from '@swarm/ui/presentational/Dialog'
import { useTranslation } from 'react-i18next'
import { Button, Heading, Text } from 'rimble-ui'

interface ConfirmModalProps extends BasicModalProps {
  title?: string
  description: string
}

const ConfirmModal = ({
  isOpen,
  onClose,
  title,
  description,
}: ConfirmModalProps) => {
  const { t } = useTranslation('invest')

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      width={['100%', '520px']}
      maxHeight="initial"
      height="auto"
    >
      {title ? (
        <Heading as="h4" fontSize={4} fontWeight={5} mt={0} mb={0}>
          {title}
        </Heading>
      ) : null}
      <Text.p color="grey" fontWeight={title ? 400 : 600}>
        {description}
      </Text.p>

      <Button
        onClick={onClose}
        color="primary"
        alignSelf="center"
        fontWeight={600}
        minHeight="42px"
        width="100%"
        borderWidth="2px"
      >
        {t('confirmationModal.button')}
      </Button>
    </Dialog>
  )
}

export default ConfirmModal
