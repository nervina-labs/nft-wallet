import { ClassLikes, VipInfo } from './class-list'
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
  Picture = 'image',
}

export interface NFTToken extends VipInfo {
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
}

export interface NFTDetail extends ClassLikes, VipInfo {
  name: string
  description: string
  bg_image_url: string
  class_uuid: string
  issuer_info: {
    name: string
    uuid: string
    avatar_url: string
  }
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
}
