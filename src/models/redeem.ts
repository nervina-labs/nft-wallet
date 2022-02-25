import { ListMeta, NftType } from '.'
import { Issuer, IssuerInfo } from './issuer'
import type { Transaction as PwTransaction } from '@lay2/pw-core'
import { VipInfo } from './class-list'

export enum RedeemType {
  NFT = 'token',
  Blind = 'blind_box',
  Other = 'custom',
}

export enum RedeemListType {
  All = 'all',
  CanRedeem = 'can_redeem',
  UserRedeemed = 'user_redeemed',
  UserWaitingRedeem = 'user_pending_acceptance',
}

export enum RedeemStatus {
  Open = 'ongoing',
  Closed = 'closed',
  Done = 'done',
}

export enum UserRedeemState {
  NotAllow = 'not_allow_redeem',
  AllowRedeem = 'allow_redeem',
  WaitingRedeem = 'pending_acceptance',
  Redeemed = 'redeemed',
}

export interface RedeemProgress {
  total: number
  claimed: number
}

export interface RedeemItem {
  uuid: string
  name: string
  description: string
  reward_type: RedeemType
  progress: RedeemProgress
  state: RedeemStatus
  user_redeemed_state: UserRedeemState
  start_timestamp: string
  user_redeemed_record_uuid: string
}

export type RewardInfo = NormalRewardInfo[] | BlindRewardInfo | CustomRewardInfo

export interface NormalRewardInfo {
  class_bg_image_url: string
  class_name: string
  class_total: string
  item_count: number
  card_back_content_exist: boolean
  renderer_type: NftType
  n_token_id?: number
  class_uuid: string
  token_uuid?: string
  is_banned: boolean
  is_class_banned: boolean
  is_issuer_banned: boolean
  token_class_uuid: string
}

export interface BlindRewardInfo {
  every_box_reward_count: string
  options: NormalRewardInfo[]
}

export enum CustomRewardType {
  Email = 'email',
  Address = 'mailing',
  Ckb = 'on_chain_transfer',
  None = 'none',
}

export interface CustomRewardInfo {
  reward_name: string
  reward_description: string
  images: string[]
  delivery_type: CustomRewardType
  delivery_info: CustomRedeemParams
  comment: string
}

export function isNormalReward(info: RewardInfo): info is NormalRewardInfo[] {
  return Array.isArray(info)
}

export function isBlindReward(info: RewardInfo): info is BlindRewardInfo {
  return (
    !isNormalReward(info) &&
    Object.prototype.hasOwnProperty.call(info, 'every_box_reward_count')
  )
}

export function isCustomReward(info?: RewardInfo): info is CustomRewardInfo {
  if (!info) {
    return false
  }
  return (
    !isNormalReward(info) &&
    Object.prototype.hasOwnProperty.call(info, 'reward_name')
  )
}

export interface RuleInfoOption extends NormalRewardInfo {
  item_owned_count: number
}

export interface RuleInfo {
  rule_type: string
  will_destroyed: boolean
  options: RuleInfoOption[]
}

export interface RedeemEventItem extends RedeemItem, VipInfo {
  issuer_info: Omit<Issuer, 'verified_info'>
  reward_info: RewardInfo
  rule_info: RuleInfo
}

export interface RewardDetailResponse {
  reward_type: RedeemType
  redeemed_timestamp: string
  record_info: RewardInfo
}

export function isRedeemDetail(
  data: RedeemDetailModel | RedeemEventItem
): data is RedeemDetailModel {
  return Object.prototype.hasOwnProperty.call(data, 'event_info')
}

export function formatToRedeemItem(data: RedeemDetailModel | RedeemEventItem) {
  if (isRedeemDetail(data)) {
    return data
  }
  return data
}

export interface RedeemRewardDetail {
  reward_type: RedeemType
  reward_info: RewardInfo
  wallet_address?: string
  user_ship_info?: {
    name: string
    phone_number: string
    address: string
  }
  comment?: string
}

export interface CustomRedeemParams {
  name?: string
  phone_number?: string
  address?: string
  ckb_address?: string
  email?: string
}

export interface RedeemParams {
  customData?: CustomRedeemParams
  sig?: string
  tx: PwTransaction | RPC.RawTransaction
  uuid: string
}

export interface RedeemEvents {
  meta: ListMeta
  event_list: RedeemEventItem[]
}

export interface MyRedeemEvents {
  meta: ListMeta
  record_list: RedeemEventItem[]
}

export interface RedeemDetailModel extends RedeemItem, VipInfo {
  issuer_info: Omit<IssuerInfo, 'verified_info'>
  rule_info: RuleInfo
  reward_info: RewardInfo
}

export interface RedeemResultResponse {
  redeemed_timestamp: string
  reward_uuid: string
}
