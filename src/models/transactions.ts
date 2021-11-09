import { AvatarType } from './user'
import { VipInfo } from './class-list'
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

export interface Tx extends VipInfo {
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

export interface TransactionLog {
  tx_hash: string
  on_chain_timestamp: string
  tx_type: string
  issuer_uuid: string
  issuer_avatar_url: string
  issuer_name: string
  sender_info: {
    address: string
    avatar_url: string
    avatar_tid: number
    avatar_token_uuid: string
    avatar_type: AvatarType
    nickname: string
  }
  holder_info: {
    address: string
    avatar_url: string
    avatar_type: AvatarType
    nickname: string
    avatar_token_uuid: string
    avatar_tid: number
  }
}

export interface TransactionLogResponse {
  meta: ListMeta
  transactions: TransactionLog[]
}
