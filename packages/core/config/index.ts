import { IEnvironment } from '@swarm/types/config'
import { BehaviorSubject } from 'rxjs'

import { commonConfig } from './common-config'

const config$ = new BehaviorSubject<IEnvironment>(commonConfig)

export const overrideConfig = <T extends IEnvironment>(
  configOverrides: Partial<T>,
) => {
  config$.next({
    ...config$.getValue(),
    ...configOverrides,
  })
}

export const getAppConfig = (): IEnvironment => {
  return config$.getValue()
}

export default config$.getValue()
