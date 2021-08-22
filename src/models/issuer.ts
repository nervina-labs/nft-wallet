import { VipInfo } from './class-list'
import { ListMeta } from './nft'

export interface Follower {
  issuer_follows: number
  issuer_followed: boolean
}

export interface FollowerResponse {
  followed: boolean
}

export interface Issuer extends VipInfo, Follower {
  bg_image_url: string
  avatar_url: string
  name: string
  description: string
  uuid: string
  issuer_likes: string
  issuer_id: string
}

export interface IssuersResponse {
  issuers: Issuer[]
  meta: ListMeta
}
