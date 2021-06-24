import { ListMeta } from './nft'

export interface Tag {
  uuid: string
  name: string
  locales: {
    [key: string]: string
  }
}

export enum VipSource {
  Weibo = 'weibo',
  Twitter = 'twitter',
  Nervina = 'nervina',
}

export interface VipInfo {
  weibo_auth_info?: {
    is_verified: boolean
    verified_title: string
  }
}

export interface ClassLikes {
  class_likes: string
  liked: boolean
}

export interface TokenClass extends VipInfo, ClassLikes {
  bg_image_url: string
  name: string
  description: string
  issued: string
  is_issuer_banned: boolean
  is_class_banned: boolean
  uuid: string
  issuer_info: {
    name: string
    avatar_url: string
    uuid: string
  }
  total: string
  tags: Tag[]
}

export interface ClassList {
  class_list: TokenClass[]
  meta: ListMeta
}
