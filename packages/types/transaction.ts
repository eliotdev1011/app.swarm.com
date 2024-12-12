import { XToken } from './tokens'

export type TransactionType =
  | 'swap'
  | 'createPool'
  | 'joinPool'
  | 'joinPoolSingleIn'
  | 'exitPool'
  | 'exitPoolSingleOut'

export interface Transaction {
  id: string
  action: TransactionType
  timestamp: number
  tokensIn: XToken[]
  tokensOut: XToken[]
  tokensInAddresses: string[]
  tokensOutAddresses: string[]
  tokenAmountsIn: string[]
  tokenAmountsOut: string[]
  userAddress?: {
    id: string
  }
  status: string
  value: string
}

export enum TransactionStatus {
  pending = 'pending',
  completed = 'completed',
  failed = 'failed',
}
