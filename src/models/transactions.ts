import { ListMeta } from './nft'

export enum TransactionStatus {
  Pending = 'pending',
  Committed = 'commited',
}

export enum TransactionDirection {
  Send = 'send',
  Receive = 'receive',
}

export interface Tx {
  from_address: string
  to_address: string
  token_class_name: string
  tx_hash: number
  tx_state: TransactionStatus
  tx_direction: TransactionDirection
  on_chain_timestamp: string | null
}

export interface Transaction {
  meta: ListMeta
  transaction_list: Tx[]
}
