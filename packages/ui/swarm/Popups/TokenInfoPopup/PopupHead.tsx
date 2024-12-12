import {
  getCanonicalIpfsUrl,
  isIpfsUrl,
  truncateStringInTheMiddle,
} from '@swarm/core/shared/utils'
import { AbstractAsset } from '@swarm/types/tokens'
import { Heading } from 'rimble-ui'
import styled from 'styled-components/macro'

import ExplorerLink from '@ui/swarm/Link/ExplorerLink'
import SvgIcon from '@ui/swarm/SvgIcon'
import TokenIcon from '@ui/swarm/TokenIcon'

interface PopupHeadProps {
  token: AbstractAsset
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  kyaInformation?: any
}

const StyledHeading = styled(Heading).attrs({ as: 'h4' })`
  font-size: 20px;
  font-weight: bold;
  line-height: 28px;
  margin: 0;
  margin-bottom: ${({ theme }) => theme.space[1]}px;
  color: ${({ theme }) => theme.colors.primary};
`

const PopupHead = ({ token, kyaInformation }: PopupHeadProps) => {
  const { name, symbol } = token

  const nftAddress = token.address
  const tokenAddress = token.id
  const address = nftAddress || tokenAddress

  const renderLogo = () => {
    if (kyaInformation?.image) {
      if (isIpfsUrl(kyaInformation?.image)) {
        return (
          <TokenIcon
            logo={getCanonicalIpfsUrl(kyaInformation?.image)}
            mb={3}
            height="100px"
            maxWidth="100px"
          />
        )
      }

      return (
        <SvgIcon
          name={kyaInformation?.image}
          style={{
            flex: '0 0 100px',
            marginBottom: '16px',
            maxWidth: '100px',
          }}
          height="100px"
          external
        />
      )
    }

    return (
      <TokenIcon symbol={token.symbol} mb={3} height="100px" maxWidth="100px" />
    )
  }

  return (
    <>
      {renderLogo()}
      <StyledHeading>{name}</StyledHeading>
      <StyledHeading>{symbol}</StyledHeading>
      <StyledHeading>
        <ExplorerLink
          color="primary"
          type="address"
          fontWeight="600"
          hash={address}
          label={truncateStringInTheMiddle(address)}
        />
      </StyledHeading>
    </>
  )
}

export default PopupHead
