import { of } from 'rxjs'
import { distinctUntilChanged, switchMap } from 'rxjs/operators'

import api from '@core/services/api'
import { account$ } from '@core/web3'

const isAccountRegistered$ = () =>
  account$.pipe(
    distinctUntilChanged(),
    switchMap((account) => (account ? api.checkExistence(account) : of(false))),
    distinctUntilChanged(),
  )

export default isAccountRegistered$
