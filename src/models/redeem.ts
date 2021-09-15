import { ListMeta, NftType } from '.'
import { Issuer, IssuerInfo } from './issuer'

export enum RedeemType {
  NFT = 'RedemptionTokenReward',
  Blind = 'RedemptionBlindBoxReward',
  Other = 'RedemptionCustomReward',
}

export enum RedeemListType {
  All = 'all',
  CanRedeem = 'can_redeem',
  UserRedeemed = 'user_redeemed',
  UserWaitting_redeem = 'user_waitting_redeem',
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
  timestamp: string
}

export interface RewardInfo {
  class_bg_image_url: string
  class_name: string
  class_total: string
  item_count: number
  class_card_back_content_exist: boolean
  renderer_type: NftType
}

export interface RuleInfoOption extends RewardInfo {
  item_owned_count: number
}

export interface RuleInfo {
  rule_type: string
  will_destroyed: boolean
  options: RuleInfoOption[]
}

export interface RedeemEventItem extends RedeemItem {
  issuer_info: Issuer
  reward_info: RewardInfo[]
}

export interface RedeemEvents {
  meta: ListMeta
  events: RedeemEventItem[]
}

export interface RedeemDetailModel {
  issuer_info: IssuerInfo
  event_info: RedeemItem
  rule_info: RuleInfo
  reward_info: RewardInfo[]
}
