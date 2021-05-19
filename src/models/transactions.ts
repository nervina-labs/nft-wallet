import { ListMeta } from './nft'

export enum TransactionStatus {
  Pending = 'pending',
  Committed = 'committed',
  Submitting = 'submitting',
}

export enum TransactionDirection {
  Send = 'send',
  Receive = 'receive',
}

export interface Tx {
  from_address: string
  to_address: string
  class_name: string
  tx_hash: number
  tx_state: TransactionStatus
  tx_direction: TransactionDirection
  on_chain_timestamp: string | null
  uuid: string
  issuer_avatar_url: string
  issuer_uuid: string
  is_issuer_banned: boolean
  is_class_banned: boolean
}

export interface Transaction {
  meta: ListMeta
  transaction_list: Tx[]
}
