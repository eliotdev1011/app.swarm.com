/* eslint-disable camelcase */
import { kycProviderMap } from '@swarm/core/shared/consts/kyc-provider-map'

import BaseResponse from './base.response'

export enum SofStatus {
  NotStarted = 'not_started',
  PendingApproval = 'pending_manual',
  InProgress = 'in_progress',
  Approved = 'approved',
}

export type PublicProfileResponse = BaseResponse<{
  kyc_provider: keyof typeof kycProviderMap | null
  sof_status: SofStatus
  mattereum_whitelisted: boolean
}>
