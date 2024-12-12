import { usePreviousLocation } from '@swarm/core/hooks/usePreviousLocation'
import api from '@swarm/core/services/api'
import { affiliateProgramLocalStorage } from '@swarm/core/shared/localStorage'
import { useIsLoggedIn } from '@swarm/core/state/hooks/user'
import { ChildrenProps } from '@swarm/types'
import { FC, useEffect } from 'react'
import { QueryParamConfig, StringParam, useQueryParams } from 'use-query-params'

const REFERRAL_CODE_KEY = 'r'
const CAMPAIGN_KEY = 'c'

type AffiliateProgramQueryStringValues = {
  [REFERRAL_CODE_KEY]: QueryParamConfig<string | null | undefined>
  [CAMPAIGN_KEY]: QueryParamConfig<string | null | undefined>
}

export const AffiliateProgram: FC<ChildrenProps> = ({ children }) => {
  const previousLocation = usePreviousLocation()

  const [queryParams] = useQueryParams<AffiliateProgramQueryStringValues>({
    [CAMPAIGN_KEY]: StringParam,
    [REFERRAL_CODE_KEY]: StringParam,
  })

  const isUserLoggedIn = useIsLoggedIn()

  useEffect(() => {
    const referralCode = queryParams[REFERRAL_CODE_KEY]

    if (
      previousLocation === undefined &&
      referralCode !== undefined &&
      referralCode !== null
    ) {
      if (isUserLoggedIn) {
        api
          .linkToAffiliate(referralCode, queryParams[CAMPAIGN_KEY])
          // skip errors, don't bother user
          .catch()
      } else {
        affiliateProgramLocalStorage.set(queryParams)
      }
    }
  }, [previousLocation, queryParams, isUserLoggedIn])

  useEffect(() => {
    if (isUserLoggedIn) {
      const storedAffiliateProgramInfo = affiliateProgramLocalStorage.get()
      const referralCode = storedAffiliateProgramInfo?.[REFERRAL_CODE_KEY]

      if (referralCode !== undefined && referralCode !== null) {
        api
          .linkToAffiliate(
            referralCode,
            storedAffiliateProgramInfo[CAMPAIGN_KEY],
          )
          // skip errors, don't bother user
          .catch()
          .finally(affiliateProgramLocalStorage.remove)
      }
    }
  }, [isUserLoggedIn])

  return <>{children}</>
}
