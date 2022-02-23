import { ClassLikes, VipInfo } from './class-list'
import { Follower } from './issuer'
import { TransactionStatus } from './transactions'

export interface NFT {
  meta: ListMeta
  token_list: NFTToken[]
  holder_address: string
}

export interface ListMeta {
  current_page: number
  total_count: number
}

export enum NftType {
  Audio = 'audio',
  Video = 'video',
  ThreeD = 'three_d',
  Picture = 'image',
}

export interface CardBack {
  card_back_content_exist: boolean
  card_back_content: string
  class_card_back_content?: string
  class_card_back_content_exist?: boolean
}

export interface NFTToken extends VipInfo, CardBack {
  renderer_type: NftType
  class_name: string
  class_bg_image_url: string
  class_uuid: string
  class_description: string
  class_total: string
  token_uuid: string
  issuer_avatar_url?: string
  issuer_name?: string
  issuer_uuid?: string
  tx_state: TransactionStatus
  from_address?: string
  to_address?: string
  is_issuer_banned: boolean
  is_class_banned: boolean
  n_token_id: number
  script_type: 'cota' | 'm_nft'
}

export interface NFTDetail extends ClassLikes, VipInfo, CardBack {
  name: string
  description: string
  bg_image_url: string
  class_uuid: string
  script_type: 'cota' | 'm_nft'
  class_id: string
  n_issuer_id: string
  is_redeemed?: boolean
  product_qr_code?: string
  issuer_info: {
    name: string
    uuid: string
    avatar_url: string
  } & Follower
  total: string
  issued: number
  tx_state: TransactionStatus
  from_address?: string
  to_address?: string
  is_issuer_banned: boolean
  is_class_banned: boolean
  n_token_id: number
  renderer_type: NftType
  renderer: string
  uuid: string
  product_on_sale_uuid?: string
  product_limit: null | number
  product_count: number
  product_price: string
  product_price_currency: string
  thumbnail_url?: string
  album_audios?: Array<{
    name: string
    url: string
  }>
}
