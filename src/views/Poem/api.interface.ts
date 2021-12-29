export interface PoetryVoteCounts {
  poetry_vote: {
    normal_count: number
    special_count: number
  }
}

export interface Poetry {
  poetries: Array<{
    uuid: string
    name: string
    reciter_name: string
    votes_count: number
    serial_no: number
  }>
}

export interface UnSignedTx {
  unsigned_tx: string
}

export type PoetrySort = '' | 'votes'
