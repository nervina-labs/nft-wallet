import { ListMeta } from '.'

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

export interface RecordItem {
  is_special_model: boolean
  bg_image_url: string | null
}

export interface RedEnvelopeRecord {
  uuid: string
  address: string
  created_at: string
  record_items: RecordItem[]
}

export interface RedEnvelopeResponse {
  uuid: string
  name: string
  cover_image_url: string
  greetings: string
  promotion_copy: string
  promotion_link: string
  state: RedEnvelopeState
  progress: {
    claimed: number
    total: number
  }
  issuer_info: {
    name: string
    email: string
    uuid: string
  }
  rule_info: RulePuzzleInfo | RulePasswordInfo | null
  current_user_reward_record: {
    address: string
    created_at: string
    record_items: RecordItem[]
  } | null
}

export interface RedEnvelopeRecords {
  records: RedEnvelopeRecord[]
  meta: ListMeta
}

export interface OpenRedEnvelopeResponse {
  record_uuid: string
  is_special_model: boolean
}
