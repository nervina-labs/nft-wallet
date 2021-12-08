export enum RedEnvelopeState {
  Ongoing = 'ongoing',
  Closed = 'closed',
  Done = 'done',
  Expired = 'expired',
}

export enum RuleType {
  password = 'password',
  puzzle = 'puzzle',
}

export interface RulePuzzleInfo {
  rule_type: RuleType.puzzle
  question: string
}

export interface RulePasswordInfo {
  rule_type: RuleType.password
}

export interface RewardRecord {
  address: string
  rewarded_at: string
  is_special_model: boolean
}

export interface RedEnvelopeResponse {
  uuid: string
  name: string
  cover_image_url: string
  greegings: string
  promotion_copy: string
  promotion_link: string
  state: RedEnvelopeState
  progress: {
    claimed: number
    total: number
  }
  user_claimed: boolean
  issuer_info: {
    name: string
    email: string
    uuid: string
  }
  rule_info: RulePuzzleInfo | RulePasswordInfo | null
  reward_records: RewardRecord[]
}

export interface OpenRedEnvelopeResponse {
  record_uuid: string
  is_special_model: boolean
}
