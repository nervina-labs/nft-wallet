import { ListMeta } from '../../models'
export interface PoetryVoteCounts {
  poem_vote: {
    normal_count: number
    special_count: number
  }
}

export interface Poetry {
  poems: Array<{
    uuid: string
    reciter_name: string
    votes_count: number
    serial_no: number
  }>
  meta: ListMeta
}

export interface UnSignedTx {
  unsigned_tx: RPC.RawTransaction
}

export type PoetrySort = '' | 'votes'
