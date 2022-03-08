import { VipInfo } from './class-list'
import { ListMeta } from './nft'

export enum PackEventState {
  Pending = 'pending',
  Completed = 'completed',
}

export interface PackEventListRecord {
  pack_event_info: {
    uuid: string
    name: string
    cover_image_url: string
    pack_options_count: number
    is_banned: boolean
  }
  state: PackEventState
  record_items_count: number
}

export interface PackEventListResponse {
  pack_event_records: PackEventListRecord[]
  meta: ListMeta
}

export interface PackEventDetailResponse {
  pack_event_info: {
    uuid: string
    name: string
    cover_image_url: string
    pack_options_count: number
    is_banned: boolean
    description: string
  }
  state: string
  record_items_count: number
  pack_options: Array<{
    token_class: {
      bg_image_url: string
      uuid: string
      is_banned: boolean
    }
    is_collected: boolean
    is_special_model: boolean
  }>
  issuer_info: {
    name: string
    avatar_url: string
    uuid: string
  } & VipInfo
}

export interface IssuerPackEventResponse {
  pack_events: Array<{
    uuid: string
    name: string
    cover_image_url: string
    pack_options_count: number
  }>
  meta: ListMeta
}
