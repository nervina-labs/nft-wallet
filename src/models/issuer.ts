import { VipInfo } from './class-list'
import { ListMeta, NftType } from './nft'

export interface Issuer extends VipInfo {
  bg_image_url: string
  avatar_url: string
  name: string
  description: string
  uuid: string
  issuer_likes: string
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
  issuer_id: string
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
  uuid: boolean
}
