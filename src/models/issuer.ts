import { VipInfo } from './class-list'
import { ListMeta, NftType } from './nft'

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
  is_banned: boolean
  is_issuer_banned: boolean
}

export interface IssuersResponse {
  issuers: Issuer[]
  meta: ListMeta
}

export enum SocialMediaType {
  Weibo = 'weibo',
  Bilibili = 'bilibili',
  Douyin = 'douyin',
  Behance = 'behance',
  Github = 'github',
  Facebook = 'facebook',
  Instagram = 'instagram',
  Twitter = 'twitter',
}

export interface IssuerInfo extends VipInfo {
  avatar_url: string
  name: string
  description: string | null
  website: string
  email: string
  weibo: string | null
  issuer_likes: number
  issuer_follows: number
  issuer_followed: boolean
  is_issuer_banned: boolean
  issuer_id: string
  uuid: string
  on_sale_product_count: number
  issued_class_count: number
  social_media: Array<{
    socia_type: SocialMediaType
    url: string
  }>
}

export interface IssuerTokenClassResult {
  meta: ListMeta
  token_classes: IssuerTokenClass[]
}

export interface IssuerTokenClass {
  bg_image_url: string
  class_liked: false
  class_likes: number
  issued: string
  name: string
  renderer_type: NftType
  total: string
  card_back_content_exist: boolean
  uuid: string
  product_price: string
}
