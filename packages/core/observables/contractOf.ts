import { AbstractToken } from '@swarm/types/tokens'
import { from } from 'rxjs'

import { Erc20 } from '@core/contracts/ERC20'
import { VSMT } from '@core/contracts/VSMT'
import { isVSMT } from '@core/shared/utils/tokens'

const contractOf$ =
  () =>
  <T extends Pick<AbstractToken, 'id'> = AbstractToken>(token: T) =>
    from(isVSMT(token) ? VSMT.getVSMTInstance() : Erc20.getInstance(token.id))

export default contractOf$
