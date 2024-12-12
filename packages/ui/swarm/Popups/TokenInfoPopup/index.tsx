import { BasicModalProps } from '@swarm/core/hooks/state/usePopupState'
import { useKyaDataOf } from '@swarm/core/observables/kyaOf'
import {
  getCanonicalIpfsUrl,
  getCanonicalIpfsUrlFromKya,
  isIpfsUrl,
} from '@swarm/core/shared/utils'
import { AbstractAsset } from '@swarm/types/tokens'
import { PropsWithChildren } from 'react'
import { Box, Flex } from 'rimble-ui'

import { Drawer } from '@ui/presentational/Drawer'

import PopupBody from './PopupBody'
import PopupDataBox from './PopupDataBox'
import PopupDataRow from './PopupDataRow'
import PopupHead from './PopupHead'

interface TokenInfoPopupProps extends PropsWithChildren<BasicModalProps> {
  token: AbstractAsset | null
  kya?: string
  topAdornment?: React.ReactNode
}

const TokenInfoPopup = ({
  isOpen,
  onClose,
  token,
  kya,
  children,
  topAdornment,
}: TokenInfoPopupProps) => {
  const kyaInformation = useKyaDataOf({
    tokenAddress: token?.address || token?.id,
    tokenId: token?.tokenId,
    ipfsUri:
      kya &&
      (isIpfsUrl(kya)
        ? getCanonicalIpfsUrl(kya)
        : getCanonicalIpfsUrlFromKya(kya)),
  })

  return (
    <Drawer anchor="right" open={isOpen} onClose={onClose} elevation={0}>
      <Box width={['100%', '600px']}>{topAdornment}</Box>
      <Flex
        flexDirection="column"
        width={['100%', '600px']}
        justifyContent="flex-start"
        alignItems="center"
        p="24px"
        py="40px"
      >
        {token && <PopupHead token={token} kyaInformation={kyaInformation} />}
        {children}
        {token && <PopupBody token={token} kyaInformation={kyaInformation} />}
      </Flex>
    </Drawer>
  )
}

export default TokenInfoPopup

export { PopupDataBox, PopupDataRow }
