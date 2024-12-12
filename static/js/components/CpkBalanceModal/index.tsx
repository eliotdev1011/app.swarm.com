import { BasicModalProps } from '@swarm/core/hooks/state/usePopupState'
import { prettifyBalance } from '@swarm/core/shared/utils/formatting'
import { ZERO } from '@swarm/core/shared/utils/helpers/big-helpers'
import iff from '@swarm/core/shared/utils/helpers/iff'
import { NativeToken } from '@swarm/types/tokens'
import Dialog from '@swarm/ui/presentational/Dialog'
import { Trans, useTranslation } from 'react-i18next'
import { Button, Flex, Heading, Text } from 'rimble-ui'

export interface CpkBalanceModalProps extends BasicModalProps {
  onConfirm: () => void
  tokenIn?: NativeToken
  tokenOut?: NativeToken
}

const CpkBalanceModal = ({
  isOpen = false,
  onClose,
  onConfirm,
  tokenIn,
  tokenOut,
}: CpkBalanceModalProps) => {
  const { t } = useTranslation('modals')

  const amountIn = tokenIn?.xToken?.cpkBalance ?? ZERO
  const amountOut = tokenOut?.xToken?.cpkBalance ?? ZERO

  return (
    <Dialog
      isOpen={isOpen}
      width={['100%', '540px']}
      height="auto"
      maxHeight="80%"
      onClose={onClose}
      p={2}
    >
      <Heading as="h4" fontSize={4} fontWeight={5} mt={0}>
        {t('cbkBalance.pleaseNote')}
      </Heading>
      <Text.span color="grey">
        {iff(
          !tokenIn && !tokenOut,
          t('cbkBalance.tokenInNoAmountDescription'),
          iff(
            amountIn.gt(0),
            iff(
              amountOut.gt(0),
              <Trans
                ns="modals"
                i18nKey="cbkBalance.tokenInOutDescription"
                components={{ br: <br /> }}
                values={{
                  tokenIn: tokenIn?.symbol ?? 'UNKNOWN',
                  amountIn: prettifyBalance(amountIn),
                  tokenOut: tokenOut?.symbol ?? 'UNKNOWN',
                  amountOut: prettifyBalance(amountOut),
                }}
              />,
              t('cbkBalance.tokenInDescription', {
                tokenIn: tokenIn?.symbol ?? 'UNKNOWN',
                amount: prettifyBalance(amountIn),
              }),
            ),
            t('cbkBalance.tokenOutDescription', {
              tokenOut: tokenOut?.symbol ?? 'UNKNOWN',
              amount: prettifyBalance(amountOut),
            }),
          ),
        )}
      </Text.span>
      <Flex mt="24px">
        <Button.Outline
          borderColor="primary"
          border="1.5px solid"
          fontWeight={4}
          onClick={onClose}
        >
          Back
        </Button.Outline>
        <Button ml={3} fontWeight={4} onClick={onConfirm}>
          Continue
        </Button>
      </Flex>
    </Dialog>
  )
}

export default CpkBalanceModal
