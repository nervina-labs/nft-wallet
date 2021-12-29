import { ListMeta } from '../../models'

export interface PoetryVoteCounts {
  poetry_vote: {
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
  unsigned_tx: string
}

export type PoetrySort = '' | 'votes'
