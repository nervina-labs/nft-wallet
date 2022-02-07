import { AvatarType } from './user'
import { ListMeta } from '.'
import { VipInfo } from './class-list'

export enum RedEnvelopeState {
  Ongoing = 'ongoing',
  Closed = 'closed',
  Done = 'done',
  Expired = 'expired',
  Pending = 'pending',
  Received = 'grabed',
}

export enum RedpackType {
  Wallet = 'wallet-redpack',
  Saas = 'saas-redpack',
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
  } | null
  user_info: {
    address: string
    nickname: string | null
  } | null
  rule_info: RulePuzzleInfo | RulePasswordInfo | null
  is_current_user_claimed: boolean
  is_claimed_special_model: boolean
  redpack_type: RedpackType
}

export interface RedEnvelopeRecords {
  records: RedEnvelopeRecord[]
  meta: ListMeta
}

export interface OpenRedEnvelopeResponse {
  record_uuid: string
  is_special_model: boolean
}

export interface SentRedEnvelopeDetail {
  uuid: string
  created_at: string
  greetings: string
  state: string
  progress: {
    claimed: number
    total: number
  }
  rule_info: {
    rule_type: RuleType
    question: string
  } | null
  tokens_count: number
}

export interface SentRedEnvelopeRecordEvent {
  uuid: string
  created_at: string
  state: RedEnvelopeState
  progress: {
    claimed: number
    total: number
  }
  tokens: Array<{
    bg_image_url: string | null
    n_token_id: number
    uuid: string
  }>
  tokens_count: number
  greeting: string
}

export interface SentRedEnvelopeRecords {
  redpack_events: SentRedEnvelopeRecordEvent[]
  meta: ListMeta
}

export interface ReceivedRedEnvelopeRecordItemIssuerInfo extends VipInfo {
  name: string
  email: string
  uuid: string
  avatar_url: string
}
export interface ReceivedRedEnvelopeRecordItem {
  uuid: string
  address: string
  created_at: string
  record_items: Array<{
    n_token_id: number | null
    is_special_model: boolean
    bg_image_url: null | string
    name: string
    uuid: string
  }>
  greetings: string
  issuer_info: null | ReceivedRedEnvelopeRecordItemIssuerInfo
  user_info: null | {
    nickname: string
    address: string
    avatar_url: string
    avatar_type: AvatarType
    avatar_tid: number
  }
}

export interface ReceivedRedEnvelopeRecords {
  records: ReceivedRedEnvelopeRecordItem[]
  meta: ListMeta
}

export interface SentRedEnvelopeRewordItem {
  token: {
    uuid: string
    n_token_id: number
    bg_image_url: string
    name: string
  }
  state: RedEnvelopeState
}

export interface SentRedEnvelopeReword {
  redpack_reward_plan_items: SentRedEnvelopeRewordItem[]
  meta: ListMeta
}
