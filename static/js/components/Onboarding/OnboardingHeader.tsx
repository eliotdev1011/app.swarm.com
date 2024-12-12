import Header from '@swarm/ui/swarm/Header'
import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { Button } from 'rimble-ui'

import { ROUTES as MATR_ROUTES } from 'src/apps/Mattereum/routes'
import { ROUTES } from 'src/routes'
import { checkIsMattereum } from 'src/shared/utils/brand'

interface HeaderProps {
  header: string
  subheader?: string
  button?: string
  onButtonClick?: () => void
  buttonIcon?: string
}

const OnboardingHeader = ({
  header,
  subheader,
  button,
  onButtonClick,
  buttonIcon = 'Close',
}: HeaderProps) => {
  const history = useHistory()

  const handleButtonClick = useCallback(() => {
    if (onButtonClick) {
      onButtonClick()
    } else {
      const isMattereum = checkIsMattereum()
      const route = isMattereum ? MATR_ROUTES.BUY : ROUTES.INVEST
      history.push(route)
    }
  }, [history, onButtonClick])

  return (
    <Header title={header} legend={subheader}>
      {button && (
        <Button.Text icon={buttonIcon} onClick={handleButtonClick}>
          {button}
        </Button.Text>
      )}
    </Header>
  )
}

export default OnboardingHeader
