import { AllowanceStatus } from '@swarm/core/shared/enums'
import { WalletToken } from '@swarm/types/tokens'
import match from 'conditional-expression'
import { Icon } from 'rimble-ui'

const AllowanceIndicator = ({
  allowanceStatus,
}: Pick<WalletToken, 'allowanceStatus'>) =>
  match(allowanceStatus)
    .equals(AllowanceStatus.NOT_ALLOWED)
    .then(<Icon name="LockOutline" title="Locked" size="16" color="red" />)
    .equals(AllowanceStatus.LIMITED)
    .then(
      <Icon
        name="LockOpen"
        title="Enabled & Limited"
        size="16"
        color="success"
      />,
    )
    .equals(AllowanceStatus.INFINITE)
    .then(
      <>
        <Icon
          name="LockOpen"
          title="Enabled & Unlimited"
          size="16"
          color="success"
        />
        <sup>
          <Icon
            title="Enabled & Limited"
            name="AllInclusive"
            size="12"
            color="success"
          />
        </sup>
      </>,
    )
    .else(null)

export default AllowanceIndicator
