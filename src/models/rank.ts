import { VipInfo } from './class-list'
import { Follower } from './issuer'

export type RankingListResponse<O extends { uuid?: string }> = O extends {
  uuid: string
}
  ? RankingItem
  : {
      ranking_list: RankingItem[]
    }

export interface RankingListRTokenClass {
  bg_image_url: string
  name: string
  issuer_name: string
  uuid: string
}

export interface RankingIssuer {
  issuers: Issuer[]
}

export interface RankingTokenClass {
  token_classes: RankingListRTokenClass[]
}

export interface RankingItem extends RankingIssuer, RankingTokenClass {
  name: string
  locales: { [key: string]: string }
  uuid: string
}

interface Issuer extends Follower, VipInfo {
  avatar_url: string
  name: string
  uuid: string
}
