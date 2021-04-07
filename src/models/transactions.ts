export enum TransactionStatus {
  Pending = 'pending',
  Committed = 'commited',
}

export interface Transaction {
  from_address: string
  to_address: string
  token_class_name: string
  token_id: number
  state: TransactionStatus
  tx_hash: string
}
