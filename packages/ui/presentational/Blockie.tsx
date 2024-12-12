import { Obj } from '@swarm/types'
import makeBlockie from 'ethereum-blockies-base64'
import { constants } from 'ethers'

import Image from './Image'

interface BlockieProps extends Obj {
  address?: string
}

const Blockie = ({
  address = constants.AddressZero,
  width = 24,
  ...rest
}: BlockieProps) => (
  <Image
    src={makeBlockie(address || constants.AddressZero)}
    fallback={makeBlockie(address || constants.AddressZero)}
    alt={address}
    width={width}
    {...rest}
  />
)

export default Blockie
