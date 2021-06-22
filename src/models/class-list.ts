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
  vip_source: VipSource
  is_vip: boolean
  vip_title: string
}

export interface TokenClass extends VipInfo {
  bg_image_url: string
  name: string
  description: string
  issued: string
  is_issuer_banned: boolean
  is_class_banned: boolean
  uuid: string
  class_likes: number
  liked: string
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
