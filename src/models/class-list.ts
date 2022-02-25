import { Follower } from './issuer'
import { ListMeta, NftType, CardBack } from './nft'

export interface Tag {
  uuid: string
  name: string
  locales: {
    [key: string]: string
  }
}

export enum VipSource {
  Weibo = 'weibo',
  Nervina = 'official',
}

export interface VipInfo {
  verified_info?: {
    is_verified: boolean
    verified_title: string
    verified_source: VipSource
  }
}

export interface ClassLikes {
  class_likes: number
  class_liked: boolean
}

export interface TokenClass extends VipInfo, ClassLikes, CardBack {
  bg_image_url: string
  name: string
  description: string
  issued: string
  is_redeemed?: boolean
  is_issuer_banned: boolean
  is_class_banned: boolean
  uuid: string
  product_qr_code?: string
  issuer_info?: {
    name: string
    avatar_url: string
    uuid: string
  } & Follower
  total: string
  tags: Tag[]
  renderer_type: NftType
  renderer: string
  product_on_sale_uuid: string
  product_limit: null | number
  product_count: number
  product_price_currency: string
  product_price?: string
  off_site_product_info?: {
    price: string
    url: string
  }
  thumbnail_url?: string
  script_type: 'cota' | 'm_nft'
}

export function isTokenClass(data: any): data is TokenClass {
  return data && Object.hasOwnProperty.call(data, 'product_price')
}
export interface ClassList {
  class_list: TokenClass[]
  meta: ListMeta
}

export interface FollowClassList {
  token_classes: TokenClass[]
  meta: ListMeta
}
