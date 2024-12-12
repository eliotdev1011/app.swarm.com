export enum KycStatus {
  notStarted = 'not_started',
  pending = 'pending_manual',
  inProgress = 'in_progress',
  pendingProvider = 'pending_provider',
  rejected = 'rejected',
  approved = 'approved',
  failed = 'failed',
}
