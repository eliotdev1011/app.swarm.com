import useObservable from '@swarm/core/hooks/rxjs/useObservable'
import useVerify from '@swarm/core/hooks/useVerify'
import isAccountRegistered$ from '@swarm/core/observables/isAccountRegistered'
import StyledButton from '@ui/presentational/StyledButton'
import Translate from '@ui/presentational/Translate'
import { ReactElement } from 'react'

interface VerifyAddressButtonProps {
  onNext?: () => void
  render?: (
    verify: () => Promise<void>,
    loading: boolean,
    isRegistered: boolean,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) => ReactElement<any, any> | null
}

const VerifyAddressButton = ({
  render = (verify: () => Promise<void>, loading: boolean) => (
    <StyledButton onClick={verify} disabled={loading}>
      <Translate namespaces={['onboarding']}>
        verifyAddress.verifyButton
      </Translate>
    </StyledButton>
  ),
}: VerifyAddressButtonProps) => {
  const isRegistered = useObservable<boolean>(isAccountRegistered$, false)
  const { verify, loading } = useVerify()

  return render(verify, loading, !!isRegistered)
}

export default VerifyAddressButton
