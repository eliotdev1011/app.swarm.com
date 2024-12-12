/* eslint-disable @typescript-eslint/no-use-before-define */

import useAsyncMemo from '@swarm/core/hooks/async/useAsyncMemo'
import useFeatureFlags, {
  FlaggedFeatureName,
} from '@swarm/core/hooks/data/useFeatureFlags'
import usePopupState from '@swarm/core/hooks/state/usePopupState'
import useInvestSecurities from '@swarm/core/hooks/subgraph/useInvestSecurities'
import api from '@swarm/core/services/api'
import { useAccount } from '@swarm/core/web3'
import { ChildrenProps } from '@swarm/types'
import { SofStatus } from '@swarm/types/api-responses/public-profile.response'
import { AbstractToken } from '@swarm/types/tokens'
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'

import ConfirmModal from './ConfirmModal'
import InvestSecurityModal from './InvestSecurityModal'

export const InvestSecurityContext = createContext<{
  sofStatus: SofStatus | null
  securityGranted: boolean
  checkSecurityPermission: (
    tokenIn: AbstractToken,
    tokenOut: AbstractToken,
  ) => Promise<boolean>
  checkUserSofStatus: () => Promise<boolean>
}>({
  sofStatus: null,
  securityGranted: false,
  checkSecurityPermission: () => {
    throw new Error(
      "Can't call checkSecurityPermission outside of InvestSecurityContext",
    )
  },
  checkUserSofStatus: () => {
    throw new Error(
      "Can't call checkUserSofStatus outside of InvestSecurityContext",
    )
  },
})

export const InvestSecurityProvider = ({ children }: ChildrenProps) => {
  const [securityGranted, setSecurityGranted] = useState(false)

  const { t } = useTranslation('invest')
  const { checkFeature } = useFeatureFlags()

  const { isOpen, open, close } = usePopupState(false)
  const {
    isOpen: isInProgressOpen,
    open: openInProgress,
    close: closeInProgress,
  } = usePopupState(false)
  const account = useAccount()
  const { isSecurityToken } = useInvestSecurities()

  const [sofStatus, { loading, promise: sofStatusPromise, reload: reloadSoF }] =
    useAsyncMemo(
      async () => {
        if (!account) return null
        const profile = await api.publicProfile(account)
        return profile.attributes.sof_status
      },
      null,
      [account],
    )

  const checkUserSofStatus = useCallback(async () => {
    let status
    if (!sofStatus && loading) {
      status = await sofStatusPromise
    } else {
      status = sofStatus
    }

    const isNotStarted = status === SofStatus.NotStarted
    const inProgress =
      status === SofStatus.InProgress || status === SofStatus.PendingApproval
    const isApproved = status === SofStatus.Approved

    if (inProgress) {
      openInProgress()
    } else if (isNotStarted) {
      open()
    }

    setSecurityGranted(isApproved)
    return isApproved
  }, [loading, open, openInProgress, sofStatus, sofStatusPromise])

  const checkSecurityPermission = useCallback(
    async (tokenIn: AbstractToken, tokenOut: AbstractToken) => {
      const isTokenInSecurity = isSecurityToken(tokenIn)
      const isTokenOutSecurity = isSecurityToken(tokenOut)

      if (
        !checkFeature(FlaggedFeatureName.securityTokensVerification) ||
        (!isTokenInSecurity && !isTokenOutSecurity) ||
        !account
      ) {
        return true
      }

      return checkUserSofStatus()
    },
    [account, checkFeature, checkUserSofStatus, isSecurityToken],
  )

  const handleClose = useCallback(() => {
    reloadSoF()
    close()
  }, [close, reloadSoF])

  const value = useMemo(() => {
    return {
      sofStatus,
      securityGranted,
      checkSecurityPermission,
      checkUserSofStatus,
    }
  }, [sofStatus, securityGranted, checkSecurityPermission, checkUserSofStatus])

  return (
    <InvestSecurityContext.Provider value={value}>
      {children}
      <InvestSecurityModal isOpen={isOpen} onClose={handleClose} />
      <ConfirmModal
        isOpen={isInProgressOpen}
        onClose={closeInProgress}
        description={t('inProgressModal.description')}
      />
    </InvestSecurityContext.Provider>
  )
}

export const useInvestSecurityContext = () => useContext(InvestSecurityContext)
