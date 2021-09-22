import { ListMeta, NftType } from '.'
import { Issuer, IssuerInfo } from './issuer'
import type { Transaction as PwTransaction } from '@lay2/pw-core'

export enum RedeemType {
  NFT = 'RedemptionTokenReward',
  Blind = 'RedemptionBlindBoxReward',
  Other = 'RedemptionCustomReward',
}

export enum RedeemListType {
  All = 'all',
  CanRedeem = 'can_redeem',
  UserRedeemed = 'user_redeemed',
  UserWaittingRedeem = 'user_waitting_redeem',
}

export enum RedeemStatus {
  Open = 'open',
  Closed = 'closed',
  Done = 'done',
}

export enum UserRedeemState {
  NotAllow = 'not_allow_redeem',
  AllowRedeem = 'allow_redeem',
  WaittingRedeem = 'waitting_redeem',
  Redeemed = 'redeemed',
}

export interface UseRedeemedInfo {
  state: UserRedeemState
  redeemd_reward_uuid: string
}

export interface RedeemProgress {
  total: number
  claimed: number
}

export interface RedeemItem {
  uuid: string
  name: string
  descrition: string
  reward_type: RedeemType
  progress: RedeemProgress
  state: RedeemStatus
  user_redeemed_info: UseRedeemedInfo
  start_timestamp: string
}

export type RewardInfo = NormalRewardInfo[] | BlindRewardInfo | CustomRewardInfo

export interface NormalRewardInfo {
  class_bg_image_url: string
  class_name: string
  class_total: string
  item_count: number
  class_card_back_content_exist: boolean
  renderer_type: NftType
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

export function isCustomReward(info: RewardInfo): info is CustomRewardInfo {
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

export interface RedeemEventItem extends RedeemItem {
  issuer_info: Issuer
  reward_info: RewardInfo
  rule_info: RuleInfo
}

export function isRedeemDetail(
  data: RedeemDetailModel | RedeemEventItem
): data is RedeemDetailModel {
  return Object.prototype.hasOwnProperty.call(data, 'event_info')
}

export function formatToRedeemItem(data: RedeemDetailModel | RedeemEventItem) {
  if (isRedeemDetail(data)) {
    return {
      ...data,
      ...data.event_info,
    }
  }
  return data
}

export interface RedeemRewardDetail {
  reward_type: RedeemType
  reward_info: RewardInfo
  ckb_address?: string
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
}

export interface RedeemParams {
  customData?: CustomRedeemParams
  sig?: string
  tx: PwTransaction
  uuid: string
}

export interface RedeemEvents {
  meta: ListMeta
  events: RedeemEventItem[]
}

export interface RedeemDetailModel {
  issuer_info: IssuerInfo
  event_info: RedeemItem
  rule_info: RuleInfo
  reward_info: RewardInfo
}

export interface RedeemResultResponse {
  created_timestamp: string
  reward_uuid: string
}
